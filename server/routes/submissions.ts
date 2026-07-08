/**
 * Student Submission Upload & AI Grading Route
 * 
 * POST /api/submissions/upload
 * - Accepts multipart/form-data with a file + lessonId + userId
 * - Validates file type and size
 * - Parses file content
 * - Triggers AI grading
 * - Stores results in the database
 */

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";
import * as db from "../db";
import { parseFileContent, evaluateSubmission } from "../_core/aiGrading";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = express.Router();

// Ensure submissions directory exists
const submissionsDir = path.join(process.cwd(), "public", "submissions");
if (!fs.existsSync(submissionsDir)) {
  fs.mkdirSync(submissionsDir, { recursive: true });
}

// Configure multer for submission files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, submissionsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `sub_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const ALLOWED_EXTENSIONS = ['.txt', '.py', '.ipynb', '.csv', '.pdf', '.js', '.ts', '.java', '.c', '.cpp', '.html', '.css', '.r', '.sql', '.md', '.json'];

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type '${ext}' is not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}`));
    }
  },
});

// ─── Simple rate limiter (in-memory) ──────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max submissions per hour per user
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── UPLOAD & GRADE ENDPOINT ──────────────────────────────────────────────────

router.post(
  "/upload",
  uploadMiddleware.single("file"),
  async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { lessonId, userId } = req.body;

      // Validate required fields
      if (!lessonId || !userId) {
        res.status(400).json({ error: "lessonId and userId are required" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      // Rate limiting
      if (!checkRateLimit(userId)) {
        res.status(429).json({ error: "Rate limit exceeded. Max 5 submissions per hour." });
        return;
      }

      // Fetch assignment for this lesson
      const assignment = await db.getAssignmentByLessonId(String(lessonId));
      if (!assignment || !assignment.isActive) {
        res.status(400).json({ error: "No active assignment found for this lesson." });
        return;
      }

      // Check attempt count
      const attemptCount = await db.getSubmissionCount(userId, assignment.id);
      if (attemptCount >= (assignment.maxAttempts || 3)) {
        res.status(400).json({ error: `Maximum attempts reached (${assignment.maxAttempts || 3}).` });
        return;
      }

      // Create submission record
      const fileUrl = `/submissions/${req.file.filename}`;
      const submission = await db.createSubmission({
        userId,
        assignmentId: assignment.id,
        fileUrl,
        fileName: req.file.originalname,
        fileSizeBytes: req.file.size,
        fileMimeType: req.file.mimetype,
        attemptNumber: attemptCount + 1,
      });

      // Immediately respond with submission ID (grading happens async-ish but fast)
      res.json({
        success: true,
        submissionId: submission.id,
        status: "processing",
        attemptNumber: submission.attemptNumber,
      });

      // ─── BACKGROUND GRADING ───────────────────────────────────────────
      // Note: We respond first, then grade. The client will poll for results.
      try {
        await db.updateSubmissionStatus(submission.id, "processing");

        // Parse file content
        const fileBuffer = fs.readFileSync(req.file.path);
        const studentContent = parseFileContent(fileBuffer, req.file.originalname, req.file.mimetype);

        if (!studentContent || studentContent.trim().length === 0) {
          await db.updateSubmissionStatus(submission.id, "failed");
          await db.createGradingResult({
            submissionId: submission.id,
            score: 0,
            maxScore: assignment.maxScore || 100,
            percentage: 0,
            status: "fail",
            summary: "Unable to extract content from the uploaded file.",
            feedbackJson: { strengths: [], weaknesses: ["File appears to be empty or unreadable."], suggestions: ["Please upload a valid file with readable content."], rubricBreakdown: [] },
            providerUsed: "none",
            modelUsed: "none",
          });
          return;
        }

        // Evaluate with AI
        const evaluation = await evaluateSubmission({
          instructions: assignment.instructions || "",
          rubric: assignment.rubric || "",
          maxScore: assignment.maxScore || 100,
          studentContent,
          fileName: req.file.originalname,
        });

        // Store grading result
        await db.createGradingResult({
          submissionId: submission.id,
          score: evaluation.result.score,
          maxScore: evaluation.result.maxScore,
          percentage: evaluation.result.percentage,
          status: evaluation.result.status,
          summary: evaluation.result.summary,
          feedbackJson: {
            strengths: evaluation.result.strengths,
            weaknesses: evaluation.result.weaknesses,
            suggestions: evaluation.result.suggestions,
            rubricBreakdown: evaluation.result.rubricBreakdown,
          },
          providerUsed: evaluation.providerUsed,
          modelUsed: evaluation.modelUsed,
          promptTokens: evaluation.promptTokens,
          completionTokens: evaluation.completionTokens,
        });

        await db.updateSubmissionStatus(submission.id, "completed");
        console.log(`[AI Grading] ✅ Submission ${submission.id} graded: ${evaluation.result.score}/${evaluation.result.maxScore}`);

      } catch (gradingError: any) {
        console.error(`[AI Grading] ❌ Grading failed for submission ${submission.id}:`, gradingError.message);
        await db.updateSubmissionStatus(submission.id, "failed");
        await db.createGradingResult({
          submissionId: submission.id,
          score: 0,
          maxScore: assignment.maxScore || 100,
          percentage: 0,
          status: "review",
          summary: "AI grading failed. Your submission has been saved and will be reviewed manually.",
          feedbackJson: { strengths: [], weaknesses: [], suggestions: ["Please try resubmitting later."], rubricBreakdown: [] },
          providerUsed: "error",
          modelUsed: gradingError.message.substring(0, 100),
        });
      }

    } catch (error: any) {
      console.error("[Submissions] Upload error:", error);
      res.status(500).json({ error: error.message || "Upload failed" });
    }
  }
);

// Multer error handler
router.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "File too large (max 5MB)" });
      return;
    }
  }
  res.status(400).json({ error: err.message || "Upload error" });
});

export default router;

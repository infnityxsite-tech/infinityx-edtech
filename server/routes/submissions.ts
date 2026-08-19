import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import * as db from "../db";
import { evaluateSubmission, parseFileContent } from "../_core/aiGrading";
import { getAdminFromRequest, getStudentFromRequest, requireStudent } from "../_core/requestAuth";
import { destroyStoredAsset, getPrivateDownloadUrl, uploadPrivateSubmission } from "../storage";

const router = express.Router();
const MAX_SUBMISSION_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  ".txt", ".py", ".ipynb", ".csv", ".pdf", ".js", ".ts", ".java",
  ".c", ".cpp", ".html", ".css", ".r", ".sql", ".md", ".json",
]);
const ALLOWED_MIME_TYPES = new Set([
  "application/json",
  "application/pdf",
  "application/octet-stream",
  "application/x-ipynb+json",
  "text/csv",
  "text/css",
  "text/html",
  "text/javascript",
  "text/markdown",
  "text/plain",
  "text/x-c",
  "text/x-c++src",
  "text/x-java-source",
  "text/x-python",
  "text/x-r-source",
  "text/x-sql",
  "video/mp2t",
]);

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SUBMISSION_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, ALLOWED_EXTENSIONS.has(extension) && ALLOWED_MIME_TYPES.has(file.mimetype));
  },
});

function hasValidSubmissionContent(file: Express.Multer.File): boolean {
  const extension = path.extname(file.originalname).toLowerCase();
  if (extension === ".pdf") return file.buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  return !file.buffer.subarray(0, Math.min(file.buffer.length, 8192)).includes(0);
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

router.post(
  "/upload",
  requireStudent,
  uploadMiddleware.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    let storedReference: string | null = null;
    let submissionCreated = false;

    try {
      const { lessonId, userId } = req.body;
      const authenticatedStudentId = String(res.locals.student.id);
      if (!lessonId || !userId) {
        res.status(400).json({ error: "lessonId and userId are required" });
        return;
      }
      if (String(userId) !== authenticatedStudentId) {
        res.status(403).json({ error: "The submission user does not match the authenticated student" });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: "No valid submission file was uploaded" });
        return;
      }
      if (!hasValidSubmissionContent(req.file)) {
        res.status(400).json({ error: "The submission content does not match its file type" });
        return;
      }
      if (!checkRateLimit(authenticatedStudentId)) {
        res.status(429).json({ error: "Rate limit exceeded. Max 5 submissions per hour." });
        return;
      }

      const assignment = await db.getAssignmentByLessonId(String(lessonId));
      if (!assignment || !assignment.isActive) {
        res.status(400).json({ error: "No active assignment found for this lesson." });
        return;
      }

      const attemptCount = await db.getSubmissionCount(authenticatedStudentId, assignment.id);
      if (attemptCount >= (assignment.maxAttempts || 3)) {
        res.status(400).json({ error: `Maximum attempts reached (${assignment.maxAttempts || 3}).` });
        return;
      }

      storedReference = await uploadPrivateSubmission(req.file.buffer);
      const submission = await db.createSubmission({
        userId: authenticatedStudentId,
        assignmentId: assignment.id,
        fileUrl: storedReference,
        fileName: path.basename(req.file.originalname).replace(/[\r\n]/g, "").slice(0, 255),
        fileSizeBytes: req.file.size,
        fileMimeType: req.file.mimetype,
        attemptNumber: attemptCount + 1,
      });
      submissionCreated = true;

      // Netlify can freeze work after an HTTP response. Complete grading before
      // returning so a successful upload never leaves an abandoned job.
      try {
        await db.updateSubmissionStatus(submission.id, "processing");
        const studentContent = parseFileContent(req.file.buffer, req.file.originalname, req.file.mimetype);

        if (!studentContent.trim()) {
          await db.updateSubmissionStatus(submission.id, "failed");
          await db.createGradingResult({
            submissionId: submission.id,
            score: 0,
            maxScore: assignment.maxScore || 100,
            percentage: 0,
            status: "fail",
            summary: "Unable to extract content from the uploaded file.",
            feedbackJson: {
              strengths: [],
              weaknesses: ["File appears to be empty or unreadable."],
              suggestions: ["Please upload a valid file with readable content."],
              rubricBreakdown: [],
            },
            providerUsed: "none",
            modelUsed: "none",
          });
        } else {
          const evaluation = await evaluateSubmission({
            instructions: assignment.instructions || "",
            rubric: assignment.rubric || "",
            maxScore: assignment.maxScore || 100,
            studentContent,
            fileName: req.file.originalname,
          });
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
        }
      } catch (gradingError) {
        console.error(`Submission ${submission.id} grading failed`);
        await db.updateSubmissionStatus(submission.id, "failed");
        await db.createGradingResult({
          submissionId: submission.id,
          score: 0,
          maxScore: assignment.maxScore || 100,
          percentage: 0,
          status: "review",
          summary: "AI grading failed. Your submission has been saved and will be reviewed manually.",
          feedbackJson: { strengths: [], weaknesses: [], suggestions: ["Please try again later."], rubricBreakdown: [] },
          providerUsed: "error",
          modelUsed: gradingError instanceof Error ? gradingError.name : "unknown-error",
        });
      }

      res.status(200).json({
        success: true,
        submissionId: submission.id,
        status: "processing",
        attemptNumber: submission.attemptNumber,
      });
    } catch (error) {
      if (storedReference && !submissionCreated) {
        await destroyStoredAsset(storedReference).catch(() => undefined);
      }
      const message = error instanceof Error ? error.message : "Upload failed";
      console.error("Student submission upload failed:", message);
      const status = message.includes("credentials are not configured") ? 503 : 500;
      res.status(status).json({ error: status === 503 ? "Cloud storage is not configured" : "Upload failed" });
    }
  }
);

router.get("/:submissionId/download", async (req: Request, res: Response): Promise<void> => {
  try {
    const submissionId = Number.parseInt(req.params.submissionId, 10);
    if (!Number.isSafeInteger(submissionId) || submissionId <= 0) {
      res.status(400).json({ error: "Invalid submission ID" });
      return;
    }

    const [student, admin, submission] = await Promise.all([
      getStudentFromRequest(req).catch(() => null),
      getAdminFromRequest(req).catch(() => null),
      db.getSubmissionById(submissionId),
    ]);
    if (!submission) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }
    if (!admin && (!student || String(submission.userId) !== String(student.id))) {
      res.status(403).json({ error: "Not authorized to download this submission" });
      return;
    }

    const signedUrl = getPrivateDownloadUrl(submission.fileUrl, submission.fileName || "submission");
    res.setHeader("Cache-Control", "no-store, private");
    res.redirect(302, signedUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed";
    const status = message.includes("credentials are not configured") ? 503 : 500;
    res.status(status).json({ error: status === 503 ? "Cloud storage is not configured" : "Download failed" });
  }
});

router.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large (max 5MB)" });
  }
  const message = error instanceof Error ? error.message : "Upload error";
  return res.status(400).json({ error: message });
});

export default router;


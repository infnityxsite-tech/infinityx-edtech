import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Loader2, Upload, X, CheckCircle2, AlertTriangle, Sparkles,
  FileText, ChevronDown, ChevronUp, RotateCcw, Trophy, Target,
  Lightbulb, XCircle
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface AIAssistantDrawerProps {
  open: boolean;
  onClose: () => void;
  lessonId: string | number;
  lessonTitle: string;
  studentId: string;
  isEnrolled: boolean;
}

interface SubmissionResult {
  id: number;
  fileUrl: string;
  fileName: string;
  status: string;
  attemptNumber: number;
  submittedAt: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  summary?: string;
  feedbackJson?: {
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
    rubricBreakdown?: Array<{ criterion: string; score: number; maxScore: number; comment: string }>;
  };
  providerUsed?: string;
  gradingStatus?: string;
}

// ─── SCORE RING ───────────────────────────────────────────────────────────────

function ScoreRing({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = Math.round((score / maxScore) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#3b82f6" : pct >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{pct}</span>
        <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
      </div>
    </div>
  );
}

// ─── FEEDBACK SECTION ─────────────────────────────────────────────────────────

function FeedbackSection({ result }: { result: SubmissionResult }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const fb = result.feedbackJson;

  return (
    <div className="space-y-4">
      {/* Score + Summary */}
      <div className="flex items-center gap-4">
        {result.score !== undefined && result.maxScore !== undefined && (
          <ScoreRing score={result.score} maxScore={result.maxScore} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {result.gradingStatus === "pass" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {result.gradingStatus === "fail" && <XCircle className="w-4 h-4 text-red-500" />}
            {result.gradingStatus === "review" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            <span className="text-sm font-bold text-slate-800 capitalize">{result.gradingStatus || "Graded"}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Strengths */}
      {fb?.strengths && fb.strengths.length > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
          <h5 className="text-xs font-bold text-green-700 flex items-center gap-1.5 mb-2">
            <Trophy className="w-3.5 h-3.5" /> Strengths
          </h5>
          <ul className="space-y-1">
            {fb.strengths.map((s, i) => (
              <li key={i} className="text-xs text-green-800 flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {fb?.weaknesses && fb.weaknesses.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <h5 className="text-xs font-bold text-amber-700 flex items-center gap-1.5 mb-2">
            <Target className="w-3.5 h-3.5" /> Areas for Improvement
          </h5>
          <ul className="space-y-1">
            {fb.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {fb?.suggestions && fb.suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <h5 className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-3.5 h-3.5" /> Suggestions
          </h5>
          <ul className="space-y-1">
            {fb.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rubric Breakdown */}
      {fb?.rubricBreakdown && fb.rubricBreakdown.length > 0 && (
        <div>
          <button onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-2">
            {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Detailed Rubric Breakdown
          </button>
          {showBreakdown && (
            <div className="space-y-2">
              {fb.rubricBreakdown.map((item, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">{item.criterion}</span>
                    <span className="text-xs font-bold text-indigo-600">{item.score}/{item.maxScore}</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${Math.min((item.score / item.maxScore) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">{item.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN DRAWER ──────────────────────────────────────────────────────────────

export default function AIAssistantDrawer({
  open, onClose, lessonId, lessonTitle, studentId, isEnrolled
}: AIAssistantDrawerProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pollingId, setPollingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch assignment for this lesson
  const { data: assignment, isLoading: assignmentLoading } = trpc.admin.getAssignment.useQuery(
    { lessonId: String(lessonId) },
    { enabled: open && !!lessonId }
  );

  // Fetch submissions
  const { data: submissions = [], refetch: refetchSubmissions } = trpc.admin.getSubmissions.useQuery(
    { userId: studentId, assignmentId: assignment?.id || 0 },
    { enabled: open && !!assignment?.id && !!studentId }
  );

  // Poll for processing submissions
  useEffect(() => {
    const hasProcessing = (submissions as SubmissionResult[]).some(
      (s) => s.status === "processing" || s.status === "uploaded"
    );
    if (hasProcessing) {
      const interval = setInterval(() => { refetchSubmissions(); }, 3000);
      return () => clearInterval(interval);
    }
  }, [submissions, refetchSubmissions]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!assignment || !studentId) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("lessonId", String(lessonId));
      formData.append("userId", studentId);

      const response = await fetch("/api/submissions/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setPollingId(result.submissionId);
      refetchSubmissions();
    } catch (err: any) {
      alert(err.message || "Failed to upload submission");
    } finally {
      setUploading(false);
    }
  }, [assignment, studentId, lessonId, refetchSubmissions]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = ""; // Reset for re-upload
  }, [handleFileUpload]);

  if (!open) return null;

  const hasAssignment = !!assignment;
  const latestSubmission = (submissions as SubmissionResult[])?.[0];
  const isProcessing = latestSubmission?.status === "processing" || latestSubmission?.status === "uploaded";
  const submissionCount = (submissions as SubmissionResult[]).length;
  const maxAttempts = assignment?.maxAttempts || 3;
  const canSubmit = hasAssignment && submissionCount < maxAttempts && !uploading && !isProcessing;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[61] shadow-2xl flex flex-col
                      transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">AI Assignment Assistant</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{lessonTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {assignmentLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            </div>
          ) : !hasAssignment ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="font-semibold text-slate-700 mb-1">No Assignment</h4>
              <p className="text-sm text-slate-400">This lesson doesn't have an AI-graded assignment.</p>
            </div>
          ) : (
            <>
              {/* Instructions */}
              {assignment.instructions && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-indigo-700 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Assignment Instructions
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{assignment.instructions}</p>
                </div>
              )}

              {/* Attempt Counter */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Attempts: <span className="font-bold text-slate-700">{submissionCount}</span> / {maxAttempts}
                </span>
                {assignment.allowedFileTypes && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                    {assignment.allowedFileTypes}
                  </span>
                )}
              </div>

              {/* Upload Zone */}
              {canSubmit && (
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
                    ${dragOver
                      ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" className="hidden"
                    accept={assignment.allowedFileTypes?.split(',').join(',') || ".txt,.py,.ipynb,.csv,.pdf"}
                    onChange={handleFileInput} />
                  <Upload className={`w-8 h-8 mx-auto mb-3 ${dragOver ? 'text-indigo-500' : 'text-slate-300'}`} />
                  <p className="font-semibold text-sm text-slate-700">
                    {dragOver ? "Drop your file here" : "Drop file or click to upload"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Max {assignment.maxFileSizeMb || 5}MB</p>
                </div>
              )}

              {/* Uploading State */}
              {uploading && (
                <div className="flex items-center justify-center gap-3 py-6 bg-indigo-50 rounded-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                  <span className="text-sm font-medium text-indigo-700">Uploading...</span>
                </div>
              )}

              {/* Processing State */}
              {isProcessing && !uploading && (
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-violet-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-violet-500 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">AI is evaluating your work...</h4>
                  <p className="text-xs text-slate-500">This usually takes 10-30 seconds. Stay on this page.</p>
                  <div className="mt-3 h-1.5 bg-violet-200 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              )}

              {/* Submission Results */}
              {(submissions as SubmissionResult[]).filter(s => s.status === "completed" || s.status === "failed").map((sub, i) => (
                <div key={sub.id} className={`border rounded-2xl p-4 ${i === 0 ? 'border-indigo-200 bg-white shadow-sm' : 'border-slate-100 bg-slate-50/50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500">
                      Attempt #{sub.attemptNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  {sub.status === "completed" && sub.score !== undefined ? (
                    <FeedbackSection result={sub} />
                  ) : (
                    <div className="text-center py-4">
                      <XCircle className="w-8 h-8 text-red-300 mx-auto mb-2" />
                      <p className="text-sm text-red-600 font-medium">Grading failed</p>
                      <p className="text-xs text-slate-400 mt-1">{sub.summary || "Please try resubmitting."}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Max attempts reached */}
              {submissionCount >= maxAttempts && !isProcessing && (
                <div className="text-center py-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-amber-700">Maximum attempts reached</p>
                  <p className="text-xs text-amber-600 mt-1">You've used all {maxAttempts} submission attempts.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

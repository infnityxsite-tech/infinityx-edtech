import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { toast } from "sonner";
import {
  Loader2, Plus, Edit2, Trash2, ChevronRight, ChevronLeft,
  BookOpen, Video, FileText, HelpCircle, Check, X,
  MoreVertical, Copy, Download, Search, ChevronUp, ChevronDown
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Material { title: string; url: string }
interface QuizOption { text: string }
interface QuizBlock { id: string; question: string; options: QuizOption[]; correctIndex: number; orderIndex: number }
interface AssignmentBlock { enableGrading: boolean; instructions: string; rubric: string; maxScore: number; allowedFileTypes: string; maxFileSizeMb: number; maxAttempts: number; }
interface LessonBlock { id: string; title: string; videoUrl: string; materials: Material[]; duration: string; isPreview: boolean; orderIndex: number; quizzes: QuizBlock[]; assignment: AssignmentBlock }
interface ModuleBlock { id: string; title: string; orderIndex: number; lessons: LessonBlock[] }
interface CourseFormData {
  title: string; description: string; imageUrl: string; duration: string; level: string;
  instructor: string; priceEgp: number; priceUsd: number; courseLink: string;
  category: string; courseType: string; syllabus: string; scheduleDetails: string;
}

let uidCounter = 0;
const uid = () => `_${++uidCounter}`;

const makeQuiz = (): QuizBlock => ({
  id: uid(), question: "",
  options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
  correctIndex: 0, orderIndex: 0
});
const makeAssignment = (): AssignmentBlock => ({ enableGrading: false, instructions: '', rubric: '', maxScore: 100, allowedFileTypes: '.txt,.py,.ipynb,.csv,.pdf', maxFileSizeMb: 5, maxAttempts: 3 });
const makeLesson = (): LessonBlock => ({
  id: uid(), title: "", videoUrl: "", materials: [], duration: "", isPreview: false, orderIndex: 0, quizzes: [], assignment: makeAssignment()
});
const makeModule = (): ModuleBlock => ({
  id: uid(), title: "", orderIndex: 0, lessons: [makeLesson()]
});

const toLessonBlock = (lesson: any): LessonBlock => {
  const defaultAssignment = makeAssignment();
  const assignment = lesson.assignment;
  const isGradingEnabled = Boolean(assignment?.isActive ?? assignment?.enableGrading);

  return {
    id: lesson.id ? String(lesson.id) : uid(),
    title: lesson.title || "",
    videoUrl: lesson.videoUrl || "",
    materials: Array.isArray(lesson.materials) ? lesson.materials : [],
    duration: lesson.duration || "",
    isPreview: lesson.isPreview || false,
    orderIndex: lesson.orderIndex || 0,
    assignment: isGradingEnabled ? {
      enableGrading: true,
      instructions: assignment.instructions ?? defaultAssignment.instructions,
      rubric: assignment.rubric ?? defaultAssignment.rubric,
      maxScore: assignment.maxScore ?? defaultAssignment.maxScore,
      allowedFileTypes: assignment.allowedFileTypes ?? defaultAssignment.allowedFileTypes,
      maxFileSizeMb: assignment.maxFileSizeMb ?? defaultAssignment.maxFileSizeMb,
      maxAttempts: assignment.maxAttempts ?? defaultAssignment.maxAttempts,
    } : defaultAssignment,
    quizzes: (lesson.quizzes || []).flatMap((quiz: any) =>
      Array.isArray(quiz.questions) ? quiz.questions.map((questionData: any, quizIndex: number) => {
        const options = [
          { text: questionData.optionA || "" },
          { text: questionData.optionB || "" },
          { text: questionData.optionC || "" },
          { text: questionData.optionD || "" }
        ];
        const correctIndex = ['A', 'B', 'C', 'D'].indexOf(questionData.correctAnswer);
        return {
          id: uid(),
          question: questionData.question || "",
          options,
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
          orderIndex: quizIndex,
        };
      }) : []
    ),
  };
};

const toModuleBlocks = (sourceModules: any[]): ModuleBlock[] => sourceModules.map((module: any) => ({
  id: module.id ? String(module.id) : uid(),
  title: module.title || "",
  orderIndex: module.orderIndex || 0,
  lessons: (module.lessons || []).map(toLessonBlock),
}));
const DEFAULT_INFO = (): CourseFormData => ({
  title: "", description: "", imageUrl: "", duration: "", level: "",
  instructor: "", priceEgp: 0, priceUsd: 0, courseLink: "",
  category: "", courseType: "Recorded", syllabus: "", scheduleDetails: ""
});

// ─── IMPORT MODULE MODAL ──────────────────────────────────────────────────────

function ImportModuleModal({ open, onClose, onImport, excludeCourseId, isImporting }: {
  open: boolean; onClose: () => void; onImport: (moduleIds: string[]) => Promise<void>; excludeCourseId?: string; isImporting: boolean;
}) {
  const { data: allModules = [], isLoading } = trpc.admin.getAllModulesWithCourse.useQuery(undefined, { enabled: open });
  const [search, setSearch] = useState("");
  const [selectedModuleIds, setSelectedModuleIds] = useState<Set<string>>(() => new Set());
  const importInFlightRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedModuleIds(new Set());
      importInFlightRef.current = false;
    }
  }, [open]);

  const close = () => {
    if (isImporting || importInFlightRef.current) return;
    onClose();
  };

  const toggleModule = (moduleId: string) => {
    if (isImporting) return;
    setSelectedModuleIds(previous => {
      const next = new Set(previous);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const handleAdd = async () => {
    if (isImporting || importInFlightRef.current || selectedModuleIds.size === 0) return;
    importInFlightRef.current = true;
    try {
      await onImport(Array.from(selectedModuleIds));
    } finally {
      importInFlightRef.current = false;
    }
  };
  const selectedCount = selectedModuleIds.size;
  const addLabel = selectedCount === 0 ? "Add" : `Add ${selectedCount} Module${selectedCount !== 1 ? 's' : ''}`;

  const filtered = allModules.filter((m: any) => {
    if (excludeCourseId && String(m.courseId) === String(excludeCourseId)) return false;
    const q = search.toLowerCase();
    return m.title.toLowerCase().includes(q) || m.courseTitle.toLowerCase().includes(q);
  });

  // Group by course
  const grouped: Record<string, any[]> = {};
  for (const mod of filtered) {
    const key = mod.courseTitle;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(mod);
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && close()}>
      <DialogContent className="max-w-lg max-h-[75vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-500" /> Import Module from Another Course
          </DialogTitle>
        </DialogHeader>
        <div className="px-5 pt-3 pb-2 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} disabled={isImporting} placeholder="Search modules or courses..." className="pl-9 h-9 text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
          ) : Object.keys(grouped).length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">No modules found in other courses.</p>
          ) : (
            Object.entries(grouped).map(([courseTitle, mods]) => (
              <div key={courseTitle}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">📚 {courseTitle}</p>
                <div className="space-y-1.5">
                  {mods.map((mod: any) => {
                    const moduleId = String(mod.id);
                    const selected = selectedModuleIds.has(moduleId);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        aria-pressed={selected}
                        disabled={isImporting}
                        onClick={() => toggleModule(moduleId)}
                        className={`w-full text-left flex items-center gap-3 p-3 border rounded-lg transition-all ${selected
                          ? "border-indigo-400 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white"}`}>
                          {selected && <Check className="w-3 h-3" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-slate-800 truncate">{mod.title}</p>
                          <p className="text-xs text-slate-400">{mod.lessonCount} lesson{mod.lessonCount !== 1 ? 's' : ''}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0 bg-slate-50">
          <p className="text-sm text-slate-500">
            Selected: {selectedCount} module{selectedCount !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={close} disabled={isImporting}>Cancel</Button>
            <Button type="button" onClick={handleAdd} disabled={isImporting || selectedCount === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isImporting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding {selectedCount} module{selectedCount !== 1 ? 's' : ''}…</> : addLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── IMPORT LESSON MODAL ──────────────────────────────────────────────────────

function ImportLessonModal({ open, onClose, onImport, excludeModuleId }: {
  open: boolean; onClose: () => void; onImport: (lessonId: string) => void; excludeModuleId?: string;
}) {
  const { data: allLessons = [], isLoading } = trpc.admin.getAllLessonsWithModule.useQuery(undefined, { enabled: open });
  const [search, setSearch] = useState("");

  const filtered = allLessons.filter((l: any) => {
    if (excludeModuleId && String(l.moduleId) === String(excludeModuleId)) return false;
    const q = search.toLowerCase();
    return l.title.toLowerCase().includes(q) || l.moduleTitle.toLowerCase().includes(q) || l.courseTitle.toLowerCase().includes(q);
  });

  // Group by course > module
  const grouped: Record<string, Record<string, any[]>> = {};
  for (const les of filtered) {
    const ck = les.courseTitle;
    const mk = les.moduleTitle;
    if (!grouped[ck]) grouped[ck] = {};
    if (!grouped[ck][mk]) grouped[ck][mk] = [];
    grouped[ck][mk].push(les);
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[75vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-500" /> Import Lesson from Another Module
          </DialogTitle>
        </DialogHeader>
        <div className="px-5 pt-3 pb-2 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lessons, modules, or courses..." className="pl-9 h-9 text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
          ) : Object.keys(grouped).length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">No lessons found in other modules.</p>
          ) : (
            Object.entries(grouped).map(([courseTitle, modules]) => (
              <div key={courseTitle}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">📚 {courseTitle}</p>
                {Object.entries(modules).map(([moduleTitle, lessons]) => (
                  <div key={moduleTitle} className="mb-3">
                    <p className="text-xs font-semibold text-indigo-600 mb-1.5 pl-1">📦 {moduleTitle}</p>
                    <div className="space-y-1.5 pl-3">
                      {lessons.map((les: any) => (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => onImport(String(les.id))}
                          className="w-full text-left flex items-center justify-between p-2.5 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-slate-800 truncate">{les.title}</p>
                            <p className="text-xs text-slate-400">
                              {les.quizCount > 0 && `${les.quizCount} quiz${les.quizCount !== 1 ? 'zes' : ''}`}
                              {les.quizCount > 0 && les.materialCount > 0 && ' · '}
                              {les.materialCount > 0 && `${les.materialCount} material${les.materialCount !== 1 ? 's' : ''}`}
                              {les.quizCount === 0 && les.materialCount === 0 && 'No quizzes or materials'}
                            </p>
                          </div>
                          <Download className="w-4 h-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── QUIZ BUILDER ─────────────────────────────────────────────────────────────

function QuizBuilder({ quizzes, onChange }: { quizzes: QuizBlock[]; onChange: (q: QuizBlock[]) => void }) {
  const [deleteTarget, setDeleteTarget] = useState<QuizBlock | null>(null);
  const addQuiz = () => onChange([...quizzes, { ...makeQuiz(), orderIndex: quizzes.length }]);
  const removeQuiz = (id: string) => onChange(quizzes.filter(q => q.id !== id));
  const updateQuiz = (id: string, patch: Partial<QuizBlock>) =>
    onChange(quizzes.map(q => q.id === id ? { ...q, ...patch } : q));
  const updateOption = (qId: string, oi: number, text: string) =>
    onChange(quizzes.map(q => {
      if (q.id !== qId) return q;
      const opts = [...q.options]; opts[oi] = { text };
      return { ...q, options: opts };
    }));

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-purple-500" /> Quizzes
        </p>
        <button type="button" onClick={addQuiz} className="text-purple-600 hover:bg-purple-50 rounded-md px-2 py-1 text-xs font-semibold flex items-center gap-1 transition-colors">
          <Plus className="w-3 h-3" /> Add Quiz
        </button>
      </div>
      {quizzes.length === 0 && <p className="text-xs text-slate-400 italic pl-1">No quizzes. Click "Add Quiz" to add questions.</p>}
      {quizzes.map((quiz, qi) => (
        <div key={quiz.id} className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700">Q{qi + 1}</span>
            <button type="button" onClick={() => setDeleteTarget(quiz)} className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <Label className="text-xs text-slate-600">Question</Label>
            <Input value={quiz.question} onChange={e => updateQuiz(quiz.id, { question: e.target.value })}
              placeholder="e.g. What is the output of..." className="mt-1 text-sm h-9" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quiz.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateQuiz(quiz.id, { correctIndex: oi })}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${quiz.correctIndex === oi ? 'border-green-500 bg-green-500' : 'border-slate-300 hover:border-green-400'}`}
                >
                  {quiz.correctIndex === oi && <Check className="w-3 h-3 text-white" />}
                </button>
                <Input value={opt.text} onChange={e => updateOption(quiz.id, oi, e.target.value)}
                  placeholder={`Option ${oi + 1}`}
                  className={`text-xs h-8 flex-1 ${quiz.correctIndex === oi ? 'border-green-300 bg-green-50' : ''}`} />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">Circle = correct answer</p>
        </div>
      ))}
      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => { removeQuiz(deleteTarget.id); setDeleteTarget(null); }}
          entityType="Quiz Question"
          entityTitle={deleteTarget.question || "this quiz question"}
        />
      )}
    </div>
  );
}

// ─── MATERIAL BUILDER ─────────────────────────────────────────────────────────

function MaterialBuilder({ materials, onChange }: { materials: Material[]; onChange: (m: Material[]) => void }) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const add = () => onChange([...materials, { title: "", url: "" }]);
  const remove = (i: number) => onChange(materials.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<Material>) => {
    const next = [...materials]; next[i] = { ...next[i], ...patch }; onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-slate-500 flex items-center gap-1"><FileText className="w-3 h-3" /> Materials</Label>
        <button type="button" onClick={add} className="text-blue-600 hover:bg-blue-50 rounded-md px-2 py-0.5 text-xs font-semibold flex items-center gap-1 transition-colors">
          <Plus className="w-3 h-3" /> Add Material
        </button>
      </div>
      {materials.length === 0 && <p className="text-xs text-slate-400 italic">No materials yet.</p>}
      {materials.map((mat, i) => (
        <div key={i} className="flex items-center gap-2 p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg">
          <Input value={mat.title} onChange={e => update(i, { title: e.target.value })}
            placeholder="Label (e.g. Slides)" className="flex-1 h-8 text-xs" />
          <Input value={mat.url} onChange={e => update(i, { url: e.target.value })}
            placeholder="URL" className="flex-[2] h-8 text-xs" />
          <button type="button" onClick={() => setDeleteIndex(i)} className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      {deleteIndex !== null && (
        <DeleteConfirmDialog
          open={deleteIndex !== null}
          onClose={() => setDeleteIndex(null)}
          onConfirm={() => { remove(deleteIndex); setDeleteIndex(null); }}
          entityType="Material"
          entityTitle={materials[deleteIndex]?.title || "this material"}
        />
      )}
    </div>
  );
}

// ─── LESSON BUILDER ───────────────────────────────────────────────────────────

function LessonBuilder({ lesson, index, onChange, onRemove, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast }: {
  lesson: LessonBlock; index: number; onChange: (l: LessonBlock) => void; onRemove: () => void; onDuplicate: () => void;
  onMoveUp?: () => void; onMoveDown?: () => void; isFirst?: boolean; isLast?: boolean;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const set = (patch: Partial<LessonBlock>) => onChange({ ...lesson, ...patch });

  const quizCount = lesson.quizzes.length;
  const matCount = lesson.materials.length;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm group/lesson">
      {/* Header */}
      <div
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {index + 1}
          </div>
          <span className="font-medium text-slate-800 text-sm">{lesson.title || `Lesson ${index + 1}`}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Move Up/Down controls */}
          <button type="button" onClick={e => { e.stopPropagation(); onMoveUp?.(); }} disabled={isFirst}
            className={`p-1 rounded transition-colors ${isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            aria-label="Move lesson up" title="Move up">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={e => { e.stopPropagation(); onMoveDown?.(); }} disabled={isLast}
            className={`p-1 rounded transition-colors ${isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            aria-label="Move lesson down" title="Move down">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {/* More actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                role="button"
                tabIndex={0}
                onClick={e => e.stopPropagation()}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer transition-colors"
                aria-label="Lesson actions"
              >
                <MoreVertical className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44" onClick={e => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => setExpanded(true)}>
                <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit Lesson
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onRemove} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Lesson
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Always-visible delete button */}
          <div
            role="button"
            tabIndex={0}
            onClick={e => { e.stopPropagation(); onRemove(); }}
            onKeyDown={e => e.key === 'Enter' && (e.stopPropagation(), onRemove())}
            className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer transition-colors"
            aria-label="Remove lesson"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </div>
          {expanded
            ? <ChevronLeft className="w-4 h-4 text-slate-400 rotate-90 flex-shrink-0" />
            : <ChevronRight className="w-4 h-4 text-slate-400 -rotate-90 flex-shrink-0" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-5 pt-3 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-500">Lesson Title *</Label>
              <Input value={lesson.title} onChange={e => set({ title: e.target.value })}
                placeholder="e.g. Introduction" className="mt-1 h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Duration</Label>
              <Input value={lesson.duration} onChange={e => set({ duration: e.target.value })}
                placeholder="e.g. 15:30" className="mt-1 h-9 text-sm" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-slate-500 flex items-center gap-1"><Video className="w-3 h-3" /> Video URL</Label>
            <Input value={lesson.videoUrl} onChange={e => set({ videoUrl: e.target.value })}
              placeholder="https://drive.google.com/..." className="mt-1 h-9 text-sm" />
          </div>
          <MaterialBuilder materials={lesson.materials} onChange={mats => set({ materials: mats })} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id={`free-${lesson.id}`} checked={lesson.isPreview}
              onChange={e => set({ isPreview: e.target.checked })} className="accent-green-600" />
            <label htmlFor={`free-${lesson.id}`} className="text-xs text-slate-600 font-medium cursor-pointer">
              Free preview (visible without enrollment)
            </label>
          </div>
          <QuizBuilder quizzes={lesson.quizzes} onChange={quizzes => set({ quizzes })} />

          {/* AI Grading Assignment Config */}
          <div className="border-t border-slate-100 pt-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id={`grading-${lesson.id}`} checked={lesson.assignment.enableGrading}
                onChange={e => set({ assignment: { ...lesson.assignment, enableGrading: e.target.checked } })}
                className="accent-violet-600" />
              <label htmlFor={`grading-${lesson.id}`} className="text-xs text-slate-600 font-medium cursor-pointer flex items-center gap-1.5">
                🤖 Enable AI Auto-Grading for this lesson
              </label>
            </div>
            {lesson.assignment.enableGrading && (
              <div className="space-y-3 ml-5 mt-2 bg-violet-50/50 border border-violet-100 rounded-xl p-4">
                <div>
                  <Label className="text-xs text-violet-700 font-semibold">Submission Instructions (visible to students)</Label>
                  <textarea value={lesson.assignment.instructions}
                    onChange={e => set({ assignment: { ...lesson.assignment, instructions: e.target.value } })}
                    placeholder="Describe what students should submit. e.g. 'Upload your Python notebook with the completed analysis...'"
                    className="w-full mt-1 p-2.5 text-sm border border-violet-200 rounded-lg bg-white focus:ring-2 focus:ring-violet-300 focus:border-violet-400 resize-y min-h-[60px]" />
                </div>
                <div>
                  <Label className="text-xs text-violet-700 font-semibold">AI Grading Rubric (hidden from students — used by AI evaluator)</Label>
                  <textarea value={lesson.assignment.rubric}
                    onChange={e => set({ assignment: { ...lesson.assignment, rubric: e.target.value } })}
                    placeholder="Define the grading criteria. e.g. 'Check if the student used pandas for data loading (20pts), matplotlib for visualization (30pts)...'"
                    className="w-full mt-1 p-2.5 text-sm border border-violet-200 rounded-lg bg-white focus:ring-2 focus:ring-violet-300 focus:border-violet-400 resize-y min-h-[80px]" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-violet-700 font-semibold">Max Score</Label>
                    <Input type="number" value={lesson.assignment.maxScore}
                      onChange={e => set({ assignment: { ...lesson.assignment, maxScore: Number(e.target.value) || 100 } })}
                      className="mt-1 h-8 text-sm" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-violet-700 font-semibold">Max Attempts</Label>
                    <Input type="number" value={lesson.assignment.maxAttempts}
                      onChange={e => set({ assignment: { ...lesson.assignment, maxAttempts: Number(e.target.value) || 3 } })}
                      className="mt-1 h-8 text-sm" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-violet-700 font-semibold">Allowed Types</Label>
                    <Input value={lesson.assignment.allowedFileTypes}
                      onChange={e => set({ assignment: { ...lesson.assignment, allowedFileTypes: e.target.value } })}
                      placeholder=".txt,.py,.ipynb"
                      className="mt-1 h-8 text-sm" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MODULE BUILDER ───────────────────────────────────────────────────────────

function ModuleBuilder({ module, index, onChange, onRemove, onDuplicate, onImportLesson, onMoveUp, onMoveDown, isFirst, isLast }: {
  module: ModuleBlock; index: number; onChange: (m: ModuleBlock) => void; onRemove: () => void;
  onDuplicate: () => void; onImportLesson: () => void;
  onMoveUp?: () => void; onMoveDown?: () => void; isFirst?: boolean; isLast?: boolean;
}) {
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; title: string; id: string; childSummary?: string } | null>(null);
  const set = (patch: Partial<ModuleBlock>) => onChange({ ...module, ...patch });

  const addLesson = () => set({ lessons: [...module.lessons, { ...makeLesson(), orderIndex: module.lessons.length }] });
  const updateLesson = (id: string, lesson: LessonBlock) =>
    set({ lessons: module.lessons.map(l => l.id === id ? lesson : l) });
  const removeLesson = (id: string) => set({ lessons: module.lessons.filter(l => l.id !== id) });

  const duplicateLesson = (lesson: LessonBlock) => {
    const copy: LessonBlock = {
      ...JSON.parse(JSON.stringify(lesson)),
      id: uid(),
      title: `${lesson.title} (Copy)`,
      orderIndex: module.lessons.length,
    };
    // Regenerate IDs for quizzes in the copy
    copy.quizzes = copy.quizzes.map((q: QuizBlock) => ({ ...q, id: uid() }));
    set({ lessons: [...module.lessons, copy] });
    toast.success(`Duplicated "${lesson.title}"`);
  };

  const requestDeleteLesson = (lesson: LessonBlock) => {
    const quizCount = lesson.quizzes.length;
    const matCount = lesson.materials.length;
    const parts: string[] = [];
    if (quizCount > 0) parts.push(`${quizCount} quiz${quizCount > 1 ? 'zes' : ''}`);
    if (matCount > 0) parts.push(`${matCount} material${matCount > 1 ? 's' : ''}`);
    setDeleteTarget({
      type: 'Lesson',
      title: lesson.title || `Lesson`,
      id: lesson.id,
      childSummary: parts.length > 0 ? `This will also remove ${parts.join(' and ')}.` : undefined
    });
  };

  // Count children for module-level info
  const totalLessons = module.lessons.length;
  const totalQuizzes = module.lessons.reduce((sum, l) => sum + l.quizzes.length, 0);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 rounded-2xl p-5 space-y-4 group/module">
      <div className="flex items-center gap-3">
        {/* Module Move Up/Down */}
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button type="button" onClick={onMoveUp} disabled={isFirst}
            className={`p-0.5 rounded transition-colors ${isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            aria-label="Move module up" title="Move module up">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={isLast}
            className={`p-0.5 rounded transition-colors ${isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            aria-label="Move module down" title="Move module down">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
          M{index + 1}
        </div>
        <Input value={module.title} onChange={e => set({ title: e.target.value })}
          placeholder={`Module ${index + 1} title — e.g. "Getting Started"`}
          className="flex-1 font-semibold h-10 bg-white border-slate-200" />

        {/* Module Context Menu — always visible */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0" aria-label="Module actions">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate Module
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImportLesson}>
              <Download className="w-3.5 h-3.5 mr-2" /> Import Lesson
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onRemove} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Module
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Always-visible delete button for module */}
        <button type="button" onClick={onRemove} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0" aria-label="Remove module">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 ml-11">
        {module.lessons.map((lesson, li) => (
          <LessonBuilder
            key={lesson.id}
            lesson={lesson}
            index={li}
            onChange={(l) => updateLesson(lesson.id, l)}
            onRemove={() => requestDeleteLesson(lesson)}
            onDuplicate={() => duplicateLesson(lesson)}
            onMoveUp={() => {
              if (li === 0) return;
              const arr = [...module.lessons];
              [arr[li - 1], arr[li]] = [arr[li], arr[li - 1]];
              set({ lessons: arr });
            }}
            onMoveDown={() => {
              if (li === module.lessons.length - 1) return;
              const arr = [...module.lessons];
              [arr[li], arr[li + 1]] = [arr[li + 1], arr[li]];
              set({ lessons: arr });
            }}
            isFirst={li === 0}
            isLast={li === module.lessons.length - 1}
          />
        ))}
        <div className="flex gap-2">
          <button type="button" onClick={addLesson}
            className="flex-1 h-9 text-sm border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Lesson
          </button>
          <button type="button" onClick={onImportLesson}
            className="h-9 px-3 text-sm border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Download className="w-3.5 h-3.5" /> Import
          </button>
        </div>
      </div>

      {/* Delete Confirmation for lessons within this module */}
      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => { removeLesson(deleteTarget.id); setDeleteTarget(null); toast.success(`Deleted ${deleteTarget.type}`); }}
          entityType={deleteTarget.type}
          entityTitle={deleteTarget.title}
          childSummary={deleteTarget.childSummary}
        />
      )}
    </div>
  );
}

// ─── MAIN COURSES MANAGER ─────────────────────────────────────────────────────

export default function CoursesManager() {
  const utils = trpc.useUtils();
  const { data: courses = [], isLoading } = trpc.admin.getCourses.useQuery();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [info, setInfo] = useState<CourseFormData>(DEFAULT_INFO());
  const [modules, setModules] = useState<ModuleBlock[]>([makeModule()]);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; title: string; id: string; childSummary?: string } | null>(null);
  const [courseDeleteTarget, setCourseDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Import modal state
  const [importModuleOpen, setImportModuleOpen] = useState(false);
  const [importLessonTarget, setImportLessonTarget] = useState<{ moduleId: string } | null>(null);

  const createCourse = trpc.admin.createCourse.useMutation();
  const createCourseComplete = trpc.admin.createCourseComplete.useMutation();
  const updateCourseComplete = trpc.admin.updateCourseComplete.useMutation();
  const deleteCourse = trpc.admin.deleteCourse.useMutation({
    onSuccess: () => { toast.success("Course deleted"); utils.admin.getCourses.invalidate(); }
  });
  const importModulesMutation = trpc.admin.importModules.useMutation();
  const importLessonMutation = trpc.admin.importLesson.useMutation();

  const resetForm = () => { setInfo(DEFAULT_INFO()); setModules([makeModule()]); setStep(1); setEditingId(null); };

  const handleEdit = async (course: any) => {
    try {
      const completeData = await utils.admin.getCourseComplete.fetch({ id: course.id });
      if (!completeData) return toast.error("Course not found");

      setInfo({
        title: completeData.info.title || "", description: completeData.info.description || "", imageUrl: completeData.info.imageUrl || "",
        duration: completeData.info.duration || "", level: completeData.info.level || "", instructor: completeData.info.instructor || "",
        priceEgp: Number(completeData.info.priceEgp) || 0, priceUsd: Number(completeData.info.priceUsd) || 0,
        courseLink: completeData.info.courseLink || "", category: completeData.info.category || "",
        courseType: completeData.info.courseType || "Recorded", syllabus: completeData.info.syllabus || "",
        scheduleDetails: completeData.info.scheduleDetails || ""
      });

      if (completeData.modules && completeData.modules.length > 0) {
        setModules(toModuleBlocks(completeData.modules));
      } else {
        setModules([makeModule()]);
      }

      setEditingId(course.id);
      setStep(1);
      setOpen(true);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load course contents");
    }
  };

  const buildModulesPayload = () => modules.map((m, mi) => ({
    id: m.id, // Pass ID through — backend will upsert
    title: m.title.trim() || `Module ${mi + 1}`,
    orderIndex: mi,
    lessons: m.lessons.map((l, li) => ({
      id: l.id, // Pass ID through — backend will upsert
      title: l.title.trim() || `Lesson ${li + 1}`,
      videoUrl: l.videoUrl.trim() || undefined,
      materials: l.materials.filter(mat => mat.title && mat.url),
      duration: l.duration.trim() || undefined,
      isPreview: l.isPreview,
      orderIndex: li,
      assignment: l.assignment.enableGrading ? {
        enableGrading: true,
        instructions: l.assignment.instructions,
        rubric: l.assignment.rubric,
        maxScore: l.assignment.maxScore,
        allowedFileTypes: l.assignment.allowedFileTypes,
        maxFileSizeMb: l.assignment.maxFileSizeMb,
        maxAttempts: l.assignment.maxAttempts,
      } : undefined,
      quizzes: l.quizzes.length > 0 ? [{
        title: `${l.title.trim() || 'Lesson'} Quiz`,
        questions: l.quizzes.filter(q => q.question.trim()).map(q => {
          const letters = ['A', 'B', 'C', 'D'];
          return {
            question: q.question,
            optionA: q.options[0]?.text || "",
            optionB: q.options[1]?.text || "",
            optionC: q.options[2]?.text || "",
            optionD: q.options[3]?.text || "",
            correctAnswer: letters[q.correctIndex] || 'A'
          };
        })
      }] : []
    }))
  }));

  const handleSave = async () => {
    if (!info.title.trim()) return toast.error("Course title is required");
    setIsSaving(true);
    try {
      if (editingId) {
        await updateCourseComplete.mutateAsync({
          id: editingId,
          info: info,
          modules: info.courseType === "Recorded" ? buildModulesPayload() : []
        });
        toast.success("✅ Course updated!");
      } else {
        await createCourseComplete.mutateAsync({
          info: info,
          modules: info.courseType === "Recorded" ? buildModulesPayload() : []
        });
        toast.success("✅ Course created completely!");
      }

      setOpen(false);
      resetForm();
      utils.admin.getCourses.invalidate();
    } catch (e: any) {
      console.error("Course save error:", e);
      toast.error(e.message || "Failed to save course");
    } finally {
      setIsSaving(false);
    }
  };

  const addModule = () => setModules(prev => [...prev, { ...makeModule(), orderIndex: prev.length }]);

  const requestDeleteModule = (mod: ModuleBlock) => {
    const lessonCount = mod.lessons.length;
    const quizCount = mod.lessons.reduce((sum, l) => sum + l.quizzes.length, 0);
    const parts: string[] = [];
    if (lessonCount > 0) parts.push(`${lessonCount} lesson${lessonCount > 1 ? 's' : ''}`);
    if (quizCount > 0) parts.push(`${quizCount} quiz${quizCount > 1 ? 'zes' : ''}`);
    setDeleteTarget({
      type: 'Module',
      title: mod.title || `Module`,
      id: mod.id,
      childSummary: parts.length > 0 ? `This will also remove ${parts.join(' and ')}.` : undefined
    });
  };

  const removeModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const duplicateModule = (mod: ModuleBlock) => {
    const copy: ModuleBlock = {
      ...JSON.parse(JSON.stringify(mod)),
      id: uid(),
      title: `${mod.title} (Copy)`,
      orderIndex: modules.length,
    };
    // Regenerate all IDs for lessons and quizzes in the copy
    copy.lessons = copy.lessons.map((l: LessonBlock) => ({
      ...l,
      id: uid(),
      quizzes: l.quizzes.map((q: QuizBlock) => ({ ...q, id: uid() }))
    }));
    setModules(prev => [...prev, copy]);
    toast.success(`Duplicated module "${mod.title}"`);
  };

  const updateModule = (id: string, m: ModuleBlock) =>
    setModules(prev => prev.map(mod => mod.id === id ? m : mod));

  // Import selected modules atomically, then use the persisted server graph as editor state.
  const handleImportModules = async (sourceModuleIds: string[]) => {
    if (!editingId) {
      // For new (unsaved) courses, we can't import from DB yet.
      // Close modal and show info
      toast.error("Please save the course first before importing modules.");
      setImportModuleOpen(false);
      return;
    }
    const uniqueSourceModuleIds = Array.from(new Set(sourceModuleIds.map(String)));
    if (uniqueSourceModuleIds.length === 0) {
      toast.error("Select at least one module to import.");
      return;
    }
    try {
      const result = await importModulesMutation.mutateAsync({
        sourceModuleIds: uniqueSourceModuleIds,
        targetCourseId: editingId,
      });
      setModules(toModuleBlocks(result.modules));
      utils.admin.getCourseComplete.setData({ id: editingId }, current =>
        current ? { ...current, modules: result.modules } : current
      );
      setImportModuleOpen(false);

      if (result.importedSourceModuleIds.length > 0) {
        const importedCount = result.importedSourceModuleIds.length;
        const skippedCount = result.skippedSourceModuleIds.length;
        toast.success(`${importedCount} module${importedCount !== 1 ? 's' : ''} added successfully.${skippedCount ? ` ${skippedCount} already present.` : ''}`);
      } else {
        toast.info("The selected modules are already in this course.");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Unable to add the selected modules.");
    }
  };

  // Import lesson handler
  const handleImportLesson = async (sourceLessonId: string) => {
    if (!editingId || !importLessonTarget) {
      toast.error("Please save the course first before importing lessons.");
      setImportLessonTarget(null);
      return;
    }
    const targetModuleId = importLessonTarget.moduleId;
    // Only allow import if the module has a real DB ID
    if (String(targetModuleId).startsWith('_')) {
      toast.error("Please save the course first — this module doesn't have a database ID yet.");
      setImportLessonTarget(null);
      return;
    }
    try {
      const targetModule = modules.find(m => m.id === targetModuleId);
      await importLessonMutation.mutateAsync({
        sourceLessonId,
        targetModuleId,
        orderIndex: targetModule ? targetModule.lessons.length : 0,
      });
      toast.success("Lesson imported! Reloading...");
      setImportLessonTarget(null);
      // Reload course data
      const refreshed = await utils.admin.getCourseComplete.fetch({ id: editingId });
      if (refreshed && refreshed.modules) {
        setModules(toModuleBlocks(refreshed.modules));
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to import lesson");
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Courses Manager</CardTitle>
          <CardDescription>Create and manage all courses on the platform.</CardDescription>
        </div>
        <Button onClick={() => { resetForm(); setOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Course
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
            <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-lg">No courses yet.</p>
            <Button onClick={() => { resetForm(); setOpen(true); }} className="mt-6 bg-indigo-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Create First Course
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {(courses as any[]).map((course: any) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-sm hover:border-slate-300 transition-all bg-white">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {course.imageUrl && (
                    <img src={course.imageUrl} alt={course.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-slate-200" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 truncate">{course.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${course.courseType === 'Live' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {course.courseType || "Recorded"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{course.level}{course.duration ? ` · ${course.duration}` : ''}</p>
                    <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                      🇪🇬 {Number(course.priceEgp)?.toLocaleString()} EGP · 💵 ${Number(course.priceUsd)?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setCourseDeleteTarget({ id: course.id, title: course.title })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* ─── COURSE CREATION/EDIT DIALOG ─── */}
      <Dialog open={open} onOpenChange={v => { if (!v) { setOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">
                {editingId ? "Edit Course" : step === 1 ? "New Course — Basic Info" : "Content Builder"}
              </DialogTitle>
              {info.courseType === "Recorded" && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-green-500 text-white'}`}>
                    {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                  </span>
                  <div className="w-6 h-px bg-slate-300" />
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* STEP 1 — COURSE INFO */}
            {step === 1 && (
              <>
                <div>
                  <Label className="text-slate-700 font-semibold">Course Title *</Label>
                  <Input value={info.title} onChange={e => setInfo({ ...info, title: e.target.value })}
                    placeholder="e.g. Full-Stack Web Development" className="mt-1" />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold">Description</Label>
                  <Textarea value={info.description} onChange={e => setInfo({ ...info, description: e.target.value })}
                    placeholder="What students will learn..." rows={3} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-semibold">Course Type *</Label>
                    <select value={info.courseType} onChange={e => setInfo({ ...info, courseType: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <option value="Recorded">🎬 Recorded</option>
                      <option value="Live">📡 Live Session</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-semibold">Category</Label>
                    <select value={info.category} onChange={e => setInfo({ ...info, category: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <option value="">Select Category</option>
                      <option value="Artificial Intelligence & Applications">AI & Applications</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile Development">Mobile Development</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-700 font-semibold">Duration</Label>
                    <Input value={info.duration} onChange={e => setInfo({ ...info, duration: e.target.value })}
                      placeholder="e.g. 8 weeks" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-semibold">Level</Label>
                    <Input value={info.level} onChange={e => setInfo({ ...info, level: e.target.value })}
                      placeholder="e.g. Beginner" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-semibold">Instructor</Label>
                    <Input value={info.instructor} onChange={e => setInfo({ ...info, instructor: e.target.value })}
                      placeholder="Name" className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-semibold">Price (EGP)</Label>
                    <Input type="number" min={0} value={info.priceEgp}
                      onChange={e => setInfo({ ...info, priceEgp: Number(e.target.value) })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-semibold">Price (USD)</Label>
                    <Input type="number" min={0} value={info.priceUsd}
                      onChange={e => setInfo({ ...info, priceUsd: Number(e.target.value) })} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold">Cover Image URL</Label>
                  <Input value={info.imageUrl} onChange={e => setInfo({ ...info, imageUrl: e.target.value })}
                    placeholder="https://..." className="mt-1" />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold">External Course Link (Syllabus / Know More)</Label>
                  <Input value={info.courseLink} onChange={e => setInfo({ ...info, courseLink: e.target.value })}
                    placeholder="https://shorturl.at/..." className="mt-1" />
                </div>
                {info.courseType === "Live" && (
                  <div className="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50/50 rounded-r-xl space-y-4">
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Live Session Details</p>
                    <div>
                      <Label className="text-slate-700 font-semibold">Syllabus</Label>
                      <Textarea value={info.syllabus} onChange={e => setInfo({ ...info, syllabus: e.target.value })}
                        placeholder="Week 1: Intro..." rows={3} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-slate-700 font-semibold">Schedule</Label>
                      <Input value={info.scheduleDetails} onChange={e => setInfo({ ...info, scheduleDetails: e.target.value })}
                        placeholder="Tuesdays & Thursdays, 6–8 PM GMT+2" className="mt-1" />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 2 — CONTENT BUILDER */}
            {step === 2 && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{info.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">Add modules, lessons, materials, and quizzes below.</p>
                  </div>
                  <div className="flex gap-2">
                    {editingId && (
                      <button type="button" onClick={() => setImportModuleOpen(true)}
                        className="border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5 transition-colors">
                        <Download className="w-4 h-4" /> Import Module
                      </button>
                    )}
                    <button type="button" onClick={addModule}
                      className="border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5 transition-colors">
                      <Plus className="w-4 h-4" /> Add Module
                    </button>
                  </div>
                </div>
                <div className="space-y-5">
                  {modules.map((mod, mi) => (
                    <ModuleBuilder
                      key={mod.id}
                      module={mod}
                      index={mi}
                      onChange={(m) => updateModule(mod.id, m)}
                      onRemove={() => requestDeleteModule(mod)}
                      onDuplicate={() => duplicateModule(mod)}
                      onImportLesson={() => {
                        if (!editingId || String(mod.id).startsWith('_')) {
                          toast.error("Save the course first before importing lessons into this module.");
                          return;
                        }
                        setImportLessonTarget({ moduleId: mod.id });
                      }}
                      onMoveUp={() => {
                        if (mi === 0) return;
                        setModules(prev => {
                          const arr = [...prev];
                          [arr[mi - 1], arr[mi]] = [arr[mi], arr[mi - 1]];
                          return arr;
                        });
                      }}
                      onMoveDown={() => {
                        if (mi === modules.length - 1) return;
                        setModules(prev => {
                          const arr = [...prev];
                          [arr[mi], arr[mi + 1]] = [arr[mi + 1], arr[mi]];
                          return arr;
                        });
                      }}
                      isFirst={mi === 0}
                      isLast={mi === modules.length - 1}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50">
            <Button variant="ghost" onClick={() => { setOpen(false); resetForm(); }} className="text-slate-500">Cancel</Button>
            <div className="flex gap-3">
              {step === 2 && (
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              {step === 1 && info.courseType === "Recorded" ? (
                <Button onClick={() => { if (!info.title.trim()) return toast.error("Title required"); setStep(2); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Next: Add Content <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white min-w-[130px]">
                  {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : editingId ? "Update Course" : "✅ Save Course"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {courseDeleteTarget && (
        <DeleteConfirmDialog
          open={!!courseDeleteTarget}
          onClose={() => setCourseDeleteTarget(null)}
          onConfirm={() => {
            deleteCourse.mutate({ id: courseDeleteTarget.id });
            setCourseDeleteTarget(null);
          }}
          entityType="Course"
          entityTitle={courseDeleteTarget.title}
        />
      )}

      {/* Module-level delete confirmation */}
      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => { removeModule(deleteTarget.id); setDeleteTarget(null); toast.success(`Deleted ${deleteTarget.type}`); }}
          entityType={deleteTarget.type}
          entityTitle={deleteTarget.title}
          childSummary={deleteTarget.childSummary}
        />
      )}

      {/* Import Module Modal */}
      <ImportModuleModal
        open={importModuleOpen}
        onClose={() => setImportModuleOpen(false)}
        onImport={handleImportModules}
        excludeCourseId={editingId || undefined}
        isImporting={importModulesMutation.isPending}
      />

      {/* Import Lesson Modal */}
      <ImportLessonModal
        open={!!importLessonTarget}
        onClose={() => setImportLessonTarget(null)}
        onImport={handleImportLesson}
        excludeModuleId={importLessonTarget?.moduleId}
      />
    </Card >
  );
}

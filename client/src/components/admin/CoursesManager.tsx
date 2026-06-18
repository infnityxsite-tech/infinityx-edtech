import { useState, useId } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Loader2, Plus, Edit2, Trash2, ChevronRight, ChevronLeft,
  BookOpen, Video, FileText, HelpCircle, Check, X
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Material { title: string; url: string }
interface QuizOption { text: string }
interface QuizBlock { id: string; question: string; options: QuizOption[]; correctIndex: number; orderIndex: number }
interface LessonBlock { id: string; title: string; videoUrl: string; materials: Material[]; duration: string; isPreview: boolean; orderIndex: number; quizzes: QuizBlock[] }
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
const makeLesson = (): LessonBlock => ({
  id: uid(), title: "", videoUrl: "", materials: [], duration: "", isPreview: false, orderIndex: 0, quizzes: []
});
const makeModule = (): ModuleBlock => ({
  id: uid(), title: "", orderIndex: 0, lessons: [makeLesson()]
});
const DEFAULT_INFO = (): CourseFormData => ({
  title: "", description: "", imageUrl: "", duration: "", level: "",
  instructor: "", priceEgp: 0, priceUsd: 0, courseLink: "",
  category: "", courseType: "Recorded", syllabus: "", scheduleDetails: ""
});

// ─── QUIZ BUILDER ─────────────────────────────────────────────────────────────

function QuizBuilder({ quizzes, onChange }: { quizzes: QuizBlock[]; onChange: (q: QuizBlock[]) => void }) {
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
            <button type="button" onClick={() => removeQuiz(quiz.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded">
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
    </div>
  );
}

// ─── MATERIAL BUILDER ─────────────────────────────────────────────────────────

function MaterialBuilder({ materials, onChange }: { materials: Material[]; onChange: (m: Material[]) => void }) {
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
          <button type="button" onClick={() => remove(i)} className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── LESSON BUILDER ───────────────────────────────────────────────────────────

function LessonBuilder({ lesson, index, onChange, onRemove }: {
  lesson: LessonBlock; index: number; onChange: (l: LessonBlock) => void; onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const set = (patch: Partial<LessonBlock>) => onChange({ ...lesson, ...patch });

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header — use div not button to avoid nesting */}
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
        <div className="flex items-center gap-2">
          {/* Separate remove button — stops propagation so it doesn't toggle collapse */}
          <div
            role="button"
            tabIndex={0}
            onClick={e => { e.stopPropagation(); onRemove(); }}
            onKeyDown={e => e.key === 'Enter' && (e.stopPropagation(), onRemove())}
            className="text-slate-300 hover:text-red-500 p-1 rounded cursor-pointer transition-colors"
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
        </div>
      )}
    </div>
  );
}

// ─── MODULE BUILDER ───────────────────────────────────────────────────────────

function ModuleBuilder({ module, index, onChange, onRemove }: {
  module: ModuleBlock; index: number; onChange: (m: ModuleBlock) => void; onRemove: () => void;
}) {
  const set = (patch: Partial<ModuleBlock>) => onChange({ ...module, ...patch });

  const addLesson = () => set({ lessons: [...module.lessons, { ...makeLesson(), orderIndex: module.lessons.length }] });
  const updateLesson = (id: string, lesson: LessonBlock) =>
    set({ lessons: module.lessons.map(l => l.id === id ? lesson : l) });
  const removeLesson = (id: string) => {
    
    set({ lessons: module.lessons.filter(l => l.id !== id) });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
          M{index + 1}
        </div>
        <Input value={module.title} onChange={e => set({ title: e.target.value })}
          placeholder={`Module ${index + 1} title — e.g. "Getting Started"`}
          className="flex-1 font-semibold h-10 bg-white border-slate-200" />
        <button type="button" onClick={onRemove} className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0" aria-label="Remove module">
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
            onRemove={() => removeLesson(lesson.id)}
          />
        ))}
        <button type="button" onClick={addLesson}
          className="w-full h-9 text-sm border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Lesson
        </button>
      </div>
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

  const createCourse = trpc.admin.createCourse.useMutation();
  const createCourseComplete = trpc.admin.createCourseComplete.useMutation();
  const updateCourseComplete = trpc.admin.updateCourseComplete.useMutation();
  const deleteCourse = trpc.admin.deleteCourse.useMutation({
    onSuccess: () => { toast.success("Course deleted"); utils.admin.getCourses.invalidate(); }
  });

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
        setModules(completeData.modules.map((m: any) => ({
          id: m.id || uid(),
          title: m.title || "",
          orderIndex: m.orderIndex || 0,
          lessons: (m.lessons || []).map((l: any) => ({
            id: l.id || uid(),
            title: l.title || "",
            videoUrl: l.videoUrl || "",
            materials: Array.isArray(l.materials) ? l.materials : [],
            duration: l.duration || "",
            isPreview: l.isPreview || false,
            orderIndex: l.orderIndex || 0,
            quizzes: (l.quizzes || []).flatMap((q: any) =>
              Array.isArray(q.questions) ? q.questions.map((questionData: any, qi: number) => {
                const opts = [
                  { text: questionData.optionA || "" },
                  { text: questionData.optionB || "" },
                  { text: questionData.optionC || "" },
                  { text: questionData.optionD || "" }
                ];
                const cIdx = ['A', 'B', 'C', 'D'].indexOf(questionData.correctAnswer);
                return {
                  id: uid(),
                  question: questionData.question || "",
                  options: opts,
                  correctIndex: cIdx >= 0 ? cIdx : 0,
                  orderIndex: qi
                };
              }) : []
            )
          }))
        })));
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

  const handleSave = async () => {
    if (!info.title.trim()) return toast.error("Course title is required");
    setIsSaving(true);
    try {
      if (editingId) {
        await updateCourseComplete.mutateAsync({
          id: editingId,
          info: info,
          modules: info.courseType === "Recorded" ? modules.map((m, mi) => ({
            title: m.title.trim() || `Module ${mi + 1}`,
            orderIndex: mi,
            lessons: m.lessons.map((l, li) => ({
              title: l.title.trim() || `Lesson ${li + 1}`,
              videoUrl: l.videoUrl.trim() || undefined,
              materials: l.materials.filter(mat => mat.title && mat.url),
              duration: l.duration.trim() || undefined,
              isPreview: l.isPreview,
              orderIndex: li,
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
          })) : []
        });
        toast.success("✅ Course updated!");
      } else {
        if (info.courseType === "Recorded") {
          await createCourseComplete.mutateAsync({
            info: info,
            modules: modules.map((m, mi) => ({
              title: m.title.trim() || `Module ${mi + 1}`,
              orderIndex: mi,
              lessons: m.lessons.map((l, li) => ({
                title: l.title.trim() || `Lesson ${li + 1}`,
                videoUrl: l.videoUrl.trim() || undefined,
                duration: l.duration.trim() || undefined,
                materials: l.materials.filter(mat => mat.title && mat.url),
                duration: l.duration.trim() || undefined,
                isPreview: l.isPreview,
                orderIndex: li,
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
            }))
          });
        } else {
          await createCourseComplete.mutateAsync({
            info: info,
            modules: []
          });
        }
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
  const removeModule = (id: string) => {
    
    setModules(prev => prev.filter(m => m.id !== id));
  };
  const updateModule = (id: string, m: ModuleBlock) =>
    setModules(prev => prev.map(mod => mod.id === id ? m : mod));



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
                  <Button variant="destructive" size="sm" onClick={() => {
                    if (window.confirm(`Delete "${course.title}"?`)) deleteCourse.mutate({ id: course.id });
                  }}>
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
                  <button type="button" onClick={addModule}
                    className="border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5 transition-colors">
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
                </div>
                <div className="space-y-5">
                  {modules.map((mod, mi) => (
                    <ModuleBuilder
                      key={mod.id}
                      module={mod}
                      index={mi}
                      onChange={(m) => updateModule(mod.id, m)}
                      onRemove={() => removeModule(mod.id)}
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
    </Card >
  );
}

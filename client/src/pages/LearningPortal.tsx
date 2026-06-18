import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Loader2, PlayCircle, CheckCircle2, Lock, ChevronLeft, MonitorPlay,
    LogOut, FileText, Download, BookOpen, HelpCircle, X, Check, XCircle,
    LayoutDashboard, Menu, Maximize2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ─── QUIZ VIEWER ──────────────────────────────────────────────────────────────

function QuizViewer({ lessonId, onAllDone }: { lessonId: string; onAllDone: () => void }) {
    const { data: quizzes = [], isLoading } = trpc.admin.getCourseQuizzes.useQuery({ lessonId });
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // Reset when lessonId changes
    useEffect(() => {
        setCurrent(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false);
    }, [lessonId]);

    if (isLoading) return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-indigo-400" /></div>;
    if (quizzes.length === 0) return null;

    if (finished) {
        const pct = Math.round((score / quizzes.length) * 100);
        return (
            <div className="mt-6 border-t border-slate-200 pt-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${pct >= 50 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {pct >= 50 ? <Check className="w-8 h-8" /> : <HelpCircle className="w-8 h-8" />}
                </div>
                <h4 className="font-bold text-slate-800 text-xl mb-1">Quiz Complete!</h4>
                <p className="text-slate-500">You scored <span className="font-bold text-indigo-700">{score}/{quizzes.length}</span> ({pct}%)</p>
                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onAllDone}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Lesson Complete
                </Button>
            </div>
        );
    }

    const quiz = quizzes[current] as any;

    return (
        <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-5">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-500" /> Knowledge Check
                </h4>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium">
                    {current + 1} / {quizzes.length}
                </span>
            </div>

            <p className="text-base font-semibold text-slate-800 mb-5 leading-relaxed">{quiz.question}</p>

            <div className="space-y-2.5">
                {(quiz.options || []).map((opt: string, i: number) => {
                    let cls = "w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all duration-150 ";
                    if (!submitted) {
                        cls += selected === i ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700";
                    } else {
                        if (i === quiz.correctIndex) cls += "border-green-500 bg-green-50 text-green-900";
                        else if (selected === i) cls += "border-red-400 bg-red-50 text-red-800";
                        else cls += "border-slate-200 text-slate-400";
                    }
                    return (
                        <button key={i} disabled={submitted} onClick={() => setSelected(i)} className={cls}>
                            <div className="flex items-center justify-between">
                                <span>{opt}</span>
                                {submitted && i === quiz.correctIndex && <Check className="w-4 h-4 text-green-600" />}
                                {submitted && selected === i && i !== quiz.correctIndex && <XCircle className="w-4 h-4 text-red-500" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 flex justify-end">
                {!submitted ? (
                    <Button disabled={selected === null} onClick={() => {
                        setSubmitted(true);
                        if (selected === quiz.correctIndex) setScore(s => s + 1);
                    }} className="bg-slate-900 text-white hover:bg-slate-800">
                        Check Answer
                    </Button>
                ) : (
                    <Button onClick={() => {
                        if (current < quizzes.length - 1) {
                            setCurrent(c => c + 1); setSelected(null); setSubmitted(false);
                        } else {
                            setFinished(true);
                        }
                    }} className="bg-indigo-600 text-white hover:bg-indigo-700">
                        {current < quizzes.length - 1 ? "Next Question →" : "Finish Quiz"}
                    </Button>
                )}
            </div>
        </div>
    );
}

// ─── MODULE ACCORDION ─────────────────────────────────────────────────────────

function ModuleAccordion({ module, index, isEnrolled, completedIds, activeLessonId, onSelect, defaultOpen, onToggle }: any) {
    const [open, setOpen] = useState(defaultOpen);
    const { data: lessons = [], isLoading } = trpc.admin.getCourseLessons.useQuery({ moduleId: module.id }, { enabled: open });

    return (
        <div className="border-b border-slate-100 last:border-b-0">
            <button
                onClick={() => { setOpen(!open); if (onToggle) onToggle(); }}
                className={`w-full text-left p-4 flex items-center justify-between transition-colors ${open ? 'bg-indigo-50/70' : 'hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${open ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {index + 1}
                    </div>
                    <div>
                        <p className={`font-semibold text-sm ${open ? 'text-indigo-900' : 'text-slate-800'}`}>{module.title}</p>
                        {!isLoading && <p className="text-xs text-slate-400 mt-0.5">{lessons.length} lessons</p>}
                    </div>
                </div>
            </button>

            {open && (
                <div className="bg-white">
                    {isLoading ? (
                        <div className="py-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-slate-300" /></div>
                    ) : (
                        <div className="py-1">
                            {lessons.map((lesson: any, li: number) => {
                                const locked = !isEnrolled && !lesson.isPreview;
                                const active = activeLessonId === lesson.id;
                                const done = completedIds.includes(lesson.id);
                                return (
                                    <button
                                        key={lesson.id}
                                        disabled={locked}
                                        onClick={() => !locked && onSelect(lesson)}
                                        className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors ${active ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent hover:bg-slate-50'} ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="flex-shrink-0">
                                            {done ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                : locked ? <Lock className="w-4 h-4 text-slate-300" />
                                                    : active ? <PlayCircle className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                                                        : <PlayCircle className="w-4 h-4 text-slate-300" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm truncate ${active ? 'font-semibold text-indigo-900' : 'font-medium text-slate-700'}`}>
                                                {li + 1}. {lesson.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {lesson.duration && <span className="text-xs text-slate-400">{lesson.duration}</span>}
                                                {lesson.isPreview && !isEnrolled && (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">FREE</span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── LEARNING PORTAL ──────────────────────────────────────────────────────────

export default function LearningPortal() {
    const [, navigate] = useLocation();
    const params = useParams();
    const courseId = params.courseId;

    const [studentId, setStudentId] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [activeLesson, setActiveLesson] = useState<any | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMaterial, setActiveMaterial] = useState<{ title: string; url: string } | null>(null);
    const [quizKey, setQuizKey] = useState(0); // force quiz reset

    // Helper to make Google Drive links embeddable
    const getEmbedUrl = (url: string) => {
        if (url.includes('drive.google.com/file/d/')) {
            return url.replace(/\/view.*$/, '/preview');
        }
        return url;
    };

    useEffect(() => {
        const id = localStorage.getItem("studentId");
        if (!id) { toast.error("Please sign in to access the learning portal"); navigate("/login"); return; }
        setStudentId(id);
        let did = localStorage.getItem("deviceId");
        if (!did) { did = `dev_${Math.random().toString(36).substr(2, 9)}`; localStorage.setItem("deviceId", did); }
        setDeviceId(did);
    }, []);

    // Data queries
    const { data: enrollment, isLoading: loadEnroll } = trpc.admin.getEnrollment.useQuery(
        { userId: studentId!, courseId: courseId! }, { enabled: !!studentId && !!courseId }
    );
    const { data: course, isLoading: loadCourse } = trpc.admin.getCourseById.useQuery(
        { id: courseId! }, { enabled: !!courseId }
    );
    const { data: modules = [], isLoading: loadMods } = trpc.admin.getCourseModules.useQuery(
        { courseId: courseId! }, { enabled: !!courseId }
    );
    const { data: completedLessons = [], isLoading: loadProgress } = trpc.admin.getCompletedLessons.useQuery(
        { userId: studentId!, courseId: courseId! }, { enabled: !!studentId && !!courseId }
    );

    const completedIds = (completedLessons as any[]).map((c: any) => c.lessonId);

    // Device session verification
    const verifyMutation = trpc.admin.verifyDeviceSession.useMutation({
        onError: (err) => { toast.error(err.message || "Device limit reached. Max 2 devices per account."); navigate("/dashboard"); }
    });

    useEffect(() => {
        if (studentId && deviceId && courseId) {
            verifyMutation.mutate({ userId: studentId, deviceId, deviceName: navigator.userAgent.substring(0, 60) });
        }
    }, [studentId, deviceId]);

    // Mark complete
    const progressUtils = trpc.useUtils();
    const markComplete = trpc.admin.markLessonComplete.useMutation({
        onSuccess: () => {
            progressUtils.admin.getCompletedLessons.invalidate({ userId: studentId!, courseId: courseId! });
            toast.success("Lesson marked complete! ✅");
        }
    });

    // Enroll
    const enrollMutation = trpc.admin.enrollUser.useMutation({
        onSuccess: () => { toast.success("Enrolled successfully!"); window.location.reload(); }
    });

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentId");
        localStorage.removeItem("studentName");
        navigate("/");
    };

    const isEnrolled = !!enrollment;
    const isLoading = loadEnroll || loadCourse || loadMods;
    const studentName = localStorage.getItem("studentName") || "Student";

    // Calculate progress
    const totalLessonsCount = (modules as any[]).reduce((acc, mod: any) => acc + (mod.lessonCount || 0), 0);
    const progressPct = totalLessonsCount > 0 ? Math.round((completedIds.length / totalLessonsCount) * 100) : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4 text-center">
                <BookOpen className="w-16 h-16 text-slate-300" />
                <h1 className="text-2xl font-bold text-slate-800">Course Not Found</h1>
                <Button onClick={() => navigate("/courses")}>Return to Courses</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">

            {/* TOP NAV */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/dashboard"
                        className="hidden sm:flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors text-sm"
                    >
                        <MonitorPlay className="w-5 h-5" />
                        <span className="font-bold">InfinityX</span>
                    </Link>
                    <div className="h-5 w-px bg-slate-200 hidden sm:block" />
                    <h1 className="font-semibold text-sm text-slate-800 truncate max-w-[200px] sm:max-w-sm">{(course as any).title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    {isEnrolled && (
                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1">
                            <div className="h-1.5 w-24 bg-slate-300 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-600">{progressPct}%</span>
                        </div>
                    )}
                    <span className="text-xs text-slate-500 hidden md:block">{studentName}</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs">
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">

                {/* SIDEBAR */}
                {sidebarOpen && (
                    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden flex-shrink-0">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <p className="font-bold text-slate-800 text-sm">Course Content</p>
                            <p className="text-xs text-slate-500 mt-0.5">{(modules as any[]).length} modules</p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {(modules as any[]).map((mod: any, idx: number) => (
                                <ModuleAccordion
                                    key={mod.id}
                                    module={mod}
                                    index={idx}
                                    isEnrolled={isEnrolled}
                                    completedIds={completedIds}
                                    activeLessonId={activeLesson?.id}
                                    onSelect={(lesson: any) => { setActiveLesson(lesson); setActiveModuleId(mod.id); setQuizKey(k => k + 1); }}
                                    defaultOpen={idx === 0}
                                    onToggle={() => setActiveModuleId(activeModuleId === mod.id ? null : mod.id)}
                                />
                            ))}
                        </div>
                    </aside>
                )}

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto">
                    {activeLesson ? (
                        <div>
                            {/* Video Player */}
                            <div className="bg-black relative" style={{ paddingTop: "56.25%" }}>
                                {activeLesson.videoUrl ? (
                                    <iframe
                                        src={getEmbedUrl(activeLesson.videoUrl)}
                                        className="absolute inset-0 w-full h-full border-0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3">
                                        <MonitorPlay className="w-16 h-16 opacity-20" />
                                        <p className="text-sm">No video for this lesson.</p>
                                    </div>
                                )}
                            </div>

                            {/* Lesson info */}
                            <div className="max-w-3xl mx-auto px-6 py-8">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
                                        {activeLesson.duration && (
                                            <p className="text-slate-400 text-sm mt-1">Duration: {activeLesson.duration}</p>
                                        )}
                                    </div>
                                    {isEnrolled && (
                                        <Button
                                            onClick={() => markComplete.mutate({ userId: studentId!, lessonId: activeLesson.id })}
                                            disabled={completedIds.includes(activeLesson.id) || markComplete.isPending}
                                            className={completedIds.includes(activeLesson.id)
                                                ? "bg-green-600 text-white cursor-default"
                                                : "bg-white border border-green-500 text-green-700 hover:bg-green-50"}
                                            variant="outline"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            {completedIds.includes(activeLesson.id) ? "Completed" : "Mark Complete"}
                                        </Button>
                                    )}
                                </div>

                                {/* Materials — supports multi-material JSON array or single URL */}
                                {activeLesson.materialLink && (() => {
                                    let mats: { title: string; url: string }[] = [];
                                    try {
                                        const parsed = JSON.parse(activeLesson.materialLink);
                                        if (Array.isArray(parsed)) mats = parsed;
                                        else mats = [{ title: "Download Material", url: activeLesson.materialLink }];
                                    } catch {
                                        mats = [{ title: "Download Material", url: activeLesson.materialLink }];
                                    }
                                    return mats.length > 0 ? (
                                        <div className="mb-6 space-y-2">
                                            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-500" /> Lesson Materials</p>
                                            {mats.map((mat, i) => (
                                                <button key={i} onClick={() => setActiveMaterial(mat)}
                                                    className="w-full flex items-center justify-between p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors group text-left">
                                                    <div className="flex items-center gap-2.5">
                                                        <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                                        <span className="font-medium text-indigo-800 text-sm">{mat.title || `File ${i + 1}`}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View Document</span>
                                                        <Maximize2 className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : null;
                                })()}

                                {/* Quiz section */}
                                {isEnrolled && (
                                    <QuizViewer
                                        key={quizKey}
                                        lessonId={activeLesson.id}
                                        onAllDone={() => markComplete.mutate({ userId: studentId!, lessonId: activeLesson.id })}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        // Welcome / empty state
                        <div className="flex-1 flex items-center justify-center p-8 min-h-full">
                            <div className="text-center max-w-md">
                                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MonitorPlay className="w-12 h-12 text-indigo-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-3">{(course as any).title}</h2>
                                {isEnrolled ? (
                                    <p className="text-slate-500">Select a lesson from the sidebar to start learning.</p>
                                ) : (
                                    <>
                                        <p className="text-slate-500 mb-6">Enroll to unlock all course content and start learning.</p>
                                        <Button
                                            size="lg"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8"
                                            onClick={() => enrollMutation.mutate({ userId: studentId!, courseId: courseId! })}
                                            disabled={enrollMutation.isPending}
                                        >
                                            {enrollMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enroll Now — Start Learning"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Material Viewer Dialog */}
            <Dialog open={!!activeMaterial} onOpenChange={v => { if (!v) setActiveMaterial(null); }}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                {activeMaterial?.title || "Document Viewer"}
                            </DialogTitle>
                            <a href={activeMaterial?.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full mr-6">
                                <Download className="w-3 h-3" /> Open in New Tab
                            </a>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 bg-slate-100 w-full relative">
                        {activeMaterial && (
                            <iframe 
                                src={getEmbedUrl(activeMaterial.url)} 
                                className="absolute inset-0 w-full h-full border-0"
                                title={activeMaterial.title}
                                allow="autoplay"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

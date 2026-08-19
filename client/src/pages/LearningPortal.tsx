import { useState, useEffect, useMemo } from "react";
import { useLocation, useParams, Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import LessonEmbed from "@/components/LessonEmbed";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Loader2, PlayCircle, CheckCircle2, Lock, ChevronLeft, MonitorPlay,
    LogOut, FileText, BookOpen, HelpCircle, X, Check, XCircle,
    LayoutDashboard, Menu, Maximize2, StickyNote, Save, Eye, ArrowRight,
    ShieldAlert, Mail, Phone
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AIAssistantDrawer from "@/components/AIAssistantDrawer";
import { getDeviceId, getDeviceName } from "@/lib/deviceId";
import { auth } from "@/lib/firebase";

// ─── QUIZ VIEWER ──────────────────────────────────────────────────────────────

function QuizViewer({ lessonId, onAllDone }: { lessonId: string; onAllDone: () => void }) {
    const { data: quizzes = [], isLoading } = trpc.admin.getCourseQuizzes.useQuery({ lessonId: String(lessonId) });
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const [previousScore, setPreviousScore] = useState<number | null>(() => {
        const saved = localStorage.getItem(`quiz_score_${lessonId}`);
        return saved !== null ? parseInt(saved) : null;
    });

    // Reset when lessonId changes
    useEffect(() => {
        setCurrent(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false);
        const saved = localStorage.getItem(`quiz_score_${lessonId}`);
        setPreviousScore(saved !== null ? parseInt(saved) : null);
    }, [lessonId]);

    useEffect(() => {
        if (finished) {
            localStorage.setItem(`quiz_score_${lessonId}`, score.toString());
            setPreviousScore(score);
        }
    }, [finished, score, lessonId]);

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
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onAllDone}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Lesson Complete
                    </Button>
                    <Button variant="outline" onClick={() => { setCurrent(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false); }}>
                        Try Again
                    </Button>
                </div>
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
                <div className="flex items-center gap-3">
                    {previousScore !== null && current === 0 && !submitted && (
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium">
                            Previous trial: {previousScore}/{quizzes.length}
                        </span>
                    )}
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium">
                        {current + 1} / {quizzes.length}
                    </span>
                </div>
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
    const searchString = useSearch();
    const searchParams = useMemo(() => new URLSearchParams(searchString), [searchString]);
    const previewLessonId = searchParams.get("preview");

    const [studentId, setStudentId] = useState<string | null>(null);
    const [activeLesson, setActiveLesson] = useState<any | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // default closed on mobile
    const [activeMaterial, setActiveMaterial] = useState<{ title: string; url: string } | null>(null);
    const [quizKey, setQuizKey] = useState(0); // force quiz reset
    const [noteContent, setNoteContent] = useState("");
    const [noteSaving, setNoteSaving] = useState(false);
    const [isGuestPreview, setIsGuestPreview] = useState(false);
    const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
    const [deviceBlocked, setDeviceBlocked] = useState(false);

    // Note: raw Google Drive URL conversion is handled inside LessonEmbed.

    // Detect screen width for responsive sidebar default
    useEffect(() => {
        const isDesktop = window.innerWidth >= 1024;
        setSidebarOpen(isDesktop);
    }, []);

    // Auth: allow guest preview mode if no studentId
    useEffect(() => {
        const id = localStorage.getItem("studentId");
        if (!id || isNaN(Number(id))) {
            // Guest mode — allowed for preview
            setIsGuestPreview(true);
            setStudentId(null);
            return;
        }
        setStudentId(id);
        setIsGuestPreview(false);
    }, [navigate]);



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

    // Device session verification (only for authenticated users)
    const verifyMutation = trpc.admin.verifyDeviceSession.useMutation({
        onError: (err: any) => {
            const isForbidden = err?.data?.code === "FORBIDDEN" || 
                               err?.message?.includes("DEVICE_LIMIT_REACHED");
            if (isForbidden) {
                setDeviceBlocked(true);
            } else {
                console.warn("Device verification error (non-blocking):", err?.message);
            }
        }
    });

    useEffect(() => {
        if (studentId && courseId && !isGuestPreview) {
            verifyMutation.mutate({ userId: studentId, deviceId: getDeviceId(), deviceName: getDeviceName() });
        }
    }, [studentId, isGuestPreview]);

    // Mark complete
    const progressUtils = trpc.useUtils();
    const markComplete = trpc.admin.markLessonComplete.useMutation({
        onSuccess: () => {
            progressUtils.admin.getCompletedLessons.invalidate({ userId: studentId!, courseId: courseId! });
            toast.success("Lesson marked complete! ✅");
        }
    });

    // Fetch materials for the active lesson from the DB
    const activeLessonId = activeLesson?.id;
    const { data: lessonMaterials = [] } = trpc.admin.getLessonMaterials.useQuery(
        { lessonId: String(activeLessonId) },
        { enabled: !!activeLessonId }
    );

    // Student Notes
    const { data: existingNote, refetch: refetchNote } = trpc.admin.getStudentNote.useQuery(
        { userId: studentId!, lessonId: String(activeLessonId) },
        { enabled: !!studentId && !!activeLessonId }
    );

    // When the lesson or loaded note changes, update the textarea
    useEffect(() => {
        setNoteContent(existingNote?.content || "");
    }, [existingNote, activeLessonId]);

    const saveNoteMutation = trpc.admin.saveStudentNote.useMutation({
        onSuccess: () => {
            toast.success("Note saved! 📝");
            setNoteSaving(false);
            refetchNote();
        },
        onError: () => {
            toast.error("Failed to save note.");
            setNoteSaving(false);
        }
    });

    const handleSaveNote = () => {
        if (!studentId || !activeLessonId) return;
        setNoteSaving(true);
        saveNoteMutation.mutate({ userId: studentId, lessonId: String(activeLessonId), content: noteContent });
    };

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
    const isLoading = loadCourse || loadMods || (studentId ? loadEnroll : false);
    const studentName = localStorage.getItem("studentName") || (isGuestPreview ? "Guest" : "Student");

    // Auto-select preview lesson from ?preview= query param
    const { data: courseCompleteData } = trpc.admin.getCourseComplete.useQuery(
        { id: courseId! },
        { enabled: !!previewLessonId && !!courseId }
    );

    useEffect(() => {
        if (!previewLessonId || !courseCompleteData?.modules || activeLesson) return;
        for (const mod of courseCompleteData.modules) {
            const found = mod.lessons?.find((l: any) =>
                String(l.id) === String(previewLessonId) && l.isPreview
            );
            if (found) {
                setActiveLesson(found);
                setActiveModuleId(mod.id);
                break;
            }
        }
    }, [previewLessonId, courseCompleteData, activeLesson]);

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

    if (deviceBlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-10 h-10 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Device Limit Reached</h2>
                        <h3 className="text-lg font-semibold text-white/60 mb-4" dir="rtl">تم الوصول إلى الحد الأقصى للأجهزة</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            This account is already registered on the maximum number of authorized devices (2).
                            To access your account from this device, please contact support.
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed mt-2" dir="rtl">
                            هذا الحساب مسجل بالفعل على الحد الأقصى من الأجهزة المصرح بها (2).
                            للوصول من هذا الجهاز، يرجى التواصل مع الدعم.
                        </p>
                    </div>
                    <div className="space-y-3 pt-2">
                        <a href="mailto:support@infx.space"
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors font-medium text-sm">
                            <Mail className="w-4 h-4" /> support@infx.space
                        </a>
                        <a href="https://wa.me/201100135225" target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors font-medium text-sm">
                            <Phone className="w-4 h-4" /> WhatsApp Support
                        </a>
                        <button onClick={() => { auth.signOut(); localStorage.removeItem('studentId'); localStorage.removeItem('studentToken'); navigate('/login'); }}
                            className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors font-medium text-sm">
                            Sign Out
                        </button>
                    </div>
                </div>
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
            <header className="h-14 md:h-16 bg-white border-b border-slate-200 px-3 md:px-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 flex-shrink-0"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href={isGuestPreview ? `/courses/recorded/${courseId}/preview` : "/dashboard"}
                        className="hidden sm:flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors text-sm flex-shrink-0"
                    >
                        <MonitorPlay className="w-5 h-5" />
                        <span className="font-bold">InfinityX</span>
                    </Link>
                    <div className="h-5 w-px bg-slate-200 hidden sm:block flex-shrink-0" />
                    <h1 className="font-semibold text-sm text-slate-800 truncate max-w-[140px] sm:max-w-sm">{(course as any).title}</h1>
                </div>

                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    {isGuestPreview && (
                        <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                            <Eye className="w-3.5 h-3.5" /> Preview Mode
                        </span>
                    )}
                    {isEnrolled && (
                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1">
                            <div className="h-1.5 w-24 bg-slate-300 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-600">{progressPct}%</span>
                        </div>
                    )}
                    {!isGuestPreview && (
                        <>
                            <span className="text-xs text-slate-500 hidden md:block">{studentName}</span>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    {isGuestPreview && (
                        <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-full px-3 md:px-4"
                            onClick={() => navigate(`/login?redirect=/learn/${courseId}`)}
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">

                {/* SIDEBAR BACKDROP (mobile only) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* SIDEBAR — mobile drawer + desktop static */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-[280px] sm:w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden flex-shrink-0
                    transform transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0 lg:z-auto
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${!sidebarOpen ? 'lg:-translate-x-full lg:hidden' : ''}
                `}>
                    {/* Close button (mobile) */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Course Content</p>
                            <p className="text-xs text-slate-500 mt-0.5">{(modules as any[]).length} modules</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 rounded-lg hover:bg-slate-200 text-slate-400"
                        >
                            <X className="w-5 h-5" />
                        </button>
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
                                onSelect={(lesson: any) => {
                                    setActiveLesson(lesson);
                                    setActiveModuleId(mod.id);
                                    setQuizKey(k => k + 1);
                                    // Auto-close sidebar on mobile
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                defaultOpen={idx === 0}
                                onToggle={() => setActiveModuleId(activeModuleId === mod.id ? null : mod.id)}
                            />
                        ))}
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    {activeLesson ? (
                        <div>
                            {/* Video Player — mobile-optimized */}
                            <div className="bg-black w-full overflow-hidden">
                                {activeLesson.videoUrl ? (
                                    <LessonEmbed
                                        url={activeLesson.videoUrl}
                                        title={activeLesson.title}
                                        className="w-full aspect-video"
                                    />
                                ) : (
                                    <div className="w-full aspect-video flex flex-col items-center justify-center text-slate-500 gap-3">
                                        <MonitorPlay className="w-16 h-16 opacity-20" />
                                        <p className="text-sm">No video for this lesson.</p>
                                    </div>
                                )}
                            </div>

                            {/* Lesson info */}
                            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                                {/* Guest Preview CTA banner */}
                                {isGuestPreview && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Eye className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm">You're in Preview Mode</p>
                                                <p className="text-xs text-slate-500">Sign in and enroll to access all lessons, quizzes, and materials.</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-full px-4 flex-shrink-0"
                                            onClick={() => navigate(`/apply?courseId=${courseId}`)}
                                        >
                                            Enroll Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                        </Button>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
                                        {activeLesson.duration && (
                                            <p className="text-slate-400 text-sm mt-1">Duration: {activeLesson.duration}</p>
                                        )}
                                    </div>
                                    {isEnrolled && !isGuestPreview && (
                                        <Button
                                            onClick={() => markComplete.mutate({ userId: studentId!, lessonId: String(activeLesson.id) })}
                                            disabled={completedIds.includes(activeLesson.id) || completedIds.includes(String(activeLesson.id)) || markComplete.isPending}
                                            className={(completedIds.includes(activeLesson.id) || completedIds.includes(String(activeLesson.id)))
                                                ? "bg-green-600 text-white cursor-default"
                                                : "bg-white border border-green-500 text-green-700 hover:bg-green-50"}
                                            variant="outline"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            {(completedIds.includes(activeLesson.id) || completedIds.includes(String(activeLesson.id))) ? "Completed" : "Mark Complete"}
                                        </Button>
                                    )}
                                </div>

                                {/* Materials — fetched from database */}
                                {lessonMaterials.length > 0 && (
                                    <div className="mb-6 space-y-2">
                                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-500" /> Lesson Materials</p>
                                        {(lessonMaterials as any[]).map((mat: any, i: number) => (
                                            <button key={mat.id || i} onClick={() => setActiveMaterial({ title: mat.title, url: mat.url })}
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
                                )}

                                {/* Quiz section — enrolled only */}
                                {isEnrolled && !isGuestPreview && (
                                    <QuizViewer
                                        key={quizKey}
                                        lessonId={activeLesson.id}
                                        onAllDone={() => markComplete.mutate({ userId: studentId!, lessonId: String(activeLesson.id) })}
                                    />
                                )}

                                {/* My Notes Section — enrolled only */}
                                {isEnrolled && !isGuestPreview && (
                                    <div className="mt-8 border-t border-slate-100 pt-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                <StickyNote className="w-5 h-5 text-amber-500" /> My Notes
                                            </h4>
                                            <Button
                                                size="sm"
                                                onClick={handleSaveNote}
                                                disabled={noteSaving || saveNoteMutation.isPending}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-full px-4"
                                            >
                                                {noteSaving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                                                Save Note
                                            </Button>
                                        </div>
                                        <textarea
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                            placeholder="Type your notes for this lesson here... These are private and only visible to you."
                                            className="w-full min-h-[150px] p-4 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-y bg-amber-50/30"
                                        />
                                        {existingNote?.updatedAt && (
                                            <p className="text-xs text-slate-400 mt-1.5">Last saved: {new Date(existingNote.updatedAt).toLocaleString()}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Welcome / empty state
                        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 min-h-full">
                            <div className="text-center max-w-md">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MonitorPlay className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">{(course as any).title}</h2>
                                {isGuestPreview ? (
                                    <>
                                        <p className="text-slate-500 mb-6">You're previewing this course. Select a free lesson from the sidebar, or enroll to access all content.</p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <Button
                                                size="lg"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8"
                                                onClick={() => navigate(`/apply?courseId=${courseId}`)}
                                            >
                                                Enroll Now
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="rounded-full px-8"
                                                onClick={() => navigate(`/login?redirect=/learn/${courseId}`)}
                                            >
                                                Sign In
                                            </Button>
                                        </div>
                                    </>
                                ) : isEnrolled ? (
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
                        </div>
                    </DialogHeader>
                    <div className="flex-1 bg-slate-100 w-full relative">
                        {activeMaterial && (
                            <LessonEmbed
                                url={activeMaterial.url}
                                title={activeMaterial.title}
                                className="absolute inset-0 w-full h-full"
                                isMaterial={true}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* AI Assignment Assistant */}
            {activeLesson && studentId && enrollment && (
              <>
                <button
                  onClick={() => setAiDrawerOpen(true)}
                  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110 transition-all flex items-center justify-center group"
                  title="AI Assignment Assistant"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2 group-hover:rotate-12 transition-transform">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                </button>
                <AIAssistantDrawer
                  open={aiDrawerOpen}
                  onClose={() => setAiDrawerOpen(false)}
                  lessonId={activeLesson.id}
                  lessonTitle={activeLesson.title || "Lesson"}
                  studentId={studentId}
                  isEnrolled={!!enrollment}
                />
              </>
            )}
        </div>
    );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
    Loader2, PlayCircle, Lock, MonitorPlay,
    BookOpen, Layers, Clock, Settings, AlertCircle, ChevronRight, BarChart
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";

interface PreviewRouteProps {
    params: {
        id: string;
    };
}

export default function CoursePreview({ params }: PreviewRouteProps) {
    const [, navigate] = useLocation();
    const { isLoggedIn, studentId } = useStudentAuth();

    // Fetch complete course breakdown
    const { data: courseData, isLoading } = trpc.admin.getCourseComplete.useQuery(
        { id: params.id },
        { enabled: !!params.id }
    );

    // If user is actually enrolled, redirect them to the true learning portal instead of preview
    const { data: enrollment } = trpc.admin.getEnrollment.useQuery(
        { userId: studentId || "", courseId: params.id },
        { enabled: !!studentId && !!params.id }
    );

    if (enrollment) {
        navigate(`/learn/${params.id}`);
        return null;
    }

    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-32 items-center">
                <Navigation />
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500 font-medium">Loading preview curriculum...</p>
            </div>
        );
    }

    if (!courseData || !courseData.info) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-32 items-center">
                <Navigation />
                <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Course not found</h2>
                <Button onClick={() => navigate("/courses/recorded")} className="mt-6">Return to Courses</Button>
            </div>
        );
    }

    const { info, modules } = courseData;
    const isLive = info.courseType === "Live";

    // If it's a live course, previews shouldn't be accessible per requirements.
    if (isLive) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-32 items-center text-center px-6">
                <Navigation />
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Live Session Registration</h2>
                <p className="text-slate-500 max-w-xl mx-auto mb-8">
                    This is an instructor-led live session. Previews are only available for recorded courses. To view the syllabus and register, please return to the live courses portal.
                </p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate("/courses/live")}>Return to Live Courses</Button>
                    <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => navigate(`/apply?courseId=${info.id}`)}>Apply Now</Button>
                </div>
            </div>
        );
    }

    const priceLabel = Number(info.priceEgp) > 0 ? `${Number(info.priceEgp).toLocaleString()} EGP` : "Free Enrollment";

    const handleUnlockClick = () => {
        if (Number(info.priceEgp) > 0) {
            navigate(`/apply?courseId=${info.id}&courseName=${encodeURIComponent(info.title)}`);
        } else {
            navigate(isLoggedIn ? `/learn/${info.id}` : `/login?redirect=/learn/${info.id}`);
        }
    };

    let totalLessons = 0;
    let totalMaterials = 0;
    modules.forEach((mod: any) => {
        if (mod.lessons) {
            totalLessons += mod.lessons.length;
            mod.lessons.forEach((l: any) => {
                if (l.materials) totalMaterials += l.materials.length;
            });
        }
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navigation />

            {/* PREVIEW HERO */}
            <div className="bg-[#0b1120] text-white pt-28 pb-12 overflow-hidden border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 items-center">
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded border border-indigo-500/30 uppercase tracking-widest">
                                Preview Mode
                            </span>
                            {info.category && (
                                <span className="px-3 py-1 bg-white/10 text-slate-300 text-xs font-bold rounded border border-white/10">
                                    {info.category}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            {info.title}
                        </h1>
                        <p className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl">
                            {info.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            {info.instructor && (
                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                        {info.instructor.charAt(0)}
                                    </div>
                                    <span>Instructor: <strong className="text-white">{info.instructor}</strong></span>
                                </div>
                            )}
                            <div className="flex flex-col gap-0.5 text-sm">
                                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Tuition</span>
                                <span className="text-indigo-400 font-bold text-lg">{priceLabel}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <BarChart className="w-5 h-5 text-indigo-400" /> Course Overview
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400 flex items-center gap-2"><Settings className="w-4 h-4" /> Level</span>
                                <span className="font-semibold text-white">{info.level || "Beginner - Advanced"}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</span>
                                <span className="font-semibold text-white">{info.duration || "Self-Paced"}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400 flex items-center gap-2"><MonitorPlay className="w-4 h-4" /> Lessons</span>
                                <span className="font-semibold text-white">{totalLessons}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Materials</span>
                                <span className="font-semibold text-white">{totalMaterials}</span>
                            </div>
                        </div>
                        <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-900/50"
                            onClick={handleUnlockClick}>
                            Unlock Full Course
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
                {/* Curriculum Viewer */}
                <div className="md:col-span-2 space-y-8">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-indigo-600" /> Curriculum Setup
                    </h2>

                    {/* Active Video Player (if a free video was clicked) */}
                    {activeVideo && (
                        <div className="mb-8 rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-200 aspect-video relative">
                            <iframe src={activeVideo} className="w-full h-full absolute inset-0" allowFullScreen allow="autoplay; encrypted-media"></iframe>
                        </div>
                    )}

                    <div className="space-y-4">
                        {modules.map((mod: any, mIdx: number) => (
                            <div key={mod.id} className="bg-white border text-slate-300 border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 text-lg">Module {mIdx + 1}: {mod.title}</h3>
                                    <span className="text-sm font-medium text-slate-500">{mod.lessons?.length || 0} Lessons</span>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {mod.lessons?.map((lesson: any, lIdx: number) => (
                                        <div key={lesson.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                {/* Status Icon */}
                                                {lesson.isPreview ? (
                                                    <button onClick={() => setActiveVideo(lesson.videoUrl)}
                                                        className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer group-hover:scale-110">
                                                        <PlayCircle className="w-6 h-6" />
                                                    </button>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <Lock className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className={`font-semibold ${lesson.isPreview ? "text-slate-900" : "text-slate-500"}`}>
                                                        {lIdx + 1}. {lesson.title}
                                                    </p>
                                                    {lesson.materials && lesson.materials.length > 0 && (
                                                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                            <BookOpen className="w-3 h-3" /> {lesson.materials.length} resources attachments
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action / Blurr state */}
                                            {lesson.isPreview ? (
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">FREE PREVIEW</span>
                                            ) : (
                                                <Button variant="ghost" className="text-slate-400 hover:text-indigo-600 group-hover:bg-indigo-50" onClick={handleUnlockClick}>
                                                    Unlock <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {(!mod.lessons || mod.lessons.length === 0) && (
                                        <div className="p-6 text-center text-slate-400 text-sm">No lessons uploaded yet in this module.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar CTA */}
                <div className="hidden md:block">
                    <div className="sticky top-28 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Unlock Your Potential</h3>
                            <p className="text-slate-500 text-sm">
                                You are viewing a limited preview. Get lifetime access to all lessons, source code, and community support.
                            </p>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 text-lg shadow-lg shadow-indigo-200"
                            onClick={handleUnlockClick}>
                            Enroll Now
                        </Button>
                        <ul className="mt-6 space-y-3 text-sm text-slate-600">
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Full lifetime access</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Downloadable resources</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Access on mobile and TV</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Certificate of completion</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}

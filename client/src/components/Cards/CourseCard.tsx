import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BarChart, ExternalLink, ChevronDown, ChevronUp, Video, Wifi } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export const CourseCard = ({ course, currency, isEnrolled, studentId }: { course: any; currency: "EGP" | "USD", isEnrolled?: boolean, studentId: string | null }) => {
    const [expanded, setExpanded] = useState(false);
    const [, navigate] = useLocation();
    const { isLoggedIn } = useStudentAuth();
    const { t } = useLanguage();
    const isLive = course.courseType === "Live";

    const priceLabel = currency === "EGP"
        ? (Number(course.priceEgp) > 0 ? `${Number(course.priceEgp).toLocaleString()} EGP` : null)
        : (Number(course.priceUsd) > 0 ? `$${Number(course.priceUsd).toLocaleString()}` : null);

    const handleBuyOrEnroll = () => {
        if (isEnrolled) {
            navigate(`/learn/${course.id}`);
            return;
        }

        if (priceLabel) {
            navigate(`/apply?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}`);
        } else {
            navigate(isLoggedIn ? `/learn/${course.id}` : `/login?redirect=/learn/${course.id}`);
        }
    };

    return (
        <Card className={`group flex flex-col bg-[#0d1225]/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl h-fit border p-0 gap-0
      ${isLive ? "border-white/[0.06] hover:border-orange-500/30" : "border-white/[0.06] hover:border-cyan-500/30"}`}>

            {/* Image — fixed height, no cropping artifacts */}
            <div className="relative w-full h-48 overflow-hidden bg-slate-900">
                {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
                        {isLive ? <Wifi className="w-10 h-10 mb-1 opacity-30" /> : <Video className="w-10 h-10 mb-1 opacity-30" />}
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-50">{isLive ? "Live" : "Recorded"}</span>
                    </div>
                )}
                {/* Subtle gradient overlay on image bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                {/* Badges on image */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm
                        ${isLive ? "bg-orange-500/90 text-white" : "bg-indigo-600/90 text-white"}`}>
                        {isLive ? "● Live" : "▶ Recorded"}
                    </span>
                </div>
                {course.category && (
                    <div className="absolute top-2.5 right-2.5">
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-600">
                            {course.category}
                        </span>
                    </div>
                )}
            </div>

            <CardContent className="flex-1 p-3.5 md:p-5 flex flex-col gap-2 md:gap-2.5">
                {/* Meta pills */}
                <div className="flex items-center gap-2 flex-wrap">
                    {course.level && (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">
                            <BarChart className="w-3 h-3 text-indigo-400" />{course.level}
                        </div>
                    )}
                    {course.duration && (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-cyan-400" />{course.duration}
                        </div>
                    )}
                </div>

                <h3 className="text-base md:text-lg font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2 border-l-2 border-cyan-500/60 pl-3">
                    {course.title}
                </h3>

                {course.description && (
                    <div>
                        <p className={`text-slate-400 text-xs md:text-[13px] leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
                            {course.description}
                        </p>
                        {course.description.length > 100 && (
                            <button onClick={() => setExpanded(!expanded)}
                                className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold mt-1 flex items-center gap-0.5">
                                {expanded ? <><ChevronUp className="w-3 h-3" /> Less</> : <><ChevronDown className="w-3 h-3" /> More</>}
                            </button>
                        )}
                    </div>
                )}

                {isLive && course.syllabus && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 md:p-2.5 text-xs text-amber-300 leading-relaxed max-h-20 overflow-y-auto">
                        <p className="font-semibold mb-0.5 sticky top-0 bg-amber-500/5 text-[11px] uppercase tracking-wider text-amber-400">{t("Syllabus", "المحتوى الدراسي", "Syllabus")}</p>
                        <p className="whitespace-pre-wrap text-[11px] text-amber-300/80">{course.syllabus}</p>
                    </div>
                )}

                {isLive && course.scheduleDetails && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1.5 rounded-lg">
                        <Clock className="w-3 h-3 text-orange-400 flex-shrink-0" />
                        <span>{course.scheduleDetails}</span>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-2.5 border-t border-white/[0.04] space-y-2.5">
                    <div className="flex items-center justify-between">
                        <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-500">Tuition</p>
                        <div className="text-lg font-bold text-white">
                            {priceLabel ?? <span className="text-emerald-400 text-sm font-bold">Free</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {isLive ? (
                            <>
                                {course.courseLink ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline"
                                                className="w-full border-white/[0.08] text-slate-300 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 h-8 md:h-9 text-xs rounded-lg">
                                                {t("Syllabus", "المحتوى الدراسي", "Syllabus")} <ExternalLink className="w-3 h-3 ml-1" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 flex flex-col overflow-hidden bg-slate-900 border-slate-700">
                                            <div className="p-3 md:p-4 bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
                                                <DialogTitle className="text-sm md:text-base font-bold">{course.title} — Syllabus</DialogTitle>
                                                <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1">
                                                    Open Externally <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                            <div className="flex-1 overflow-hidden relative bg-slate-100">
                                                {course.courseLink.includes('drive.google.com') ? (
                                                    <iframe src={course.courseLink.replace(/\/view.*$/, '/preview')} className="w-full h-full border-0 absolute inset-0" allow="autoplay" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full flex-col text-slate-500 p-6 text-center">
                                                        <ExternalLink className="w-12 h-12 mb-4 opacity-50" />
                                                        <p>This syllabus is hosted externally.</p>
                                                        <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-colors">
                                                            View Document
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Button variant="outline" disabled className="w-full opacity-40 h-8 md:h-9 text-xs rounded-lg">
                                        {t("Syllabus", "المحتوى الدراسي", "Syllabus")}
                                    </Button>
                                )}
                                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-8 md:h-9 text-xs font-semibold shadow-sm rounded-lg">
                                    <Link href={`/apply?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}`}>
                                        {t("Apply Now", "قدم الآن", "Apply Now")}
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" asChild
                                    className="w-full border-white/[0.08] text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 h-8 md:h-9 text-xs rounded-lg">
                                    <Link href={`/courses/recorded/${course.id}/preview`}>
                                        Preview
                                    </Link>
                                </Button>
                                <Button onClick={handleBuyOrEnroll}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white transition-all h-8 md:h-9 text-xs font-semibold shadow-sm rounded-lg">
                                    {isEnrolled ? "Enrolled" : (priceLabel ? "Buy Course" : "Enroll Free")}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

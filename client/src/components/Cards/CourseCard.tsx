import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, BarChart, ExternalLink, ChevronDown, ChevronUp, Video, Wifi } from "lucide-react";
import { SyllabusModal } from "@/components/SyllabusModal";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export const CourseCard = ({ course, currency, isEnrolled, studentId }: { course: any; currency: "EGP" | "USD", isEnrolled?: boolean, studentId: string | null }) => {
    const [expanded, setExpanded] = useState(false);
    const [, navigate] = useLocation();
    const { isLoggedIn } = useStudentAuth();
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isLight = theme === "light";
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
        <Card className={`group flex flex-col transition-all duration-300 overflow-hidden rounded-md h-fit border p-0 gap-0 shadow-none
      ${isLight ? "bg-white border-slate-200 hover:border-[#165dcc]" : "bg-[#0d1225]/80 border-white/[0.06] hover:border-cyan-500/30"}`}>

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

            <CardContent className="flex-1 p-5 flex flex-col gap-3">
                {/* Meta pills */}
                <div className="flex items-center gap-2 flex-wrap">
                    {course.level && (
                        <div className={`flex items-center gap-1 text-[11px] font-medium border px-2 py-0.5 rounded-sm ${isLight ? "text-slate-600 bg-slate-50 border-slate-200" : "text-slate-400 bg-white/[0.04] border-white/[0.06]"}`}>
                            <BarChart className="w-3 h-3 text-indigo-400" />{course.level}
                        </div>
                    )}
                    {course.duration && (
                        <div className={`flex items-center gap-1 text-[11px] font-medium border px-2 py-0.5 rounded-sm ${isLight ? "text-slate-600 bg-slate-50 border-slate-200" : "text-slate-400 bg-white/[0.04] border-white/[0.06]"}`}>
                            <Clock className="w-3 h-3 text-cyan-400" />{course.duration}
                        </div>
                    )}
                </div>

                <h3 className={`text-lg font-bold leading-snug group-hover:text-[#165dcc] transition-colors line-clamp-2 border-s-2 border-[#165dcc] ps-3 ${isLight ? "text-slate-950" : "text-white"}`}>
                    {course.title}
                </h3>

                {course.description && (
                    <div>
                        <p className={`text-xs md:text-[13px] leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"} ${expanded ? "" : "line-clamp-2"}`}>
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
                <div className={`mt-auto pt-3 border-t space-y-3 ${isLight ? "border-slate-200" : "border-white/[0.08]"}`}>
                    <div className="flex items-center justify-between">
                        <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-500">Tuition</p>
                        <div className={`text-lg font-bold ${isLight ? "text-slate-950" : "text-white"}`}>
                            {priceLabel ?? <span className="text-emerald-400 text-sm font-bold">Free</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {isLive ? (
                            <>
                                {course.courseLink ? (
                                    <SyllabusModal 
                                        courseTitle={course.title}
                                        courseLink={course.courseLink}
                                        trigger={
                                            <Button variant="outline"
                                                className={`w-full h-9 text-xs rounded-md ${isLight ? "border-slate-300 text-slate-700 hover:bg-slate-50" : "border-white/[0.08] text-slate-300 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400"}`}>
                                                {t("Syllabus", "المحتوى الدراسي", "Syllabus")} <ExternalLink className="w-3 h-3 ml-1" />
                                            </Button>
                                        } 
                                    />
                                ) : (
                                    <Button variant="outline" disabled className="w-full opacity-40 h-8 md:h-9 text-xs rounded-lg">
                                        {t("Syllabus", "المحتوى الدراسي", "Syllabus")}
                                    </Button>
                                )}
                                <Button asChild className="w-full bg-[#165dcc] hover:bg-[#124ead] text-white h-9 text-xs font-semibold shadow-none rounded-md">
                                    <Link href={`/apply?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}`}>
                                        {t("Apply Now", "قدم الآن", "Apply Now")}
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" asChild
                                    className={`w-full h-9 text-xs rounded-md ${isLight ? "border-slate-300 text-slate-700 hover:bg-slate-50" : "border-white/[0.08] text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30"}`}>
                                    <Link href={`/courses/recorded/${course.id}/preview`}>
                                        Preview
                                    </Link>
                                </Button>
                                <Button onClick={handleBuyOrEnroll}
                                    className="w-full bg-[#165dcc] hover:bg-[#124ead] text-white transition-all h-9 text-xs font-semibold shadow-none rounded-md">
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

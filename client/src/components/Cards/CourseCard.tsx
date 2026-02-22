import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BarChart, ExternalLink, ChevronDown, ChevronUp, Video, Wifi } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export const CourseCard = ({ course, currency, isEnrolled, studentId }: { course: any; currency: "EGP" | "USD", isEnrolled?: boolean, studentId: string | null }) => {
    const [expanded, setExpanded] = useState(false);
    const [, navigate] = useLocation();
    const { isLoggedIn } = useStudentAuth();
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
        <Card className={`group flex flex-col border-2 bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden rounded-xl h-fit
      ${isLive ? "border-orange-100 hover:border-orange-300" : "border-slate-100 hover:border-blue-200"}`}>

            <div className={`h-1 w-full ${isLive ? "bg-gradient-to-r from-orange-400 to-red-400" : "bg-gradient-to-r from-indigo-500 to-blue-500"}`} />

            <div className="relative h-44 flex-shrink-0 overflow-hidden bg-slate-100">
                {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300">
                        {isLive ? <Wifi className="w-12 h-12 mb-1 opacity-40" /> : <Video className="w-12 h-12 mb-1 opacity-40" />}
                        <span className="text-xs font-medium">{isLive ? "Live" : "Recorded"}</span>
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm
            ${isLive ? "bg-orange-500 text-white" : "bg-indigo-600 text-white"}`}>
                        {isLive ? "📡 Live" : "🎬 Recorded"}
                    </span>
                    {course.category && (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/95 text-slate-700 shadow-sm">
                            {course.category}
                        </span>
                    )}
                </div>
            </div>

            <CardContent className="flex-1 p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    {course.level && (
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            <BarChart className="w-3 h-3 text-blue-500" />{course.level}
                        </div>
                    )}
                    {course.duration && (
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            <Clock className="w-3 h-3 text-orange-500" />{course.duration}
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {course.title}
                </h3>

                {course.description && (
                    <div>
                        <p className={`text-slate-500 text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
                            {course.description}
                        </p>
                        {course.description.length > 130 && (
                            <button onClick={() => setExpanded(!expanded)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-semibold mt-1.5 flex items-center gap-1">
                                {expanded ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Read More</>}
                            </button>
                        )}
                    </div>
                )}

                {isLive && course.syllabus && (
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800 leading-relaxed">
                        <p className="font-semibold mb-1">Syllabus Overview</p>
                        <p className="line-clamp-3">{course.syllabus}</p>
                    </div>
                )}

                {isLive && course.scheduleDetails && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-orange-50/60 px-3 py-2 rounded-lg border border-orange-100">
                        <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                        <span>{course.scheduleDetails}</span>
                    </div>
                )}

                <div className="mt-auto pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Tuition</p>
                        <div className="text-xl font-bold text-slate-900">
                            {priceLabel ?? <span className="text-emerald-600 text-base font-bold">Free</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {isLive ? (
                            <>
                                {course.courseLink ? (
                                    <Button variant="outline" asChild
                                        className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 h-10">
                                        <a href={course.courseLink} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-1">
                                            Syllabus <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled className="w-full opacity-40 h-10">
                                        Syllabus
                                    </Button>
                                )}
                                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10 font-semibold shadow-sm">
                                    <Link href={`/apply?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}`}>
                                        Apply Now
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" asChild
                                    className="w-full border-slate-200 hover:bg-slate-50 hover:text-indigo-700 h-10">
                                    <Link href={`/courses/recorded/${course.id}/preview`}>
                                        Preview
                                    </Link>
                                </Button>
                                <Button onClick={handleBuyOrEnroll}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all h-10 font-semibold shadow-sm">
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

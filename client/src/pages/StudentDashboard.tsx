import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, BookOpen, GraduationCap, Trophy, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { EnrolledCourseCard } from "@/components/Cards/EnrolledCourseCard";
import { AvailableCourseCard } from "@/components/Cards/AvailableCourseCard";

export default function StudentDashboard() {
    const [, navigate] = useLocation();
    const [studentId, setStudentId] = useState<string | null>(null);
    const [studentName, setStudentName] = useState<string>("");

    useEffect(() => {
        const id = localStorage.getItem("studentId");
        const name = localStorage.getItem("studentName") || "Student";
        if (!id) {
            toast.error("Please sign in to access your dashboard");
            navigate("/login");
            return;
        }
        setStudentId(id);
        setStudentName(name);
    }, []);

    const { data: enrolledCourses = [], isLoading: isLoadingEnrolled } = trpc.admin.getEnrolledCourses.useQuery(
        { userId: studentId! },
        { enabled: !!studentId }
    );

    useEffect(() => {
        if (!isLoadingEnrolled && studentId) {
            console.log({
                currentUserId: studentId,
                enrollmentsFound: (enrolledCourses as any[]).length,
            });
        }
    }, [studentId, isLoadingEnrolled, enrolledCourses]);

    const { data: allCourses = [], isLoading: isLoadingAll } = trpc.admin.getCourses.useQuery();

    // Available courses (not enrolled)
    const availableCourses = (allCourses as any[]).filter(
        (c: any) => !(enrolledCourses as any[]).some((e: any) => e.id === c.id)
    );

    const isLoading = isLoadingEnrolled || isLoadingAll;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
            <Navigation />

            <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">

                {/* HERO GREETING */}
                <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">{greeting}</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900">
                            Welcome back, <span className="text-indigo-600">{studentName}</span>!
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">
                            Continue your learning journey and master new skills.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl px-5 py-4 text-center min-w-[100px]">
                            <p className="text-3xl font-extrabold text-indigo-600">{(enrolledCourses as any[]).length}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Enrolled</p>
                        </div>
                        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl px-5 py-4 text-center min-w-[100px]">
                            <Trophy className="w-7 h-7 text-amber-500 mx-auto mb-1" />
                            <p className="text-xs text-slate-500 font-medium">Keep Learning!</p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <>
                        {/* ENROLLED COURSES */}
                        <section className="mb-16">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-indigo-600" />
                                    My Courses
                                </h2>
                            </div>

                            {(enrolledCourses as any[]).length === 0 ? (
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-16 text-center">
                                    <GraduationCap className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No courses yet</h3>
                                    <p className="text-slate-500 mb-6">Browse available courses and enroll to start learning.</p>
                                    <Link href="/courses">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8">
                                            Explore Courses
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(enrolledCourses as any[]).map((course: any) => (
                                        <EnrolledCourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* AVAILABLE COURSES */}
                        {availableCourses.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Explore More Courses</h2>
                                    <Link href="/courses" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1">
                                        View all <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {availableCourses.slice(0, 6).map((course: any) => (
                                        <AvailableCourseCard key={course.id} course={course} studentId={studentId!} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}



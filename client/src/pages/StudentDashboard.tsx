import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, BookOpen, GraduationCap, Trophy, ChevronRight, Sparkles, Award, Calendar, Link as LinkIcon, ShieldAlert, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { EnrolledCourseCard } from "@/components/Cards/EnrolledCourseCard";
import { AvailableCourseCard } from "@/components/Cards/AvailableCourseCard";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDeviceId, getDeviceName } from "@/lib/deviceId";

export default function StudentDashboard() {
    const [, navigate] = useLocation();
    const [studentId, setStudentId] = useState<string | null>(null);
    const [studentName, setStudentName] = useState<string>("");
    const [studentEmail, setStudentEmail] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [deviceBlocked, setDeviceBlocked] = useState(false);

    const verifyDeviceMutation = trpc.admin.verifyDeviceSession.useMutation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const id = localStorage.getItem("studentId");
                if (id && !isNaN(Number(id))) {
                    setStudentId(id);
                    setStudentName(user.displayName || user.email?.split('@')[0] || "Student");
                    setStudentEmail(user.email);
                } else {
                    // Force re-login if they have a legacy string Firebase UID instead of numeric Postgres ID
                    localStorage.removeItem("studentId");
                    localStorage.removeItem("studentToken");
                    toast.error("Invalid session. Please sign in again.");
                    navigate("/login");
                }
            } else {
                toast.error("Please sign in to access your dashboard");
                navigate("/login");
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    // Device verification — runs after studentId is resolved
    useEffect(() => {
        if (!studentId) return;
        verifyDeviceMutation.mutate(
            { userId: studentId, deviceId: getDeviceId(), deviceName: getDeviceName() },
            {
                onError: (err: any) => {
                    // Only block if server returned FORBIDDEN (actual device limit)
                    const isForbidden = err?.data?.code === "FORBIDDEN" || 
                                       err?.message?.includes("DEVICE_LIMIT_REACHED");
                    if (isForbidden) {
                        setDeviceBlocked(true);
                    } else {
                        // Generic server error — don't block, just log
                        console.warn("Device verification error (non-blocking):", err?.message);
                    }
                }
            }
        );
    }, [studentId]);

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

    const { data: myCertificates = [], isLoading: isLoadingCerts } = trpc.admin.getStudentCertificates.useQuery(
        { email: studentEmail! },
        { enabled: !!studentEmail }
    );

    // Available courses (not enrolled)
    const availableCourses = (allCourses as any[]).filter(
        (c: any) => !(enrolledCourses as any[]).some((e: any) => e.id === c.id)
    );

    const isLoading = isLoadingEnrolled || isLoadingAll || authLoading || (!!studentEmail && isLoadingCerts);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
            <Navigation />

            {/* Device Limit Blocking Screen */}
            {deviceBlocked && (
                <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-10 h-10 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Device Limit Reached</h2>
                            <h3 className="text-lg font-semibold text-white/60 mb-4" dir="rtl">تم الوصول إلى الحد الأقصى للأجهزة</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                This account is already registered on the maximum number of authorized devices (2).
                                To access your account from this device, please contact support to reset your devices.
                            </p>
                            <p className="text-sm text-slate-400 leading-relaxed mt-2" dir="rtl">
                                هذا الحساب مسجل بالفعل على الحد الأقصى من الأجهزة المصرح بها (2).
                                للوصول من هذا الجهاز، يرجى التواصل مع الدعم لإعادة تعيين أجهزتك.
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
            )}

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
                        
                        {/* MY CERTIFICATES - شهاداتي */}
                        {myCertificates && (myCertificates as any[]).length > 0 && (
                            <section className="mt-16 border-t border-slate-200 pt-16">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                        <Award className="w-6 h-6 text-indigo-600" />
                                        شهاداتي (My Certificates)
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(myCertificates as any[]).map((cert: any) => (
                                        <Card key={cert.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Award className="w-6 h-6 text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{cert.courseName}</h3>
                                                        <p className="text-sm font-medium text-slate-500 mb-3">{cert.studentName}</p>
                                                        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500 mb-4">
                                                            <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {new Date(cert.issueDate).toLocaleDateString()}
                                                            </span>
                                                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-md font-mono">
                                                                {cert.certId}
                                                            </span>
                                                        </div>
                                                        <Button asChild variant="outline" className="w-full sm:w-auto text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                                            <a href={`/certificates/${cert.certId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                                <LinkIcon className="w-4 h-4" /> View Certificate
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
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



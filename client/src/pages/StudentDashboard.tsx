import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import StudentAppShell from "@/components/StudentAppShell";
import { Loader2, GraduationCap, Award, CircleAlert, Mail, Phone, ChevronRight, ArrowUpRight, CalendarDays, ListChecks, Target } from "lucide-react";
import { toast } from "sonner";
import { EnrolledCourseCard } from "@/components/Cards/EnrolledCourseCard";
import { AvailableCourseCard } from "@/components/Cards/AvailableCourseCard";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDeviceId, getDeviceName } from "@/lib/deviceId";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

export default function StudentDashboard() {
  const [, navigate] = useLocation();
  const { t, isRTL, lang } = useLanguage();
  const copy = (en: string, ar: string) => t(en, ar, en);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [deviceBlocked, setDeviceBlocked] = useState(false);
  useSEO({ title: "Student Dashboard", description: "Private Infinity X Academy student learning dashboard.", canonical: "https://infx.space/dashboard", robots: "noindex, nofollow" });
  const verifyDevice = trpc.admin.verifyDeviceSession.useMutation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) { toast.error(copy("Please sign in to access your learning space.", "يرجى تسجيل الدخول للوصول إلى مساحة التعلم.")); navigate("/login"); setAuthLoading(false); return; }
      const id = localStorage.getItem("studentId");
      if (!id || Number.isNaN(Number(id))) { localStorage.removeItem("studentId"); localStorage.removeItem("studentToken"); toast.error(copy("Your session needs to be refreshed. Please sign in again.", "تحتاج جلستك إلى التحديث. يرجى تسجيل الدخول مرة أخرى.")); navigate("/login"); setAuthLoading(false); return; }
      setStudentId(id); setStudentName(user.displayName || user.email?.split("@")[0] || copy("Student", "طالب")); setStudentEmail(user.email); setAuthLoading(false);
    });
    return unsubscribe;
  }, [navigate]);
  useEffect(() => { if (!studentId) return; verifyDevice.mutate({ userId: studentId, deviceId: getDeviceId(), deviceName: getDeviceName() }, { onError: (error: any) => { if (error?.data?.code === "FORBIDDEN" || error?.message?.includes("DEVICE_LIMIT_REACHED")) setDeviceBlocked(true); } }); }, [studentId]);
  const { data: enrolledCourses = [], isLoading: enrolledLoading } = trpc.admin.getEnrolledCourses.useQuery({ userId: studentId! }, { enabled: Boolean(studentId) });
  const { data: allCourses = [], isLoading: coursesLoading } = trpc.admin.getCourses.useQuery();
  const { data: certificates = [], isLoading: certificatesLoading } = trpc.admin.getStudentCertificates.useQuery({ email: studentEmail! }, { enabled: Boolean(studentEmail) });
  const enrolled = enrolledCourses as any[];
  const available = (allCourses as any[]).filter((course) => !enrolled.some((item) => item.id === course.id));
  const loading = authLoading || enrolledLoading || coursesLoading || (Boolean(studentEmail) && certificatesLoading);
  const greeting = new Date().getHours() < 12 ? copy("Good morning", "صباح الخير") : new Date().getHours() < 17 ? copy("Good afternoon", "مساء الخير") : copy("Good evening", "مساء الخير");
  const current = enrolled[0] as any;
  const rawProgress = current?.progress ?? current?.progressPercent ?? current?.completionPercentage;
  const progress = rawProgress !== undefined && rawProgress !== null && rawProgress !== "" ? Number(rawProgress) : null;
  const programName = current?.programName || current?.program_title || current?.programTitle || null;
  const upcoming = current?.nextLesson || current?.next_lesson || current?.upcomingLesson || null;
  const assignment = current?.nextAssignment || current?.next_assignment || current?.assignment || null;
  const signOut = async () => { await auth.signOut(); localStorage.removeItem("studentId"); localStorage.removeItem("studentToken"); localStorage.removeItem("studentName"); navigate("/login"); };

  if (deviceBlocked) return <div className={`grid min-h-screen place-items-center px-6 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}><div className="ix-panel max-w-lg p-8 text-center"><CircleAlert className="mx-auto h-9 w-9 text-[#bd3333]" /><h1 className="ix-display mt-6 text-3xl font-bold">{copy("Device limit reached", "تم الوصول إلى حد الأجهزة")}</h1><p className="mt-4 text-sm leading-7" style={{ color: "var(--ix-text-secondary)" }}>{copy("This account is already registered on the maximum number of authorized devices. Contact support to reset your registered devices.", "هذا الحساب مسجل بالفعل على الحد الأقصى من الأجهزة المصرح بها. تواصل مع الدعم لإعادة تعيين الأجهزة المسجلة.")}</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><a className="ix-button ix-button-secondary" href="mailto:support@infx.space"><Mail className="h-4 w-4" />support@infx.space</a><a className="ix-button ix-button-secondary" href="https://wa.me/201100135225"><Phone className="h-4 w-4" />WhatsApp</a></div><button className="ix-button mt-4 w-full" onClick={signOut}>{copy("Sign out", "تسجيل الخروج")}</button></div></div>;

  return <StudentAppShell studentName={studentName} onSignOut={signOut}><div className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12"><section className="grid gap-8 border-b pb-10 lg:grid-cols-[1fr_auto] lg:items-end" style={{ borderColor: "var(--ix-border)" }}><div><p className="ix-kicker">{greeting}</p><h1 className="ix-display mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">{copy("What should you do next,", "ما الخطوة التالية،")} <span className="text-[#1268e5]">{studentName}</span>?</h1><p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "var(--ix-text-secondary)" }}>{enrolled.length ? copy("Continue your current learning and keep your active work moving.", "تابع تعلمك الحالي وحافظ على تقدم عملك النشط.") : copy("Choose an Academy offering to begin your learning space.", "اختر عرضاً من الأكاديمية لبدء مساحة التعلم الخاصة بك.")}</p></div><div className="grid grid-cols-2 border" style={{ borderColor: "var(--ix-border)" }}><div className="p-5 text-center"><p className="text-3xl font-bold text-[#1268e5]">{enrolled.length}</p><p className="mt-2 text-xs font-bold text-[#71808b]">{copy("Active courses", "دورات نشطة")}</p></div><div className="border-s p-5 text-center" style={{ borderColor: "var(--ix-border)" }}><p className="text-3xl font-bold text-[#1268e5]">{(certificates as any[]).length}</p><p className="mt-2 text-xs font-bold text-[#71808b]">{copy("Certificates", "الشهادات")}</p></div></div></section>
    {loading ? <div className="grid min-h-[420px] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-[#1268e5]" /></div> : <div className="mt-10 grid gap-12">{enrolled.length > 0 && <section className="grid gap-px border border-[#c7d2d8] bg-[#c7d2d8] sm:grid-cols-2 lg:grid-cols-4">{[{ label: copy("Progress", "التقدم"), value: progress === null ? "—" : `${Math.max(0, Math.min(100, progress))}%`, icon: Target }, { label: copy("Upcoming", "القادم"), value: upcoming || "—", icon: CalendarDays }, { label: copy("Assignment", "المهمة"), value: assignment || "—", icon: ListChecks }, { label: copy("Program", "البرنامج"), value: programName || "—", icon: GraduationCap }].map(({ label, value, icon: Icon }) => <div key={label} className="bg-[var(--ix-surface)] p-5"><Icon className="h-4 w-4 text-[#1268e5]" /><p className="mt-6 text-[10px] font-bold uppercase tracking-[.14em] text-[#71808b]">{label}</p><p className="mt-2 truncate text-sm font-bold" title={String(value)}>{value}</p></div>)}</section>}<section><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="ix-kicker">{copy("Your next action", "خطوتك التالية")}</p><h2 className="mt-3 text-2xl font-bold">{copy("Continue learning", "تابع التعلم")}</h2></div>{enrolled.length > 0 && <Link href={`/learn/${enrolled[0].id}`} className="ix-link inline-flex items-center gap-2">{copy("Open current course", "افتح الدورة الحالية")}<ChevronRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} /></Link>}</div>{enrolled.length === 0 ? <div className="mt-6 border border-dashed p-8 sm:p-10" style={{ borderColor: "var(--ix-border)" }}><GraduationCap className="h-8 w-8 text-[#1268e5]" /><h3 className="mt-6 text-xl font-bold">{copy("Your learning space is ready for its first course.", "مساحة التعلم الخاصة بك جاهزة لأول دورة.")}</h3><p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "var(--ix-text-secondary)" }}>{copy("Explore the Academy offering, compare the learning format, and choose the next practical skill to build.", "استكشف عروض الأكاديمية، وقارن أنماط التعلم، واختر المهارة العملية التالية لتطويرها.")}</p><Link href="/programs" className="ix-button ix-button-primary mt-7">{copy("Explore programs", "استكشف البرامج")}<ArrowUpRight className="h-4 w-4" /></Link></div> : <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{enrolled.map((course) => <EnrolledCourseCard key={course.id} course={course} />)}</div>}</section>
      {available.length > 0 && <section className="border-t pt-10" style={{ borderColor: "var(--ix-border)" }}><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="ix-kicker">{copy("Discover", "اكتشف")}</p><h2 className="mt-3 text-2xl font-bold">{copy("Keep building", "واصل البناء")}</h2></div><Link href="/courses" className="ix-link inline-flex items-center gap-2">{copy("See all short courses", "عرض كل الدورات القصيرة")}<ChevronRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} /></Link></div><div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{available.slice(0, 6).map((course) => <AvailableCourseCard key={course.id} course={course} studentId={studentId!} />)}</div></section>}
      {(certificates as any[]).length > 0 && <section className="border-t pt-10" style={{ borderColor: "var(--ix-border)" }}><div><p className="ix-kicker">{copy("Your records", "سجلاتك")}</p><h2 className="mt-3 text-2xl font-bold">{copy("Certificates", "الشهادات")}</h2></div><div className="mt-6 grid border-t md:grid-cols-2" style={{ borderColor: "var(--ix-border)" }}>{(certificates as any[]).map((certificate) => <Link key={certificate.id} href={`/certificates/${certificate.certId}`} className="ix-interactive grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b p-5" style={{ borderColor: "var(--ix-border)" }}><Award className="h-5 w-5 text-[#1268e5]" /><div><p className="font-bold">{certificate.courseName}</p><p className="mt-1 text-xs" style={{ color: "var(--ix-text-muted)" }}>{new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(certificate.issueDate))}</p></div><ChevronRight className={`h-4 w-4 text-[#1268e5] ${isRTL ? "rotate-180" : ""}`} /></Link>)}</div></section>}</div>}
  </div></StudentAppShell>;
}

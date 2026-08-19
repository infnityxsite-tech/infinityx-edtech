import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export function AvailableCourseCard({ course, studentId }: { course: any; studentId: string }) {
  const utils = trpc.useUtils();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const copy = (en: string, ar: string) => t(en, ar, en);
  const enroll = trpc.admin.enrollUser.useMutation({ onSuccess: () => { toast.success(copy("You are enrolled.", "تم تسجيلك.")); utils.admin.getEnrolledCourses.invalidate({ userId: studentId }); }, onError: (error) => toast.error(error.message) });
  const isFree = Number(course.priceEgp) === 0 && Number(course.priceUsd) === 0;
  return <article className={`ix-interactive flex min-h-[184px] flex-col border p-5 ${isLight ? "border-slate-200 bg-white" : "border-white/10 bg-[#0b1829]"}`}><div className="flex items-start justify-between gap-4"><BookOpen className="h-5 w-5 shrink-0 text-[#165dcc]" /><span className={`text-[11px] font-bold uppercase tracking-[.14em] ${isLight ? "text-slate-500" : "text-slate-400"}`}>{course.courseType || copy("Short course", "دورة قصيرة")}</span></div><h3 className="mt-7 text-lg font-bold tracking-[-.025em]">{course.title}</h3><p className={`mt-2 line-clamp-2 text-sm leading-6 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{course.description || copy("Explore the course details and learning format.", "استكشف تفاصيل الدورة ونمط التعلم.")}</p><div className="mt-auto pt-5">{isFree ? <button type="button" onClick={() => enroll.mutate({ userId: studentId, courseId: course.id })} disabled={enroll.isPending} className="inline-flex items-center gap-2 text-sm font-bold text-[#165dcc] disabled:opacity-60">{enroll.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{copy("Enroll now", "سجل الآن")}<ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} /></button> : <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-[#165dcc]">{copy("View course", "عرض الدورة")}<ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} /></Link>}</div></article>;
}

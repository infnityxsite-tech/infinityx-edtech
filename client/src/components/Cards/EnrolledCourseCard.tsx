import { Link } from "wouter";
import { ArrowUpRight, BookOpen, PlayCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export function EnrolledCourseCard({ course }: { course: any }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const copy = (en: string, ar: string) => t(en, ar, en);
  return <Link href={`/learn/${course.id}`} className={`ix-interactive group grid min-h-[240px] overflow-hidden border ${isLight ? "border-slate-200 bg-white" : "border-white/10 bg-[#0b1829]"}`}><div className="relative min-h-[130px] overflow-hidden bg-[#0b1829]">{course.imageUrl ? <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" /> : <div className="grid h-full place-items-center"><BookOpen className="h-8 w-8 text-white/35" /></div>}<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071321]/90 to-transparent p-4"><span className="text-[11px] font-bold uppercase tracking-[.14em] text-cyan-200">{course.courseType || copy("Current course", "المقرر الحالي")}</span></div></div><div className="flex flex-1 flex-col justify-between p-5"><div><h3 className="text-lg font-bold tracking-[-.025em]">{course.title}</h3>{course.instructor && <p className={`mt-2 text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>{course.instructor}</p>}</div><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#165dcc]"><PlayCircle className="h-4 w-4" />{copy("Continue learning", "تابع التعلم")}<ArrowUpRight className="h-4 w-4" /></span></div></Link>;
}

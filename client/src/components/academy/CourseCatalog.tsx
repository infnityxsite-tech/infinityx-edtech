import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { CourseCard } from "@/components/Cards/CourseCard";
import { Loader2, Search, SlidersHorizontal, Video, Wifi } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type CourseCatalogProps = { mode: "live" | "recorded" };

export default function CourseCatalog({ mode }: CourseCatalogProps) {
  const { data: allCourses = [], isLoading } = trpc.admin.getCourses.useQuery();
  const { studentId } = useStudentAuth();
  const { data: enrolledCourses = [] } = trpc.admin.getEnrolledCourses.useQuery(studentId ? { userId: studentId } : (undefined as any), { enabled: Boolean(studentId) });
  const { t, isRTL } = useLanguage();
  const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const copy = (en: string, ar: string) => t(en, ar, en);
  const isLive = mode === "live";
  const courses = (allCourses as any[]).filter((course) => isLive ? course.courseType === "Live" : course.courseType !== "Live");
  const categories = useMemo(() => Array.from(new Set(courses.map((course) => String(course.category || "").trim()).filter(Boolean))).sort(), [courses]);
  const filtered = courses.filter((course) => (category === "All" || course.category === category) && `${course.title || ""} ${course.description || ""}`.toLowerCase().includes(query.toLowerCase()));
  const enrolledIds = new Set((enrolledCourses as any[]).map((course) => course.id));
  const reset = () => { setQuery(""); setCategory("All"); };
  const Icon = isLive ? Wifi : Video;

  return <main>
    <section className="ix-dark-surface bg-[#091522] pt-28 text-white sm:pt-32"><div className="ix-shell grid gap-10 pb-16 lg:grid-cols-[1fr_1fr] lg:items-end lg:pb-20"><div><p className="ix-eyebrow text-[#b9efd5]">{copy("Infinity X Academy", "أكاديمية إنفينيتي إكس")}</p><h1 className="ix-display mt-6 max-w-2xl text-5xl font-bold sm:text-6xl">{isLive ? copy("Learn live, alongside a cohort.", "تعلم مباشرةً ضمن دفعة.") : copy("Learn on your own schedule.", "تعلم وفق جدولك الخاص.")}</h1></div><div className="border-s ps-0 lg:ps-12" style={{ borderColor: "rgba(255,255,255,.18)" }}><Icon className="h-7 w-7 text-[#7db2ff]" /><p className="mt-6 max-w-xl text-lg leading-8 text-[#b9c8d1]">{isLive ? copy("Instructor-led short courses with scheduled sessions, direct feedback, and a shared pace.", "دورات قصيرة يقودها مدربون بجلسات مجدولة وتغذية راجعة مباشرة وإيقاع مشترك.") : copy("Focused recorded courses for practical learning that fits around your working schedule.", "دورات مسجلة مركزة للتعلم العملي الذي يناسب جدول عملك.")}</p></div></div></section>
    <section className="sticky top-[76px] z-30 border-y py-4 backdrop-blur-xl" style={{ borderColor: "var(--ix-border)", background: "color-mix(in srgb, var(--ix-page) 94%, transparent)" }}><div className="ix-shell flex flex-col gap-4"><div className="relative max-w-xl"><Search className={`absolute top-3.5 h-4 w-4 text-[#71808b] ${isRTL ? "right-4" : "left-4"}`} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy("Search courses", "ابحث عن الدورات")} aria-label={copy("Search courses", "ابحث عن الدورات")} className={`h-11 w-full rounded-full border bg-transparent px-10 text-sm outline-none transition-colors focus:border-[#1268e5] focus:ring-2 focus:ring-[#1268e5]/15 ${isRTL ? "pr-10" : "pl-10"}`} style={{ borderColor: "var(--ix-border)" }} /></div><div className="flex flex-wrap items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#1268e5]" />{["All", ...categories].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-3 py-2 text-sm font-bold transition-colors ${category === item ? "bg-[#1268e5] text-white" : "hover:bg-[#e7edf2] dark:hover:bg-white/10"}`}>{item === "All" ? copy("All courses", "كل الدورات") : item}</button>)}<span className="ms-2 text-xs font-bold text-[#71808b]">{copy("Tuition", "الرسوم")}</span>{(["EGP", "USD"] as const).map((item) => <button key={item} type="button" onClick={() => setCurrency(item)} className={`rounded-full px-3 py-2 text-sm font-bold transition-colors ${currency === item ? "bg-[#1268e5] text-white" : "hover:bg-[#e7edf2] dark:hover:bg-white/10"}`}>{item}</button>)}</div></div></section>
    <section className="ix-section"><div className="ix-shell">{isLoading ? <div className="grid min-h-80 place-items-center"><Loader2 className="h-8 w-8 animate-spin text-[#1268e5]" /></div> : filtered.length === 0 ? <div className="border-y py-20 text-center" style={{ borderColor: "var(--ix-border)" }}><h2 className="text-2xl font-bold">{copy("No courses match these filters.", "لا توجد دورات تطابق عوامل التصفية هذه.")}</h2><p className="mt-3" style={{ color: "var(--ix-text-secondary)" }}>{copy("Try another search term or clear the active filters.", "جرّب عبارة بحث أخرى أو امسح عوامل التصفية النشطة.")}</p><button onClick={reset} className="ix-link mt-4">{copy("Clear filters", "مسح عوامل التصفية")}</button></div> : <><div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="ix-kicker">{isLive ? copy("Live learning", "تعلم مباشر") : copy("Self-paced learning", "تعلم ذاتي")}</p><p className="mt-3 text-sm font-semibold" style={{ color: "var(--ix-text-secondary)" }}>{filtered.length} {copy("courses available", "دورات متاحة")}</p></div><p className="text-xs" style={{ color: "var(--ix-text-muted)" }}>{copy("Choose a course to view its full curriculum and enrollment path.", "اختر دورة لعرض المنهج الكامل ومسار التسجيل.")}</p></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((course) => <CourseCard key={course.id} course={course} currency={currency} isEnrolled={enrolledIds.has(course.id)} studentId={studentId} />)}</div></>}</div></section>
  </main>;
}

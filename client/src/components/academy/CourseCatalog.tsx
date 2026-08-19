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

  return (
    <main className="bg-[#F5F4EF] text-[#1F2925]">
      {/* ── Catalog Hero ──────────────────────────────────────────────────── */}
      <section className="bg-[#F5F4EF] text-[#1F2925] border-b border-[#D8DDD8]/60 py-12 sm:py-16">
        <div className="ix-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="ix-eyebrow text-[#52735F]">{copy("Infinity X Academy", "أكاديمية إنفينيتي إكس")}</p>
            <h1 className="ix-display mt-6 max-w-2xl text-5xl font-bold text-[#1F2925] sm:text-6xl">
              {isLive ? copy("Learn live, alongside a cohort.", "تعلم مباشرةً ضمن دفعة.") : copy("Learn on your own schedule.", "تعلم وفق جدولك الخاص.")}
            </h1>
          </div>
          <div className="border-s border-[#D8DDD8] ps-0 lg:ps-12">
            <Icon className="h-7 w-7 text-[#52735F]" />
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5E6862]">
              {isLive
                ? copy("Instructor-led short courses with scheduled sessions, direct feedback, and a shared pace.", "دورات قصيرة يقودها مدربون بجلسات مجدولة وتغذية راجعة مباشرة وإيقاع مشترك.")
                : copy("Focused recorded courses for practical learning that fits around your working schedule.", "دورات مسجلة مركزة للتعلم العملي الذي يناسب جدول عملك.")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Search and Filter Controls ────────────────────────────────────── */}
      <section className="sticky top-[64px] sm:top-[72px] z-30 border-b bg-[#F5F4EF]/95 py-4 backdrop-blur-md" style={{ borderColor: "var(--ix-border)" }}>
        <div className="ix-shell flex flex-col gap-4">
          <div className="relative max-w-xl">
            <Search className={`absolute top-3.5 h-4 w-4 text-[#7B847F] ${isRTL ? "right-4" : "left-4"}`} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy("Search courses", "ابحث عن الدورات")}
              aria-label={copy("Search courses", "ابحث عن الدورات")}
              className={`h-11 w-full rounded-full border border-[#D8DDD8] bg-white px-10 text-sm outline-none transition-colors focus:border-[#52735F] focus:ring-2 focus:ring-[#52735F]/15 ${
                isRTL ? "pr-10" : "pl-10"
              }`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#52735F]" />
            {["All", ...categories].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  category === item ? "bg-[#52735F] text-white shadow-sm" : "bg-white border border-[#D8DDD8] text-[#5E6862] hover:bg-[#EAEDEA]"
                }`}
              >
                {item === "All" ? copy("All courses", "كل الدورات") : item}
              </button>
            ))}
            <span className="ms-2 text-xs font-bold text-[#7B847F]">{copy("Tuition", "الرسوم")}</span>
            {(["EGP", "USD"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCurrency(item)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  currency === item ? "bg-[#52735F] text-white shadow-sm" : "bg-white border border-[#D8DDD8] text-[#5E6862] hover:bg-[#EAEDEA]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses Grid ──────────────────────────────────────────────────── */}
      <section className="ix-section bg-[#F5F4EF]">
        <div className="ix-shell">
          {isLoading ? (
            <div className="grid min-h-80 place-items-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#52735F]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="border-y border-[#D8DDD8] py-20 text-center">
              <h2 className="text-2xl font-bold text-[#1F2925]">{copy("No courses match these filters.", "لا توجد دورات تطابق عوامل التصفية هذه.")}</h2>
              <p className="mt-3 text-[#5E6862]">{copy("Try another search term or clear the active filters.", "جرّب عبارة بحث أخرى أو امسح عوامل التصفية النشطة.")}</p>
              <button onClick={reset} className="ix-link mt-4">
                {copy("Clear filters", "مسح عوامل التصفية")}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="ix-kicker">{isLive ? copy("Live learning", "تعلم مباشر") : copy("Self-paced learning", "تعلم ذاتي")}</p>
                  <p className="mt-2 text-sm font-semibold text-[#5E6862]">
                    {filtered.length} {copy("courses available", "دورات متاحة")}
                  </p>
                </div>
                <p className="text-xs text-[#7B847F]">
                  {copy("Choose a course to view its full curriculum and enrollment path.", "اختر دورة لعرض المنهج الكامل ومسار التسجيل.")}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} currency={currency} isEnrolled={enrolledIds.has(course.id)} studentId={studentId} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

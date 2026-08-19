import { useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowUpRight, Loader2, Search, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

export default function Programs() {
  const { data: programs = [], isLoading } = trpc.admin.getPrograms.useQuery();
  const { isRTL, t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("All");
  const [format, setFormat] = useState("All");
  const copy = (en: string, ar: string) => t(en, ar, en);
  useSEO({
    title: "Programs | Infinity X Academy",
    description: "Discover practical, project-based technology programs from Infinity X Academy.",
    canonical: "https://infx.space/programs",
    robots: "index, follow",
  });

  const all = programs as any[];
  const disciplines = useMemo(
    () => Array.from(new Set(all.map((program) => String(program.category || "").trim()).filter(Boolean))).sort(),
    [all]
  );
  const formats = useMemo(
    () => Array.from(new Set(all.map((program) => String(program.deliveryMode || "").trim()).filter(Boolean))).sort(),
    [all]
  );
  const filtered = useMemo(
    () =>
      all.filter(
        (program) =>
          `${program.title || ""} ${program.titleAr || program.title_ar || ""} ${program.description || ""} ${program.category || ""}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (discipline === "All" || program.category === discipline) &&
          (format === "All" || program.deliveryMode === format)
      ),
    [all, query, discipline, format]
  );

  const price = (program: any) => {
    const egp =
      Number(program.priceEgp) > 0
        ? new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(Number(program.priceEgp))
        : "";
    const usd =
      Number(program.priceUsd) > 0
        ? new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(program.priceUsd))
        : "";
    return [egp, usd].filter(Boolean).join(" / ") || copy("Contact for tuition", "تواصل لمعرفة الرسوم");
  };

  const label = (value: string) =>
    value === "All"
      ? copy("All", "الكل")
      : value.toLowerCase() === "ai"
      ? copy("AI & Data", "الذكاء الاصطناعي والبيانات")
      : value.toLowerCase() === "live"
      ? copy("Live", "مباشر")
      : value.toLowerCase() === "recorded"
      ? copy("Recorded", "مسجل")
      : value;

  const facts = (program: any) => [
    { label: copy("Level", "المستوى"), value: program.level || "—" },
    { label: copy("Duration", "المدة"), value: program.duration || "—" },
    { label: copy("Format", "النمط"), value: program.deliveryMode || "—" },
    { label: copy("Tuition", "الرسوم"), value: price(program) },
  ];

  const reset = () => {
    setQuery("");
    setDiscipline("All");
    setFormat("All");
  };
  const featured = filtered[0];

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section className="bg-[#F5F4EF] text-[#1F2925] border-b border-[#D8DDD8]/60">
          <div className="ix-shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="ix-eyebrow text-[#6453C2]">{copy("Infinity X / program desk", "إنفينيتي إكس / مكتب البرامج")}</p>
              <h1 className="ix-display mt-6 max-w-4xl text-5xl font-bold text-[#1F2925] sm:text-7xl">
                {copy("Choose the work you want to be ready for.", "اختر العمل الذي تريد أن تكون مستعداً له.")}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5E6862]">
                {copy(
                  "Compare practical programs by discipline, format, duration, and tuition. Then open the path and see the work inside it.",
                  "قارن البرامج العملية حسب التخصص والنمط والمدة والرسوم. ثم افتح المسار وشاهد العمل داخله."
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 border border-[#D8DDD8] bg-white shadow-sm sm:grid-cols-4 lg:grid-cols-2">
              <div className="border-e border-b border-[#D8DDD8] p-5">
                <p className="text-3xl font-bold text-[#6453C2]">{all.length || "—"}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Programs", "برامج")}</p>
              </div>
              <div className="border-b border-[#D8DDD8] bg-[#EAEDEA] p-5">
                <p className="text-3xl font-bold text-[#6453C2]">{disciplines.length || "—"}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#5E6862]">{copy("Disciplines", "تخصصات")}</p>
              </div>
              <div className="border-e border-[#D8DDD8] p-5">
                <p className="text-3xl font-bold text-[#6453C2]">{formats.length || "—"}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Formats", "أنماط")}</p>
              </div>
              <div className="p-5">
                <p className="text-3xl font-bold text-[#6453C2]">01</p>
                <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Student portal", "بوابة طالب")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Search and Filter Bar ────────────────────────────────────────── */}
        <section className="sticky top-[64px] sm:top-[72px] z-30 border-b bg-[#F5F4EF]/95 py-4 backdrop-blur-md" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative max-w-xl flex-1">
                <Search className={`absolute top-3.5 h-4 w-4 text-[#7B847F] ${isRTL ? "right-4" : "left-4"}`} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy("Search programs", "ابحث عن البرامج")}
                  aria-label={copy("Search programs", "ابحث عن البرامج")}
                  className={`h-11 w-full border bg-white px-10 text-sm outline-none transition-all focus:border-[#6453C2] focus:ring-2 focus:ring-[#6453C2]/15 ${
                    isRTL ? "pr-10" : "pl-10"
                  }`}
                  style={{ borderColor: "var(--ix-border)" }}
                />
              </div>
              <Link href="/courses" className="ix-button ix-button-secondary w-fit bg-white">
                {copy("Explore courses", "استكشف الدورات")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#6453C2]" />
              <span className="text-xs font-bold text-[#7B847F]">{copy("Filter", "تصفية")}</span>
              {["All", ...disciplines].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setDiscipline(item)}
                  className={`border px-3 py-1.5 text-xs font-bold transition-all rounded-sm ${
                    discipline === item
                      ? "border-[#6453C2] bg-[#6453C2] text-white shadow-sm"
                      : "border-[#D8DDD8] bg-white text-[#5E6862] hover:bg-[#EAEDEA]"
                  }`}
                >
                  {label(item)}
                </button>
              ))}
              {formats.length > 0 && (
                <>
                  {formats.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFormat(item)}
                      className={`border px-3 py-1.5 text-xs font-bold transition-all rounded-sm ${
                        format === item
                          ? "border-[#6453C2] bg-[#6453C2] text-white shadow-sm"
                          : "border-[#D8DDD8] bg-white text-[#5E6862] hover:bg-[#EAEDEA]"
                      }`}
                    >
                      {label(item)}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Programs List ───────────────────────────────────────────────── */}
        <section className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell">
            {isLoading ? (
              <div className="grid min-h-[420px] place-items-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#6453C2]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="border-y py-20 text-center" style={{ borderColor: "var(--ix-border)" }}>
                <h2 className="text-2xl font-bold text-[#1F2925]">{copy("No matching programs", "لا توجد برامج مطابقة")}</h2>
                <p className="mt-3 text-[#5E6862]">{copy("Try another search term or clear the active filters.", "جرّب عبارة بحث أخرى أو امسح عوامل التصفية النشطة.")}</p>
                <button onClick={reset} className="ix-button ix-button-secondary mt-6 bg-white">
                  {copy("Clear filters", "مسح عوامل التصفية")}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[#5E6862]">
                    {filtered.length} {copy("programs available", "برامج متاحة")}
                  </p>
                  <span className="text-xs font-bold uppercase tracking-[.14em] text-[#7B847F]">
                    {copy("Read, compare, decide", "اقرأ وقارن وقرر")}
                  </span>
                </div>

                {featured && (
                  <article className="grid overflow-hidden border border-[#D8DDD8] bg-white shadow-sm">
                    <div className="grid gap-8 bg-[#EAEDEA] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
                      <div>
                        <p className="ix-kicker">{featured.category || copy("Featured program", "برنامج مميز")}</p>
                        <h2 className="ix-display mt-5 max-w-3xl text-4xl font-bold text-[#1F2925] sm:text-5xl">
                          {copy(featured.title, featured.titleAr || featured.title_ar || featured.title)}
                        </h2>
                        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5E6862]">
                          {copy(featured.description || "", featured.descriptionAr || featured.description_ar || featured.description || "")}
                        </p>
                      </div>
                      <Link href={`/program/${featured.id}`} className="ix-button ix-button-primary w-fit">
                        {copy("Open program", "افتح البرنامج")}
                        <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                      </Link>
                    </div>
                    <dl className="grid border-t bg-white sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "var(--ix-border)" }}>
                      {facts(featured).map((fact) => (
                        <div key={fact.label} className="border-b p-5 lg:border-e lg:last:border-e-0" style={{ borderColor: "var(--ix-border)" }}>
                          <dt className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7B847F]">{fact.label}</dt>
                          <dd className="mt-2 text-sm font-bold text-[#1F2925]">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                )}

                {filtered.length > 1 && (
                  <div className="mt-12 grid border-t border-[#D8DDD8] md:grid-cols-2">
                    {filtered.slice(1).map((program: any, index: number) => (
                      <article
                        key={program.id}
                        className="group flex flex-col border-b border-[#D8DDD8] bg-white p-6 transition-colors hover:bg-[#EAEDEA]/50 sm:p-8 md:[&:nth-child(odd)]:border-e"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="ix-kicker">{program.category || copy("Program", "برنامج")}</p>
                          <span className="text-xs font-bold text-[#6453C2]">{String(index + 2).padStart(2, "0")}</span>
                        </div>
                        <h2 className="mt-5 text-2xl font-bold tracking-[-.035em] text-[#1F2925]">
                          {copy(program.title, program.titleAr || program.title_ar || program.title)}
                        </h2>
                        <dl className="mt-7 grid grid-cols-2 border-t border-[#D8DDD8]">
                          {facts(program).map((fact) => (
                            <div key={fact.label} className="border-b border-[#D8DDD8] py-4 odd:pe-4 even:border-s even:ps-4">
                              <dt className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7B847F]">{fact.label}</dt>
                              <dd className="mt-2 text-sm font-bold text-[#1F2925]">{fact.value}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="mt-auto flex flex-wrap gap-5 pt-7">
                          <Link href={`/program/${program.id}`} className="ix-link inline-flex items-center gap-2">
                            {copy("Open program", "افتح البرنامج")}
                            <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`} />
                          </Link>
                          <Link href={`/apply?programId=${program.id}&programName=${encodeURIComponent(program.title)}`} className="ix-link">
                            {copy("Apply", "قدم طلبك")}
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { ArrowLeft, ArrowRight, ArrowUpRight, Award, ChevronDown, Clock3, ExternalLink, Layers, Loader2, Video } from "lucide-react";

export default function ProgramDetails() {
  const [, params] = useRoute("/program/:id");
  const programId = params?.id || "";
  const { lang, isRTL, t } = useLanguage();
  const { data: programData, isLoading } = trpc.admin.getProgramComplete.useQuery({ id: programId }, { enabled: Boolean(programId) });
  const program = programData?.info as any;
  const modules = (programData?.modules || []) as any[];
  const copy = (en?: string, ar?: string, fallback = "") => t(en || fallback, ar || en || fallback, fallback || en || "");
  const appUrl = program ? `/apply?programId=${program.id}&programName=${encodeURIComponent(program.title)}` : "/apply";
  const skills = String(program?.skills || "").split(",").map((skill) => skill.trim()).filter(Boolean);
  const currency = (value: unknown, code: string) =>
    Number(value) > 0 ? new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(Number(value)) : "";
  const tuition = [currency(program?.priceEgp, "EGP"), currency(program?.priceUsd, "USD")].filter(Boolean).join(" / ") || copy("Contact for tuition", "تواصل لمعرفة الرسوم", "Contact for tuition");
  useSEO({
    title: program?.title ? `${program.title} | Infinity X Academy` : "Academy Program | Infinity X",
    description: program?.description || "Explore a practical technology program from Infinity X Academy.",
    canonical: `https://infx.space/program/${programId}`,
    robots: isLoading ? undefined : program ? "index, follow" : "noindex, follow",
  });

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F5F4EF] text-[#1F2925]">
        <Loader2 className="h-8 w-8 animate-spin text-[#52735F]" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className={`ix-page grid min-h-screen place-items-center bg-[#F5F4EF] px-6 text-center text-[#1F2925] ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div>
          <Award className="mx-auto h-10 w-10 text-[#52735F]" />
          <h1 className="ix-display mt-6 text-4xl font-bold">{copy("Program not found.", "البرنامج غير موجود.")}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#5E6862]">
            {copy("This program may no longer be available. Explore the current Academy offering.", "قد لا يكون هذا البرنامج متاحاً حالياً. استكشف عروض الأكاديمية الحالية.")}
          </p>
          <Link href="/programs" className="ix-button ix-button-primary mt-8">
            {copy("Explore programs", "استكشف البرامج")}
            <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    );
  }

  const facts = [
    { label: copy("Discipline", "التخصص"), value: copy(program.category, program.categoryAr, copy("Academy program", "برنامج أكاديمي")), icon: Layers },
    { label: copy("Duration", "المدة"), value: program.duration || copy("See curriculum", "راجع المنهج"), icon: Clock3 },
    { label: copy("Format", "النمط"), value: program.deliveryMode || copy("See program details", "راجع تفاصيل البرنامج"), icon: Video },
    { label: copy("Tuition", "الرسوم"), value: tuition, icon: Award },
  ];

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section className="bg-[#F5F4EF] text-[#1F2925] border-b border-[#D8DDD8]/60">
          <div className="ix-shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <div>
              <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5E6862] hover:text-[#1F2925] transition-colors">
                <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                {copy("All programs", "كل البرامج")}
              </Link>
              <p className="ix-eyebrow mt-8 text-[#52735F]">{copy("Infinity X Academy program", "برنامج أكاديمية إنفينيتي إكس")}</p>
              <h1 className="ix-display mt-6 max-w-3xl text-5xl font-bold text-[#1F2925] sm:text-6xl">{copy(program.title, program.titleAr, program.title)}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5E6862]">{copy(program.description, program.descriptionAr, program.description)}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href={appUrl} className="ix-button ix-button-primary">
                  {copy("Apply to this program", "قدم طلباً لهذا البرنامج")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a href="#curriculum" className="ix-button ix-button-secondary bg-white">
                  {copy("View curriculum", "عرض المنهج")}
                </a>
              </div>
            </div>

            {/* Visual Header Box */}
            <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-[#D8DDD8] bg-white shadow-lg">
              {program.imageUrl ? (
                <img src={program.imageUrl} alt={copy(program.title, program.titleAr, program.title)} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
              ) : (
                <div className="absolute inset-0 bg-[#EAEDEA] bg-[linear-gradient(135deg,rgba(82,115,95,.15)_1px,transparent_1px),linear-gradient(45deg,rgba(31,41,37,.08)_1px,transparent_1px)] bg-[size:30px_30px]" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1F2925]/85 via-[#1F2925]/50 to-transparent p-7 pt-20 text-white">
                <p className="ix-eyebrow text-[#B8D4C2]">{copy("Project-based learning", "تعلم قائم على المشاريع")}</p>
                <p className="mt-2 max-w-md text-2xl font-bold tracking-[-.035em]">
                  {copy("A structured path from guided practice to applied work.", "مسار منظم من الممارسة الموجهة إلى العمل التطبيقي.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Facts Grid ───────────────────────────────────────────────────── */}
        <section className="border-b bg-white" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell">
            <dl className="grid border-s sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "var(--ix-border)" }}>
              {facts.map(({ label, value, icon: Icon }) => (
                <div key={label} className="border-b p-6 lg:border-e lg:last:border-e-0" style={{ borderColor: "var(--ix-border)" }}>
                  <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#7B847F]">
                    <Icon className="h-3.5 w-3.5 text-[#52735F]" />
                    {label}
                  </dt>
                  <dd className="mt-3 text-sm font-bold leading-6 text-[#1F2925]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Skills & Learning Design ─────────────────────────────────────── */}
        {(skills.length > 0 || modules.length > 0) && (
          <section className="border-b bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
            <div className="ix-shell grid gap-10 py-16 lg:grid-cols-[.8fr_1.2fr] lg:py-20">
              <div>
                <p className="ix-kicker">{copy("Program outcome", "مخرجات البرنامج")}</p>
                <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925]">{copy("Build evidence of what you can do.", "ابنِ دليلاً على ما يمكنك إنجازه.")}</h2>
                <p className="mt-5 max-w-md text-base leading-7 text-[#5E6862]">
                  {copy("The program is structured around practical learning rather than an undirected content library.", "صُمم البرنامج حول التعلم العملي بدلاً من مكتبة محتوى غير موجهة.")}
                </p>
              </div>
              <div className="bg-white border border-[#D8DDD8] p-8 shadow-sm">
                {skills.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#7B847F]">{copy("Skills covered", "المهارات التي يغطيها البرنامج")}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className="border border-[#D8DDD8] bg-[#F5F4EF] px-3 py-1.5 text-xs font-semibold text-[#1F2925] rounded-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {modules.length > 0 && (
                  <div className={`pt-6 ${skills.length > 0 ? "mt-8 border-t border-[#D8DDD8]" : ""}`}>
                    <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#7B847F]">{copy("Learning design", "تصميم التعلم")}</p>
                    <p className="mt-2 text-sm leading-7 text-[#5E6862]">
                      {copy(`${modules.length} structured module${modules.length === 1 ? "" : "s"} with linked course work.`, `${modules.length} وحدة منظمة مرتبطة بعمل المقررات.`)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Curriculum Details ───────────────────────────────────────────── */}
        <section id="curriculum" className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="ix-kicker">{copy("Curriculum", "المنهج")}</p>
              <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925]">{copy("A route through the work, not a wall of content.", "مسار خلال العمل، وليس جداراً من المحتوى.")}</h2>
            </div>
            <div className="border-t border-[#D8DDD8] bg-white p-6 shadow-sm">
              {modules.length === 0 ? (
                <div className="py-12 text-sm leading-7 text-[#5E6862]">
                  {copy("Curriculum details are being prepared for this program.", "يجري إعداد تفاصيل المنهج لهذا البرنامج.")}
                </div>
              ) : (
                modules.map((module, index) => (
                  <details key={module.id} open={index === 0} className="group border-b border-[#D8DDD8] last:border-b-0">
                    <summary className="flex list-none items-center justify-between gap-5 py-6 marker:content-none cursor-pointer">
                      <div className="grid gap-3 sm:grid-cols-[58px_1fr]">
                        <span className="text-sm font-bold text-[#52735F]">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7B847F]">
                            {copy("Module", "وحدة")} {index + 1}
                            {module.duration ? ` · ${module.duration}` : ""}
                          </p>
                          <h3 className="mt-1 text-xl font-bold text-[#1F2925]">{copy(module.title, module.titleAr, module.title)}</h3>
                          {module.description && <p className="mt-2 max-w-xl text-sm leading-6 text-[#5E6862]">{copy(module.description, module.descriptionAr, module.description)}</p>}
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#52735F] transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pb-7 ps-0 sm:ps-[58px]">
                      <div className="border-s border-[#D8DDD8] ps-5">
                        {!module.courses?.length ? (
                          <p className="text-sm text-[#5E6862]">{copy("Course work is being prepared for this module.", "يجري إعداد عمل المقررات لهذه الوحدة.")}</p>
                        ) : (
                          <ul className="space-y-4">
                            {module.courses.map((course: any) => (
                              <li key={course.junctionId || course.id} className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-bold text-[#1F2925]">{copy(course.title, course.titleAr, course.title)}</p>
                                  <p className="mt-1 text-xs text-[#7B847F]">{[course.duration, course.level, course.courseType].filter(Boolean).join(" · ")}</p>
                                </div>
                                {course.courseLink && (
                                  <a href={course.courseLink} target="_blank" rel="noreferrer" className="ix-link inline-flex items-center gap-1 text-xs">
                                    {copy("View syllabus", "عرض المنهج")}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </details>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── Bottom Application CTA ───────────────────────────────────────── */}
        <section className="border-t bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-8 py-16 sm:grid-cols-[1.35fr_.65fr] sm:items-end">
            <div>
              <p className="ix-eyebrow text-[#52735F]">{copy("Application", "التقديم")}</p>
              <h2 className="ix-display mt-5 max-w-2xl text-4xl font-bold text-[#1F2925]">{copy("Ready to turn interest into practical work?", "هل أنت مستعد لتحويل الاهتمام إلى عمل عملي؟")}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#5E6862]">{copy("Submit your details and the admissions team will review your application.", "أرسل بياناتك وسيراجع فريق القبول طلبك.")}</p>
            </div>
            <Link href={appUrl} className="ix-button ix-button-primary w-full sm:w-auto">
              {copy("Apply to this program", "قدم طلباً لهذا البرنامج")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

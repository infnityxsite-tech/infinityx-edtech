import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";
import { ArrowUpRight, ShieldCheck, Waypoints, Workflow } from "lucide-react";
import { Link } from "wouter";

export default function Work() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const rule = isLight ? "border-[#D8DDD8]" : "border-white/10";
  const muted = isLight ? "text-[#5E6862]" : "text-slate-300";
  useSEO({
    title: "Engineering Work & Case Studies",
    description: "How Infinity X approaches engineering work under operational constraints.",
    canonical: "https://infx.space/work",
    robots: "index, follow",
  });

  const principles = [
    {
      icon: Workflow,
      number: "01",
      title: t("Start with the constraint", "نبدأ بالقيد", "Start with the constraint"),
      detail: t(
        "Map the workflow, environment, data, and decision that need to change.",
        "نرسم سير العمل والبيئة والبيانات والقرار الذي يحتاج إلى تغيير.",
        "Map the workflow, environment, data, and decision that need to change."
      ),
    },
    {
      icon: Waypoints,
      number: "02",
      title: t("Build the operating system", "نبني النظام التشغيلي", "Build the operating system"),
      detail: t(
        "Connect the model to interfaces, controls, deployment, and the people who use it.",
        "نصل النموذج بالواجهات والضوابط والنشر والأشخاص الذين يستخدمونه.",
        "Connect the model to interfaces, controls, deployment, and the people who use it."
      ),
    },
    {
      icon: ShieldCheck,
      number: "03",
      title: t("Share proof responsibly", "نشارك الأدلة بمسؤولية", "Share proof responsibly"),
      detail: t(
        "Public work is documented only where scope, results, and permission can be stated accurately.",
        "لا نوثق العمل علناً إلا عندما يمكن ذكر النطاق والنتائج والإذن بدقة.",
        "Public work is documented only where scope, results, and permission can be stated accurately."
      ),
    },
  ];

  return (
    <div
      className={`ix-page ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />
      <main>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <section className={`border-b pt-12 sm:pt-16 ${rule}`}>
          <div className="mx-auto max-w-7xl px-6 pb-14 lg:px-8 lg:pb-16">
            <p className="text-xs font-bold uppercase tracking-[.17em] text-[#52735F]">
              {t("Infinity X engineering work", "أعمال إنفينيتي إكس الهندسية", "Infinity X engineering work")}
            </p>
            <div className="mt-6 grid gap-9 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
              <h1 className="max-w-4xl text-5xl font-extrabold tracking-[-.06em] text-[#1F2925] sm:text-6xl lg:text-7xl">
                {t("Systems built under real operating constraints.", "أنظمة بُنيت تحت قيود تشغيلية حقيقية.", "Systems built under real operating constraints.")}
              </h1>
              <p className={`max-w-lg text-lg leading-8 ${muted}`}>
                {t(
                  "Every engagement begins with the operating context, then defines the system, deployment path, and ownership model around it.",
                  "تبدأ كل مشاركة بالسياق التشغيلي، ثم تحدد النظام ومسار النشر ونموذج الملكية حوله.",
                  "Every engagement begins with operating context and defines the system, deployment path, and ownership model around it."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ── Principles ──────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className={`grid border-t ${rule} md:grid-cols-3`}>
            {principles.map(({ icon: Icon, number, title, detail }, index) => (
              <article key={number} className={`border-b py-8 md:px-8 md:py-12 ${index > 0 ? "md:border-s" : ""} ${rule}`}>
                <Icon className="h-5 w-5 text-[#52735F]" />
                <p className="mt-10 text-xs font-bold tracking-[.16em] text-[#52735F]">{number}</p>
                <h2 className="mt-5 text-2xl font-extrabold tracking-[-.04em] text-[#1F2925]">{title}</h2>
                <p className={`mt-4 max-w-sm text-sm leading-7 ${muted}`}>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Public Portfolio Note ────────────────────────────────────────── */}
        <section className={`border-y ${isLight ? "border-[#D8DDD8] bg-[#EAEDEA]" : "border-white/10 bg-white/[.03]"}`}>
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{t("Public portfolio", "محفظة عامة", "Public portfolio")}</p>
              <h2 className="mt-5 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">
                {t("Evidence should be specific—or it should not be published.", "يجب أن يكون الدليل محدداً، أو لا يُنشر.", "Evidence should be specific—or it should not be published.")}
              </h2>
            </div>
            <div className={`self-center border-s ps-0 lg:ps-12 ${rule}`}>
              <p className={`max-w-xl text-lg leading-8 ${muted}`}>
                {t(
                  "No public case studies are currently published. When an engagement can be shared, it will include the agreed scope, operating constraints, system approach, and approved outcomes—without inventing proof.",
                  "لا توجد دراسات حالة عامة منشورة حالياً. وعندما يمكن مشاركة مشروع، سيشمل النطاق المتفق عليه والقيود التشغيلية ونهج النظام والنتائج المعتمدة دون اختلاق أدلة.",
                  "No public case studies are currently published. Shared work will include approved scope, constraints, system approach, and outcomes."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <section className="border-t bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-[1.5fr_1fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{t("Your project", "مشروعك", "Your project")}</p>
              <h2 className="mt-5 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">
                {t(
                  "Bring the challenge. We’ll define the system and the path to deployment.",
                  "أحضر التحدي. وسنحدد النظام ومسار النشر.",
                  "Bring the challenge. We’ll define the system and the path to deployment."
                )}
              </h2>
            </div>
            <div className="flex items-end">
              <Link href="/consultation">
                <Button className="h-12 rounded-md bg-[#52735F] px-5 font-bold text-white hover:bg-[#43614F]">
                  {t("Start an AI project", "ابدأ مشروع ذكاء اصطناعي", "Start an AI project")}
                  <ArrowUpRight className="ms-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

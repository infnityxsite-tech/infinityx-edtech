import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, PlayCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

export default function Courses() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  useSEO({
    title: "Courses | Infinity X Academy",
    description: "Choose live or recorded technology courses from Infinity X Academy.",
    canonical: "https://infx.space/courses",
    robots: "index, follow",
  });

  const formats = [
    {
      title: t("Learn live, alongside a cohort.", "تعلم مباشرة ضمن دفعة.", "Learn live, alongside a cohort."),
      description: t("Instructor-led short courses with planned sessions, feedback, and a shared pace.", "دورات قصيرة يقودها مدربون مع جلسات مخططة وملاحظات وإيقاع مشترك.", "Instructor-led short courses with planned sessions and feedback."),
      label: t("Explore live courses", "استكشف الدورات المباشرة", "Explore live courses"),
      href: "/courses/live",
      icon: CalendarDays,
    },
    {
      title: t("Learn on your own schedule.", "تعلم وفق جدولك.", "Learn on your own schedule."),
      description: t("Recorded courses for focused practice when and where it fits your work.", "دورات مسجلة لممارسة مركزة في الوقت والمكان المناسبين لعملك.", "Recorded courses for focused practice on your schedule."),
      label: t("Explore recorded courses", "استكشف الدورات المسجلة", "Explore recorded courses"),
      href: "/courses/recorded",
      icon: PlayCircle,
    },
  ];

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-12 sm:pt-16 lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">
              {t("Infinity X Academy", "أكاديمية إنفينيتي إكس", "Infinity X Academy")}
            </p>
            <h1 className="mt-6 text-5xl font-extrabold tracking-[-.065em] text-[#1F2925] sm:text-6xl">
              {t("Choose the learning experience that fits your work.", "اختر تجربة التعلم التي تناسب عملك.", "Choose the learning experience that fits your work.")}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5E6862]">
              {t(
                "Both formats are designed around practical technology work. The difference is how you prefer to learn.",
                "كلا النمطين مصممان حول العمل التقني العملي. والفرق هو كيف تفضل أن تتعلم.",
                "Both formats are designed around practical technology work."
              )}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 sm:grid-cols-2 lg:px-8 lg:pb-28">
          {formats.map((format) => (
            <Link
              key={format.href}
              href={format.href}
              className="group min-h-[340px] rounded-lg border border-[#D8DDD8] bg-white p-8 shadow-sm transition-all hover:border-[#52735F] hover:shadow-md sm:p-10"
            >
              <format.icon className="h-8 w-8 text-[#52735F]" />
              <h2 className="mt-12 max-w-sm text-3xl font-extrabold tracking-[-.045em] text-[#1F2925] group-hover:text-[#52735F] transition-colors">
                {format.title}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[#5E6862]">{format.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#52735F]">
                {format.label}
                <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`} />
              </span>
            </Link>
          ))}
        </section>

        <section className="border-y border-[#D8DDD8] bg-[#EAEDEA] py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-bold text-[#52735F] hover:text-[#43614F]">
              {t("Looking for a longer program? Explore Academy programs.", "تبحث عن برنامج أطول؟ استكشف برامج الأكاديمية.", "Looking for a longer program? Explore Academy programs.")}
              <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

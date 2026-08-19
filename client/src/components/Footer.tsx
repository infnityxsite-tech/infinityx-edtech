import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { ArrowUpRight, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/infinity-x-solutions/" },
  { label: "YouTube", href: "https://www.youtube.com/@InfinityXSolutions" },
  { label: "Facebook", href: "https://www.facebook.com/infinityxsolution" },
];

export default function Footer() {
  const { t } = useLanguage();
  const columns = [
    {
      title: t("Solutions", "الحلول", "Solutions"),
      links: [
        { label: t("Explore solutions", "استكشف الحلول", "Explore solutions"), href: "/solutions" },
        { label: t("Request a consultation", "اطلب استشارة", "Request a consultation"), href: "/consultation" },
      ],
    },
    {
      title: t("Academy", "الأكاديمية", "Academy"),
      links: [
        { label: t("Academy overview", "نظرة عامة على الأكاديمية", "Academy overview"), href: "/academy" },
        { label: t("Programs", "البرامج", "Programs"), href: "/programs" },
        { label: t("Live courses", "الدورات المباشرة", "Live courses"), href: "/courses/live" },
        { label: t("Recorded courses", "الدورات المسجلة", "Recorded courses"), href: "/courses/recorded" },
        { label: t("Student portal", "بوابة الطالب", "Student portal"), href: "/login" },
      ],
    },
    {
      title: t("Company", "الشركة", "Company"),
      links: [
        { label: t("About", "من نحن", "About"), href: "/about" },
        { label: t("Careers", "الوظائف", "Careers"), href: "/careers" },
        { label: t("Insights", "المدونة", "Insights"), href: "/blog" },
        { label: t("Contact", "تواصل", "Contact"), href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="bg-[#18201B] text-white border-t border-[#232D27]">
      <div className="ix-shell py-16 lg:py-24">
        {/* Top banner */}
        <div className="mb-16 grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="ix-eyebrow text-[#B8D4C2]">{t("The next system starts here", "يبدأ النظام القادم من هنا", "The next system starts here")}</p>
            <h2 className="ix-display mt-5 max-w-3xl text-4xl font-bold sm:text-6xl">
              {t("Bring the work. We'll build the system around it.", "أحضر العمل. وسنبني النظام حوله.", "Bring the work. We'll build the system around it.")}
            </h2>
          </div>
          <Link href="/consultation" className="ix-button ix-button-primary bg-[#52735F] hover:bg-[#43614F] text-white">
            {t("Start a project", "ابدأ مشروعاً", "Start a project")}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4-column footer content */}
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1.95fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label={`${APP_TITLE} home`}>
              <img
                src={APP_LOGO}
                alt="Infinity X"
                className="h-8 w-auto max-w-[36px] object-contain brightness-110"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-base font-bold tracking-tight text-white">{APP_TITLE}</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[#C8D1CC]">
              {t(
                "We engineer production-ready AI systems and grow the teams that operate them.",
                "نصمم أنظمة ذكاء اصطناعي جاهزة للإنتاج ونبني الفرق القادرة على تشغيلها.",
                "We engineer production-ready AI systems and grow the teams that operate them."
              )}
            </p>
            <a href="mailto:support@infx.space" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#B8D4C2]">
              <Mail className="h-4 w-4 text-[#B8D4C2]" />
              support@infx.space
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8A968F]">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-[#C8D1CC] transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom copyright row */}
      <div className="border-t border-white/10 bg-[#141A16]">
        <div className="ix-shell flex flex-col gap-3 py-5 text-xs text-[#8A968F] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {APP_TITLE}. {t("All rights reserved.", "جميع الحقوق محفوظة.", "All rights reserved.")}</p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#B8D4C2]">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

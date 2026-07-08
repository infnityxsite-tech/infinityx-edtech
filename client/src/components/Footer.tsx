import { Link } from "wouter";
import { APP_TITLE } from "@/const";
import { ArrowUpRight, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/infinity-x-solutions/", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
  )},
  { label: "YouTube", href: "https://www.youtube.com/@InfinityXSolutions", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
  )},
  { label: "Facebook", href: "https://www.facebook.com/infinityxsolution", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
  )},
  { label: "Telegram", href: "https://t.me/AhmedSFarahat", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.601.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.202-.656-.639.135-.953l11.57-4.458c.535-.195 1.002.128.831.939z" /></svg>
  )},
];

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t("Home", "الرئيسية", "Home"), href: "/" },
    { label: t("About Us", "من نحن", "About Us"), href: "/about" },
    { label: t("Solutions", "الحلول", "Solutions"), href: "/solutions" },
    { label: t("Courses", "الدورات", "Courses"), href: "/courses" },
    { label: t("Blog", "المدونة", "Blog"), href: "/blog" },
    { label: t("Careers", "الوظائف", "Careers"), href: "/careers" },
  ];

  const serviceLinks = [
    { label: t("AI Solutions", "حلول الذكاء الاصطناعي", "AI Solutions"), href: "/solutions" },
    { label: t("Computer Vision", "الرؤية الحاسوبية", "Computer Vision"), href: "/solutions" },
    { label: t("Custom Software", "برمجيات مخصصة", "Custom Software"), href: "/solutions" },
    { label: t("Corporate Training", "التدريب المؤسسي", "Corporate Training"), href: "/courses" },
  ];

  return (
    <footer className="bg-[#030712] text-white border-t border-white/[0.08]">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <img src="/uploads/logo.png" alt={APP_TITLE}
                className="h-8 w-auto object-contain brightness-110"
                onError={(e) => { e.currentTarget.src = '/uploads/logo_new.png'; }} />
              <span className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{APP_TITLE}</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-5 max-w-xs">
              {t(
                "Enterprise AI solutions, computer vision systems, and corporate tech upskilling. We build and train for the future.",
                "حلول ذكاء اصطناعي للمؤسسات، وأنظمة رؤية حاسوبية، وتدريب تقني مؤسسي. نبني وندرب للمستقبل.",
                "Enterprise AI, CV systems, and corporate training."
              )}
            </p>
            <a href="mailto:support@infx.space" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
              <Mail className="w-3.5 h-3.5" /> support@infx.space
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">{t("Platform", "المنصة", "Platform")}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/verify">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">{t("Verify Certificate", "التحقق من الشهادة", "Verify Certificate")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">{t("Services", "الخدمات", "Services")}</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map(link => (
                <li key={link.href + link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + CTA */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">{t("Connect", "تواصل", "Connect")}</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                  className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.12] transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
            <Link href="/consultation">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
                {t("Request Consultation", "اطلب استشارة", "Request Consultation")} <ArrowUpRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} {APP_TITLE}. {t("All rights reserved.", "جميع الحقوق محفوظة.", "All rights reserved.")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about">
              <span className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">{t("Privacy", "الخصوصية", "Privacy")}</span>
            </Link>
            <Link href="/about">
              <span className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">{t("Terms", "الشروط", "Terms")}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link, useLocation } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { ArrowUpRight, Globe, LayoutDashboard, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Logo image with IX-box fallback ─────────────────────────────────────────
function BrandLogo({ className = "h-8 w-auto" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#52735F] text-xs font-black tracking-[-.06em] text-white">
        IX
      </span>
    );
  }
  return (
    <img
      src={APP_LOGO}
      alt="Infinity X"
      className={className}
      style={{ objectFit: "contain" }}
      onError={() => setFailed(true)}
      draggable={false}
      fetchPriority="high"
      decoding="async"
    />
  );
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { isRTL, t, lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    setStudentId(localStorage.getItem("studentId"));
    setStudentName(localStorage.getItem("studentName"));
  }, [location]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    setStudentId(null);
    setStudentName(null);
    navigate("/");
  };

  const links = [
    { label: t("Solutions", "الحلول", "Solutions"), path: "/solutions" },
    { label: t("Academy", "الأكاديمية", "Academy"), path: "/academy" },
    { label: t("Company", "الشركة", "Company"), path: "/about" },
  ];

  const active = (path: string) => {
    if (path === "/solutions") return location === path || location.startsWith("/solutions/");
    if (path === "/academy") return location === path || location.startsWith("/academy/") || location.startsWith("/program") || location.startsWith("/courses");
    if (path === "/about") return location === "/about" || location === "/company";
    return location === path;
  };

  const linkClass = (path: string) =>
    `inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all ${
      active(path)
        ? isLight
          ? "bg-[#E4EBE6] text-[#2F4A37] shadow-[0_1px_4px_rgba(82,115,95,.1)]"
          : "bg-white/12 text-white"
        : isLight
          ? "text-[#5E6862] hover:bg-[#EAEDEA] hover:text-[#1F2925]"
          : "text-[#b8c7d0] hover:bg-white/10 hover:text-white"
    }`;

  const navBg = isLight
    ? scrolled
      ? "border-b border-[#D8DDD8] bg-[#F5F4EF]/98 shadow-[0_4px_20px_rgba(0,0,0,.04)] backdrop-blur-md"
      : "border-b border-[#D8DDD8]/70 bg-[#F5F4EF]/95 backdrop-blur-md"
    : scrolled
      ? "border-b border-white/10 bg-[#07111b]/95 backdrop-blur-xl shadow-lg"
      : "border-b border-white/5 bg-[#07111b]/90 backdrop-blur-xl";

  return (
    <nav aria-label="Primary navigation" className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${navBg}`}>
      {/* ── Main cohesive header bar ─────────────────────────────────────── */}
      <div className="ix-shell flex h-[64px] sm:h-[72px] min-w-0 items-center justify-between">

        {/* Brand Group */}
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 group" aria-label={`${APP_TITLE} home`}>
          <BrandLogo className="h-8 w-auto max-w-[34px] transition-transform group-hover:scale-105" />
          <span className={`truncate text-[15px] sm:text-base font-bold tracking-tight ${isLight ? "text-[#1F2925]" : "text-white"}`}>
            {APP_TITLE}
          </span>
        </Link>

        {/* ── Desktop Navigation (lg+) ──────────────────────────────────── */}
        <div className="hidden min-w-0 items-center gap-1.5 lg:flex">
          <Link href="/" className={linkClass("/")}>{t("Home", "الرئيسية", "Home")}</Link>
          {links.map((item) => (
            <Link key={item.path} href={item.path} className={linkClass(item.path)}>{item.label}</Link>
          ))}
        </div>

        {/* ── Desktop Actions (lg+) ──────────────────────────────────────── */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <button
            type="button"
            onClick={toggleLang}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors ${isLight ? "text-[#5E6862] hover:bg-[#EAEDEA] hover:text-[#1F2925]" : "text-[#b8c7d0] hover:bg-white/10"}`}
            aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "AR" : "EN"}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${isLight ? "text-[#5E6862] hover:bg-[#EAEDEA] hover:text-[#1F2925]" : "text-[#b8c7d0] hover:bg-white/10"}`}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          {studentId ? (
            <>
              <Link
                href="/dashboard"
                className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold ${isLight ? "border-[#D8DDD8] text-[#1F2925] hover:bg-[#EAEDEA]" : "border-white/15 text-white"}`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {studentName || t("Portal", "البوابة", "Portal")}
              </Link>
              <button onClick={logout} className="rounded-full p-2 text-[#7B847F] hover:text-red-600" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`px-3 text-xs font-bold ${isLight ? "text-[#5E6862] hover:text-[#1F2925]" : "text-[#b8c7d0] hover:text-white"}`}
            >
              {t("Student Portal", "بوابة الطالب", "Student Portal")}
            </Link>
          )}
          <Link
            href="/consultation"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#52735F] px-4 text-xs font-bold text-white shadow-[0_3px_12px_rgba(82,115,95,.25)] transition-all hover:bg-[#43614F] hover:shadow-[0_4px_16px_rgba(82,115,95,.35)] active:scale-95"
          >
            {t("Start a project", "ابدأ مشروعاً", "Start a project")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* ── Mobile Coherent Controls (<lg): Start CTA + Hamburger ──────── */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/consultation"
            className="inline-flex h-8 items-center gap-1 rounded-full bg-[#52735F] px-3 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-[#43614F] active:scale-95 whitespace-nowrap"
          >
            {t("Start", "ابدأ", "Start")}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${isLight ? "text-[#1F2925] hover:bg-[#EAEDEA]" : "text-white hover:bg-white/10"}`}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ─────────────────────────────────────────── */}
      {open && (
        <div
          className={`border-b lg:hidden ${isLight ? "border-[#D8DDD8] bg-[#F5F4EF]/98 shadow-xl" : "border-white/10 bg-[#07111b]"}`}
          style={{ backdropFilter: "blur(16px)" }}
        >
          <div className="ix-shell py-5">
            {/* Navigation links */}
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {[{ label: t("Home", "الرئيسية", "Home"), path: "/" }, ...links].map((item) => (
                <Link key={item.path} href={item.path} className={linkClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Quick controls: Language + Theme */}
            <div className={`mt-4 flex items-center gap-2 border-t pt-4 ${isLight ? "border-[#D8DDD8]" : "border-white/10"}`}>
              <button
                type="button"
                onClick={toggleLang}
                className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold transition-colors ${isLight ? "border-[#D8DDD8] text-[#5E6862] hover:bg-[#EAEDEA] hover:text-[#1F2925]" : "border-white/15 text-[#b8c7d0] hover:bg-white/10"}`}
                aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
              >
                <Globe className="h-3.5 w-3.5" />
                {lang === "en" ? "العربية" : "English"}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${isLight ? "border-[#D8DDD8] text-[#5E6862] hover:bg-[#EAEDEA] hover:text-[#1F2925]" : "border-white/15 text-[#b8c7d0] hover:bg-white/10"}`}
                aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
              >
                {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>

            {/* CTA action buttons */}
            <div className={`mt-4 grid gap-2 border-t pt-4 ${isLight ? "border-[#D8DDD8]" : "border-white/10"}`}>
              <Link href="/consultation" className="ix-button ix-button-primary w-full">
                {t("Start an AI project", "ابدأ مشروع ذكاء اصطناعي", "Start an AI project")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {studentId ? (
                <>
                  <Link href="/dashboard" className="ix-button ix-button-secondary w-full">
                    <LayoutDashboard className="h-4 w-4" />
                    {t("Student Portal", "بوابة الطالب", "Student Portal")}
                  </Link>
                  <button onClick={logout} className="ix-button w-full text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    {t("Sign out", "تسجيل الخروج", "Sign out")}
                  </button>
                </>
              ) : (
                <Link href="/login" className="ix-button ix-button-secondary w-full">
                  {t("Student Portal", "بوابة الطالب", "Student Portal")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

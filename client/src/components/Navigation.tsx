import { Link, useLocation } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { ArrowUpRight, Globe, LayoutDashboard, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Logo image with IX-box fallback ─────────────────────────────────────────
function BrandLogo({ className = "h-9 w-auto" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-[#1268e5] text-sm font-black tracking-[-.06em] text-white">
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

  useEffect(() => { setStudentId(localStorage.getItem("studentId")); setStudentName(localStorage.getItem("studentName")); }, [location]);
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
    `inline-flex items-center rounded-full px-3 py-2 text-[13px] font-semibold transition-all ${
      active(path)
        ? isLight
          ? "bg-[#dceaff] text-[#0d55bd] shadow-[0_4px_14px_rgba(18,104,229,.12)]"
          : "bg-white/12 text-white"
        : isLight
          ? "text-[#52606b] hover:bg-[#eef2f4] hover:text-[#10202d]"
          : "text-[#b8c7d0] hover:bg-white/10 hover:text-white"
    }`;

  const navBg = scrolled
    ? isLight
      ? "border-b border-[#d9e0e4]/90 bg-white/96 shadow-[0_8px_30px_rgba(16,32,45,.06)] backdrop-blur-xl"
      : "border-b border-white/10 bg-[#07111b]/94 backdrop-blur-xl"
    : "bg-transparent";

  return (
    <nav aria-label="Primary navigation" className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navBg}`}>
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <div className="ix-shell flex h-[68px] min-w-0 items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label={`${APP_TITLE} home`}>
          <BrandLogo className="h-9 w-auto max-w-[38px]" />
          {/* Text label: hidden on small mobile, shown from sm up */}
          <span className={`hidden sm:block truncate text-[15px] font-bold tracking-[-.025em] ${isLight ? "text-[#10202d]" : "text-white"}`}>
            {APP_TITLE}
          </span>
        </Link>

        {/* ── Desktop nav (lg+) ─────────────────────────────────────────── */}
        <div className="hidden min-w-0 items-center gap-1 lg:flex">
          <Link href="/" className={linkClass("/")}>{t("Home", "الرئيسية", "Home")}</Link>
          {links.map((item) => (
            <Link key={item.path} href={item.path} className={linkClass(item.path)}>{item.label}</Link>
          ))}
        </div>

        {/* ── Desktop actions (lg+) ─────────────────────────────────────── */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleLang}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors ${isLight ? "text-[#52606b] hover:bg-[#eef2f4]" : "text-[#b8c7d0] hover:bg-white/10"}`}
            aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "AR" : "EN"}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${isLight ? "text-[#52606b] hover:bg-[#eef2f4]" : "text-[#b8c7d0] hover:bg-white/10"}`}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          {studentId ? (
            <>
              <Link
                href="/dashboard"
                className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold ${isLight ? "border-[#d9e0e4] text-[#10202d]" : "border-white/15 text-white"}`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {studentName || t("Portal", "البوابة", "Portal")}
              </Link>
              <button onClick={logout} className="rounded-full p-2 text-[#8a99a3] hover:text-red-500" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`px-3 text-xs font-bold ${isLight ? "text-[#52606b] hover:text-[#10202d]" : "text-[#b8c7d0] hover:text-white"}`}
            >
              {t("Student Portal", "بوابة الطالب", "Student Portal")}
            </Link>
          )}
          <Link
            href="/consultation"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1268e5] px-4 text-xs font-bold text-white shadow-[0_8px_20px_rgba(18,104,229,.2)] transition-colors hover:bg-[#0d55bd]"
          >
            {t("Start a project", "ابدأ مشروعاً", "Start a project")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* ── Mobile actions (<lg): Start CTA + Hamburger only ─────────── */}
        {/* Lang + theme are moved inside the mobile menu */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <Link
            href="/consultation"
            className="inline-flex h-9 items-center gap-1 rounded-full bg-[#1268e5] px-3.5 text-[12px] font-bold text-white whitespace-nowrap"
          >
            {t("Start", "ابدأ", "Start")}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`grid h-10 w-10 place-items-center rounded-full ${isLight ? "text-[#10202d]" : "text-white"}`}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      {open && (
        <div
          className={`border-t lg:hidden ${isLight ? "border-[#d9e0e4] bg-white/98" : "border-white/10 bg-[#07111b]"}`}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className="ix-shell py-5">
            {/* Nav links */}
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {[{ label: t("Home", "الرئيسية", "Home"), path: "/" }, ...links].map((item) => (
                <Link key={item.path} href={item.path} className={linkClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Controls row: lang + theme */}
            <div className={`mt-4 flex items-center gap-2 border-t pt-4 ${isLight ? "border-[#d9e0e4]" : "border-white/10"}`}>
              <button
                type="button"
                onClick={toggleLang}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-bold transition-colors ${isLight ? "border-[#d9e0e4] text-[#52606b] hover:bg-[#eef2f4]" : "border-white/15 text-[#b8c7d0] hover:bg-white/10"}`}
                aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
              >
                <Globe className="h-3.5 w-3.5" />
                {lang === "en" ? "العربية" : "English"}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${isLight ? "border-[#d9e0e4] text-[#52606b] hover:bg-[#eef2f4]" : "border-white/15 text-[#b8c7d0] hover:bg-white/10"}`}
                aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
              >
                {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>

            {/* CTA row */}
            <div className={`mt-4 grid gap-2 border-t pt-4 ${isLight ? "border-[#d9e0e4]" : "border-white/10"}`}>
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
                  <button onClick={logout} className="ix-button w-full text-red-500">
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

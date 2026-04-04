import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";
import { Menu, X, ChevronRight, GraduationCap, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { lang, isRTL, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  // Student auth state
  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    const name = localStorage.getItem("studentName");
    setStudentId(id);
    setStudentName(name);
  }, [location]);

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  // Scroll listener for glass effect intensification
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    setStudentId(null);
    setStudentName(null);
    navigate("/");
  };

  // Bilingual nav items
  const navItems = [
    { label: t("Home", "الرئيسية", "Home"), path: "/" },
    { label: t("About", "من نحن", "About"), path: "/about" },
    { label: t("Courses", "الدورات", "Courses"), path: "/courses" },
    { label: t("Programs", "البرامج", "Programs"), path: "/programs" },
    { label: t("Blog", "المدونة", "Blog"), path: "/blog" },
    { label: t("Verify", "التحقق", "Verify"), path: "/verify" },
    { label: t("Careers", "الوظائف", "Careers"), path: "/careers" },
  ];

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300
      ${scrolled
        ? "bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
        : "bg-[#0a0e1a]/70 backdrop-blur-md border-b border-white/[0.04]"
      }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/uploads/logo_new.png"
            alt={APP_TITLE}
            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-cyan-400 group-hover:to-cyan-300 transition-all">
            {APP_TITLE}
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link key={item.path} href={item.path}>
              <span className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer
                ${isActive(item.path)
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}>
                {item.label}
              </span>
            </Link>
          ))}

          <div className="ml-3 pl-3 border-l border-white/10 flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-white/[0.1] text-slate-400 hover:text-yellow-400 transition-all duration-200"
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {studentId ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium transition-colors border border-cyan-500/20">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {(studentName || "S").charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">{studentName}</span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 rounded-full px-5 h-8 text-xs font-semibold flex items-center gap-1.5 border-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {t("Sign In", "تسجيل الدخول", "Sign In")}
                </Button>
              </Link>
            )}
            <Link href="/contact">
              <Button className="bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 rounded-full px-4 h-8 text-xs font-semibold transition-all">
                {t("Contact Us", "تواصل معنا", "Contact Us")}
              </Button>
            </Link>
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0d1225]/98 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/40">
          <div className="flex flex-col p-4 space-y-1">
            {navItems.map(item => (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors
                  ${isActive(item.path) ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"}`}>
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive(item.path) && <ChevronRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}

            {/* Theme toggle in mobile menu */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="font-medium text-sm">{isLight ? t("Dark Mode", "الوضع الداكن", "Dark Mode") : t("Light Mode", "الوضع الفاتح", "Light Mode")}</span>
            </button>

            <div className="pt-3 mt-2 border-t border-white/[0.06] flex flex-col gap-2">
              {studentId ? (
                <>
                  <Link href="/dashboard">
                    <Button className="w-full bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 h-11 text-sm flex items-center gap-2 justify-center rounded-xl" variant="ghost">
                      <LayoutDashboard className="w-4 h-4" />
                      {t(`My Dashboard (${studentName})`, `لوحة التحكم (${studentName})`, `My Dashboard`)}
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="w-full h-11 text-red-400 border-red-500/20 hover:bg-red-500/10 rounded-xl text-sm">
                    <LogOut className="w-4 h-4 mr-2" /> {t("Logout", "تسجيل خروج", "Logout")}
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white h-11 text-sm flex items-center gap-2 justify-center rounded-xl font-semibold">
                    <GraduationCap className="w-4 h-4" /> {t("Sign In to Portal", "دخول المنصة", "Sign In")}
                  </Button>
                </Link>
              )}
              <Link href="/contact">
                <Button className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 h-11 text-sm rounded-xl">
                  {t("Contact Us", "تواصل معنا", "Contact Us")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
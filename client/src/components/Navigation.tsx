import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";
import { Menu, X, ChevronRight, GraduationCap, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { lang, isRTL, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => { setStudentId(localStorage.getItem("studentId")); setStudentName(localStorage.getItem("studentName")); }, [location]);
  useEffect(() => { setIsMenuOpen(false); }, [location]);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);


  const isActive = (p: string) => location === p;
  const handleLogout = () => { localStorage.removeItem("studentToken"); localStorage.removeItem("studentId"); localStorage.removeItem("studentName"); setStudentId(null); setStudentName(null); navigate("/"); };

  const primaryLinks = [
    { label: t("Home", "الرئيسية", "Home"), path: "/" },
    { label: t("About", "من نحن", "About"), path: "/about" },
    { label: t("Solutions", "الحلول", "Solutions"), path: "/solutions" },
    { label: t("Academy", "الأكاديمية", "Academy"), path: "/academy" },
    { label: t("Careers", "الوظائف", "Careers"), path: "/careers" },
  ];

  const lnk = (p: string) => `px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${isActive(p) ? isLight ? "text-cyan-600 bg-cyan-500/10" : "text-cyan-400 bg-cyan-400/10" : isLight ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"}`;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? isLight ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm" : "bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20" : isLight ? "bg-white/70 backdrop-blur-md border-b border-slate-200/50" : "bg-[#0a0e1a]/70 backdrop-blur-md border-b border-white/[0.04]"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img src="/uploads/logo.png" alt={APP_TITLE} className={`h-9 w-auto object-contain transition-transform group-hover:scale-105 ${isLight ? "" : "brightness-125"}`} onError={(e) => { e.currentTarget.src = "/uploads/logo_new.png"; }} />
          <span className={`font-bold text-lg tracking-tight hidden sm:inline ${isLight ? "text-slate-900" : "bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-cyan-400"}`}>{APP_TITLE}</span>
        </Link>

        {/* DESKTOP CENTER — B2B Core */}
        <div className="hidden lg:flex items-center gap-1">
          {primaryLinks.map(i => (<Link key={i.path} href={i.path}><span className={lnk(i.path)}>{i.label}</span></Link>))}
          <Link href="/contact"><span className={lnk("/contact")}>{t("Contact", "تواصل", "Contact")}</span></Link>
        </div>

        {/* DESKTOP RIGHT — Auth + CTA */}
        <div className="hidden lg:flex items-center gap-2 ms-3 ps-3 border-s border-slate-200 dark:border-white/10">
          <button onClick={toggleTheme} className={`p-1.5 rounded-full transition-all ${isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-white/[0.1] text-slate-400"}`} aria-label="Toggle theme">
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {studentId ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard"><button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 text-xs font-medium border border-cyan-500/20"><div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center text-[10px] font-bold">{(studentName || "S").charAt(0).toUpperCase()}</div><span className="max-w-[80px] truncate">{studentName}</span></button></Link>
              <button onClick={handleLogout} className="p-1.5 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-400"><LogOut className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" className={`rounded-full px-4 h-8 text-xs font-semibold flex items-center gap-1.5 ${isLight ? "border-slate-300 text-slate-700 hover:bg-slate-50" : "border-white/[0.15] text-white hover:bg-white/[0.08]"}`}>
                <GraduationCap className="w-3.5 h-3.5" /> {t("Student Sign In", "دخول الطالب", "Sign In")}
              </Button>
            </Link>
          )}

          <Link href="/consultation">
            <Button className="rounded-full px-5 h-8 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 transition-all">
              {t("Request Consultation", "طلب استشارة", "Consult")}
            </Button>
          </Link>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden flex items-center gap-2">
          <button onClick={toggleTheme} className={`p-1.5 rounded-full ${isLight ? "text-slate-500" : "text-slate-400"}`}>{isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-lg ${isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-white/[0.08]"}`}>{isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className={`lg:hidden absolute top-16 left-0 w-full border-b shadow-2xl ${isLight ? "bg-white/98 border-slate-200" : "bg-[#0d1225]/98 backdrop-blur-xl border-white/[0.06]"}`}>
          <div className="flex flex-col p-4 space-y-1">
            {primaryLinks.map(i => (<Link key={i.path} href={i.path}><div className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${isActive(i.path) ? isLight ? "bg-cyan-50 text-cyan-600" : "bg-cyan-500/10 text-cyan-400" : isLight ? "text-slate-600 hover:bg-slate-50" : "text-slate-400 hover:bg-white/[0.04]"}`}>{i.label}{isActive(i.path) && <ChevronRight className="w-4 h-4" />}</div></Link>))}
            <Link href="/contact"><div className={`flex items-center justify-between px-4 py-3 mt-1 rounded-xl text-sm font-medium ${isActive("/contact") ? isLight ? "bg-cyan-50 text-cyan-600" : "bg-cyan-500/10 text-cyan-400" : isLight ? "text-slate-600 hover:bg-slate-50" : "text-slate-400 hover:bg-white/[0.04]"}`}>{t("Contact", "تواصل", "Contact")}{isActive("/contact") && <ChevronRight className="w-4 h-4" />}</div></Link>
            <div className={`pt-3 mt-2 border-t flex flex-col gap-2 ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
              <Link href="/consultation"><Button className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">{t("Request Consultation", "طلب استشارة", "Consult")}</Button></Link>
              {studentId ? (
                <><Link href="/dashboard"><Button className="w-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 h-11 text-sm rounded-xl" variant="ghost"><LayoutDashboard className="w-4 h-4 me-2" /> {t("Dashboard", "لوحة التحكم", "Dashboard")}</Button></Link>
                <Button onClick={handleLogout} variant="outline" className="w-full h-11 text-red-400 border-red-500/20 hover:bg-red-500/10 rounded-xl text-sm"><LogOut className="w-4 h-4 me-2" /> {t("Logout", "خروج", "Logout")}</Button></>
              ) : (
                <Link href="/login"><Button variant="outline" className={`w-full h-11 text-sm rounded-xl font-semibold ${isLight ? "border-slate-300 text-slate-700" : "border-white/[0.15] text-white"}`}><GraduationCap className="w-4 h-4 me-2" /> {t("Student Sign In", "دخول الطالب", "Sign In")}</Button></Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
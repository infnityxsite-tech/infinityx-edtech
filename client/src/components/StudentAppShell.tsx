import { Link, useLocation } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

type StudentAppShellProps = { children: React.ReactNode; studentName?: string; onSignOut: () => void };

export default function StudentAppShell({ children, studentName, onSignOut }: StudentAppShellProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const items = [
    { href: "/dashboard", label: t("Dashboard", "لوحة التعلم", "Dashboard"), icon: LayoutDashboard },
    { href: "/programs", label: t("Discover programs", "استكشف البرامج", "Discover programs"), icon: GraduationCap },
    { href: "/courses", label: t("Short courses", "الدورات القصيرة", "Short courses"), icon: BookOpen },
  ];
  const navItem = (item: typeof items[number]) => { const active = location === item.href || (item.href === "/courses" && location.startsWith("/courses/")); const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition-colors ${active ? "bg-[#e3efff] text-[#0d55bd] dark:bg-[#17375e] dark:text-[#a3c8ff]" : "text-[#52606b] hover:bg-[#edf1f3] hover:text-[#10202d] dark:text-[#b7c6cf] dark:hover:bg-white/10 dark:hover:text-white"}`}><Icon className="h-4 w-4" />{item.label}</Link>; };
  return <div className={`ix-app-shell ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${isLight ? "border-[#d9e0e4] bg-[#f6f7f4]/94" : "border-white/10 bg-[#07111b]/94"}`}><div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8"><Link href="/dashboard" className="flex min-w-0 items-center gap-2.5"><img src={APP_LOGO} alt="Infinity X" className="h-9 w-auto max-w-[36px] shrink-0 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /><div className="min-w-0"><span className="block truncate text-sm font-bold tracking-[-.02em]">Infinity X Academy</span><span className="hidden text-[10px] font-bold uppercase tracking-[.15em] text-[#71808b] sm:block">{t("Learning space", "مساحة التعلم", "Learning space")}</span></div></Link><div className="hidden items-center gap-5 md:flex"><p className="text-sm" style={{ color: "var(--ix-text-secondary)" }}>{studentName || t("Student", "طالب", "Student")}</p><button type="button" onClick={onSignOut} className="inline-flex items-center gap-2 text-sm font-bold text-[#52606b] transition-colors hover:text-red-600 dark:text-[#b7c6cf] dark:hover:text-red-300"><LogOut className="h-4 w-4" />{t("Sign out", "تسجيل الخروج", "Sign out")}</button></div><button type="button" className="rounded-full p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div></header>
    <div className="mx-auto grid max-w-[1440px] md:grid-cols-[240px_1fr]"><aside className={`hidden min-h-[calc(100vh-72px)] border-e px-4 py-8 md:block ${isLight ? "border-[#d9e0e4]" : "border-white/10"}`}><p className="px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#1268e5]">{t("Your learning space", "مساحة تعلمك", "Your learning space")}</p><nav className="mt-4 grid gap-1" aria-label={t("Student navigation", "تنقل الطالب", "Student navigation")}>{items.map(navItem)}</nav><div className="mt-8 border-t px-3 pt-6" style={{ borderColor: "var(--ix-border)" }}><p className="text-xs leading-6" style={{ color: "var(--ix-text-secondary)" }}>{t("Keep your current course, projects, and records in one place.", "احتفظ بدورتك الحالية ومشاريعك وسجلاتك في مكان واحد.", "Keep your current course, projects, and records in one place.")}</p></div></aside>{open && <div className={`fixed inset-x-0 top-[72px] z-40 border-b p-5 md:hidden ${isLight ? "border-[#d9e0e4] bg-[#f6f7f4]" : "border-white/10 bg-[#07111b]"}`}><nav className="grid gap-1">{items.map(navItem)}<button type="button" onClick={onSignOut} className="mt-3 flex items-center gap-3 border-t px-3 pt-4 text-sm font-bold text-red-600 dark:text-red-300" style={{ borderColor: "var(--ix-border)" }}><LogOut className="h-4 w-4" />{t("Sign out", "تسجيل الخروج", "Sign out")}</button></nav></div>}<main className="min-w-0">{children}</main></div>
  </div>;
}

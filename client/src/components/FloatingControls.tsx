import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { Globe } from "lucide-react";

/**
 * Floating language toggle — repositions itself on the Learning Portal
 * to avoid overlapping with the header and video player.
 */
export default function FloatingControls() {
  const { lang, toggleLang } = useLanguage();
  const { theme } = useTheme();
  const [location] = useLocation();
  const isLight = theme === "light";
  const isLearningPage = location.startsWith("/learn/");

  return (
    <div className={`fixed z-[55] animate-fade-in group ${
      isLearningPage
        ? "bottom-5 left-5 z-[25]"
        : "top-24 right-5"
    }`}>
      <button
        onClick={toggleLang}
        className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-xl border ${
          isLight
            ? "bg-white/80 border-slate-200 shadow-cyan-500/10 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200 hover:shadow-cyan-500/20"
            : "bg-[#0d1225]/80 border-white/10 shadow-black/50 text-slate-300 hover:bg-[#121935] hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-cyan-500/20"
        }`}
        title={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
        aria-label="Toggle language"
      >
        <Globe className={`w-4 h-4 transition-transform duration-500 group-hover:rotate-180 ${isLight ? 'text-cyan-500' : 'text-cyan-400'}`} />
        <span className="text-xs font-bold uppercase tracking-wider">
          {lang === "en" ? "العربية" : "ENG"}
        </span>
      </button>
    </div>
  );
}

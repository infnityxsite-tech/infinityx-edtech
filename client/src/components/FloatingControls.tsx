import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Floating language toggle — always visible, top-right below navbar.
 * Only contains the language (EN/AR) toggle. Theme toggle is in the nav.
 */
export default function FloatingControls() {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="fixed top-20 right-4 z-[55]">
      {/* Language Toggle */}
      <button
        onClick={toggleLang}
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-xl border
          bg-[#0d1225]/90 border-white/10 text-cyan-400 hover:bg-[#0d1225] hover:border-cyan-400/30 hover:shadow-cyan-500/20"
        title={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
        aria-label="Toggle language"
      >
        <span className="text-xs font-bold leading-none">
          {lang === "en" ? "ع" : "EN"}
        </span>
      </button>
    </div>
  );
}

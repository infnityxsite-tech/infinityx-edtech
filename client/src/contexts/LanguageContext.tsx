import React, { createContext, useContext, useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isRTL: boolean;
  t: (en: string | undefined, ar: string | undefined, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  isRTL: false,
  t: (en, _ar, fallback) => en || fallback,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: defaults } = trpc.admin.getSiteDefaults.useQuery(undefined, { staleTime: 1000 * 60 * 30 });
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem("infx-lang");
    return (stored as Language) || "en";
  });

  // Apply server default if user hasn't set a preference
  useEffect(() => {
    if (defaults?.defaultLanguage && !localStorage.getItem("infx-lang")) {
      setLang(defaults.defaultLanguage as Language);
    }
  }, [defaults]);

  const isRTL = lang === "ar";

  useEffect(() => {
    localStorage.setItem("infx-lang", lang);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const toggleLang = () => setLang(prev => (prev === "en" ? "ar" : "en"));

  const t = (en: string | undefined, ar: string | undefined, fallback: string): string => {
    return lang === "ar" ? (ar || fallback) : (en || fallback);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

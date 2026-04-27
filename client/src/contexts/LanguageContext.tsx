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
  const { data: defaults } = trpc.admin.getSiteDefaults.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  const [lang, setLangState] = useState<Language>(() => {
    // Only trust localStorage if the user manually chose a language
    if (localStorage.getItem("infx-lang-manual") === "true") {
      return (localStorage.getItem("infx-lang") as Language) || "en";
    }
    return "en";
  });

  // Apply server default if user hasn't manually chosen a preference
  useEffect(() => {
    if (defaults?.defaultLanguage && localStorage.getItem("infx-lang-manual") !== "true") {
      setLangState(defaults.defaultLanguage as Language);
    }
  }, [defaults]);

  const isRTL = lang === "ar";

  useEffect(() => {
    localStorage.setItem("infx-lang", lang);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  // Wrap setLang to mark as manual choice
  const setLang = (newLang: Language) => {
    localStorage.setItem("infx-lang-manual", "true");
    setLangState(newLang);
  };

  const toggleLang = () => {
    localStorage.setItem("infx-lang-manual", "true");
    setLangState(prev => (prev === "en" ? "ar" : "en"));
  };

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

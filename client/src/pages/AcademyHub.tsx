import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyStats from "@/components/academy/AcademyStats";
import AcademyMethodology from "@/components/academy/AcademyMethodology";
import SchoolGrid from "@/components/academy/SchoolGrid";
import LegacyIntegration from "@/components/academy/LegacyIntegration";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AcademyHub() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen font-sans ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#020617] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />
      <AcademyHero />
      <AcademyStats />
      <AcademyMethodology />
      <SchoolGrid />
      <LegacyIntegration />
      <Footer />
    </div>
  );
}

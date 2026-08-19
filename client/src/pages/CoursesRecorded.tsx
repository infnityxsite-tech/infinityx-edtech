import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CourseCatalog from "@/components/academy/CourseCatalog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

export default function CoursesRecorded() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  useSEO({ title: "Recorded Courses | Infinity X Academy", description: "Explore self-paced recorded technology courses from Infinity X Academy.", canonical: "https://infx.space/courses/recorded", robots: "index, follow" });
  return <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"} ${theme === "light" ? "bg-[#f8f8f5] text-[#102033]" : "bg-[#06101f] text-white"}`} dir={isRTL ? "rtl" : "ltr"}><Navigation /><CourseCatalog mode="recorded" /><Footer /></div>;
}

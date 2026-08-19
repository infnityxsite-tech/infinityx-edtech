import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CourseCatalog from "@/components/academy/CourseCatalog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

export default function CoursesRecorded() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  useSEO({
    title: "Recorded Courses | Infinity X Academy",
    description: "Learn practical engineering skills on your own schedule with Infinity X Academy recorded courses.",
    canonical: "https://infx.space/courses/recorded",
    robots: "index, follow",
  });

  return (
    <div
      className={`ix-page ${isRTL ? "rtl" : "ltr"} ${theme === "light" ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />
      <CourseCatalog mode="recorded" />
      <Footer />
    </div>
  );
}

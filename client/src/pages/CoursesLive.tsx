import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CourseCatalog from "@/components/academy/CourseCatalog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

export default function CoursesLive() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  useSEO({
    title: "Live Courses | Infinity X Academy",
    description: "Explore instructor-led live technology courses from Infinity X Academy.",
    canonical: "https://infx.space/courses/live",
    robots: "index, follow",
  });

  return (
    <div
      className={`ix-page ${isRTL ? "rtl" : "ltr"} ${theme === "light" ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />
      <CourseCatalog mode="live" />
      <Footer />
    </div>
  );
}

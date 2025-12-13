import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Search,
  Rocket,
  Globe,
  CheckCircle,
  Cpu,
  Code,
  Shield,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";

export default function Programs() {
  const { data: programs = [], isLoading } = trpc.admin.getPrograms.useQuery();
  const [query, setQuery] = useState("");
  const [location, navigate] = useLocation();
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const t = (en: string | undefined, ar: string | undefined, fallback: string) => {
    return lang === 'ar' ? (ar || fallback) : (en || fallback);
  };
  const isRTL = lang === 'ar';

  // Filter programs based on search
  const filteredPrograms = programs.filter((program: any) =>
    program.title.toLowerCase().includes(query.toLowerCase()) || 
    (program.title_ar && program.title_ar.includes(query))
  );

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* === LANGUAGE TOGGLE === */}
      <div className={`fixed top-24 ${isRTL ? 'left-6' : 'right-6'} z-50`}>
        <Button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="shadow-xl bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-full px-4 py-2 flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          {lang === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      {/* === HERO SECTION === */}
      <section className="relative bg-slate-900 text-white py-24 text-center overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="inline-block bg-white/10 border border-white/20 px-4 py-1 rounded-full text-sm font-medium mb-6">
            {t("ACADEMIC PROGRAMS", "البرامج الأكاديمية", "ACADEMIC PROGRAMS")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("Specialized Schools & Diplomas", "الكليات والدبلومات المتخصصة", "Specialized Schools & Diplomas")}
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t(
                "Advance your career with expert-led, industry-focused programs in Space Tech, AI, and Software Engineering.",
                "طور مسارك المهني ببرامج متخصصة يقودها خبراء في تكنولوجيا الفضاء، الذكاء الاصطناعي، وهندسة البرمجيات.",
                "Advance your career with expert-led programs."
            )}
          </p>
        </div>
      </section>

      {/* === SEARCH & FILTER === */}
      <section className="py-10 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-2/3">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 text-slate-400 w-4 h-4`} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search programs...", "بحث عن برنامج...", "Search programs...")}
              className={`${isRTL ? 'pr-10' : 'pl-10'} bg-slate-50 border-slate-200`}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             {/* Categories - Visual Only for now */}
             <Button variant="outline" size="sm" className="whitespace-nowrap rounded-full hover:bg-blue-50 hover:text-blue-600 border-slate-200">
                {t("Space Tech", "تكنولوجيا الفضاء", "Space Tech")}
             </Button>
             <Button variant="outline" size="sm" className="whitespace-nowrap rounded-full hover:bg-green-50 hover:text-green-600 border-slate-200">
                {t("AI & Data", "الذكاء الاصطناعي", "AI & Data")}
             </Button>
             <Button variant="outline" size="sm" className="whitespace-nowrap rounded-full hover:bg-purple-50 hover:text-purple-600 border-slate-200">
                {t("Software", "البرمجيات", "Software")}
             </Button>
          </div>
        </div>
      </section>

      {/* === PROGRAMS GRID === */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-lg">
                {t("No programs found matching your search.", "لم يتم العثور على برامج تطابق بحثك.", "No programs found.")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program: any) => (
                <Card
                  key={program.id}
                  className="group hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col bg-white"
                >
                  <div className="relative h-56 overflow-hidden">
                    {program.imageUrl ? (
                        <img
                        src={program.imageUrl}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-blue-900 flex items-center justify-center">
                            <Rocket className="w-12 h-12 text-white/20" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {program.duration || "Flexible"}
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 leading-tight">
                      {t(program.title, program.title_ar, program.title)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {t(program.description, program.description_ar, program.description || "No description available.")}
                    </p>

                    {program.skills && (
                      <div className="flex flex-wrap gap-2">
                          {program.skills.split(",").slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                          {program.skills.split(",").length > 3 && (
                              <span className="text-slate-400 text-xs py-1">+More</span>
                          )}
                      </div>
                    )}

                    <Button
                      onClick={() =>
                        navigate(
                          `/apply/${program.id}?courseName=${encodeURIComponent(program.title)}`
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:translate-y-1 transition-transform"
                    >
                      {t("Apply Now", "سجل الآن", "Apply Now")} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <p className="text-xl font-bold mb-1">InfinityX EdTech</p>
            <p className="text-slate-400 text-sm">Empowering the Future.</p>
          </div>
          <div className="text-slate-400 text-sm">
             <p>infnityx.site@gmail.com</p>
             <p>+20 109 036 4947</p>
          </div>
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} InfinityX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
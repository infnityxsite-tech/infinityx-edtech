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
  CheckCircle,
  Cpu,
  Code,
  Shield,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Programs() {
  const { data: programs = [], isLoading } = trpc.admin.getPrograms.useQuery();
  const [query, setQuery] = useState("");
  const [location, navigate] = useLocation();
  const { lang, isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Filter programs based on search
  const filteredPrograms = programs.filter((program: any) =>
    program.title.toLowerCase().includes(query.toLowerCase()) || 
    (program.title_ar && program.title_ar.includes(query))
  );

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'} ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* === HERO SECTION === */}
      <section className="relative pt-36 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className={`absolute top-0 left-0 w-full h-full overflow-hidden ${isLight ? 'opacity-5' : 'opacity-20'}`}>
            <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className={`inline-block border px-4 py-1 rounded-full text-sm font-medium mb-6 ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/10 border-white/20 text-white'}`}>
            {t("ACADEMIC PROGRAMS", "البرامج الأكاديمية", "ACADEMIC PROGRAMS")}
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("Specialized Schools & Diplomas", "الكليات والدبلومات المتخصصة", "Specialized Schools & Diplomas")}
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {t(
                "Advance your career with expert-led, industry-focused programs in Space Tech, AI, and Software Engineering.",
                "طور مسارك المهني ببرامج متخصصة يقودها خبراء في تكنولوجيا الفضاء، الذكاء الاصطناعي، وهندسة البرمجيات.",
                "Advance your career with expert-led programs."
            )}
          </p>
        </div>
      </section>

      {/* === SEARCH & FILTER === */}
      <section className={`py-10 backdrop-blur-xl border-b sticky top-0 z-40 ${isLight ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-[#0d1225]/80 border-white/[0.04]'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-2/3">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 text-slate-500 w-4 h-4`} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search programs...", "بحث عن برنامج...", "Search programs...")}
              className={`${isRTL ? 'pr-10' : 'pl-10'} ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <Button variant="outline" size="sm" className={`whitespace-nowrap rounded-full ${isLight ? 'hover:bg-blue-50 border-slate-200 text-slate-600 hover:text-blue-600' : 'hover:bg-blue-500/10 hover:text-blue-400 border-white/[0.08] text-slate-400'}`}>
                {t("Space Tech", "تكنولوجيا الفضاء", "Space Tech")}
             </Button>
             <Button variant="outline" size="sm" className={`whitespace-nowrap rounded-full ${isLight ? 'hover:bg-green-50 border-slate-200 text-slate-600 hover:text-green-600' : 'hover:bg-green-500/10 hover:text-green-400 border-white/[0.08] text-slate-400'}`}>
                {t("AI & Data", "الذكاء الاصطناعي", "AI & Data")}
             </Button>
             <Button variant="outline" size="sm" className={`whitespace-nowrap rounded-full ${isLight ? 'hover:bg-purple-50 border-slate-200 text-slate-600 hover:text-purple-600' : 'hover:bg-purple-500/10 hover:text-purple-400 border-white/[0.08] text-slate-400'}`}>
                {t("Software", "البرمجيات", "Software")}
             </Button>
          </div>
        </div>
      </section>

      {/* === PROGRAMS GRID === */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-20 bg-[#0d1225]/80 rounded-2xl border border-dashed border-white/[0.06]">
              <p className="text-slate-400 text-lg">
                {t("No programs found matching your search.", "لم يتم العثور على برامج تطابق بحثك.", "No programs found.")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program: any) => (
                <Card
                  key={program.id}
                  className={`group hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col p-0 gap-0 border ${isLight ? 'bg-white border-slate-200/60 hover:border-cyan-300' : 'bg-[#0d1225]/80 backdrop-blur-xl border-white/[0.06] hover:border-cyan-500/30'}`}
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
                    <div className="absolute top-4 right-4 bg-white/[0.1] backdrop-blur border border-white/[0.1] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {program.duration || "Flexible"}
                    </div>
                  </div>

                  <CardHeader className="p-5 pb-2">
                    <CardTitle className={`text-lg font-bold leading-tight border-l-2 border-cyan-500/60 pl-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {t(program.title, program.title_ar, program.title)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between space-y-4 px-5 pb-5">
                    <p className={`text-sm leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {t(program.description, program.description_ar, program.description || "No description available.")}
                    </p>

                    {program.skills && (
                      <div className="flex flex-wrap gap-2">
                          {program.skills.split(",").slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className={`border px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/[0.04] border-white/[0.06] text-slate-400'}`}
                            >
                              {skill.trim()}
                            </span>
                          ))}
                          {program.skills.split(",").length > 3 && (
                              <span className={`text-xs py-1 ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>+More</span>
                          )}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/program/${program.id}`)}
                        className={`flex-1 rounded-xl shadow-sm border ${isLight ? 'border-cyan-500/30 text-cyan-700 hover:bg-cyan-50' : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30'}`}
                      >
                        {t("View Details", "التفاصيل", "View Details")}
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(`/apply?programId=${program.id}&programName=${encodeURIComponent(program.title)}`)
                        }
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-500/20"
                      >
                        {t("Apply", "سجل", "Apply")} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
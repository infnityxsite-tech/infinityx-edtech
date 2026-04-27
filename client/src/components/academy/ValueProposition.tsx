import { motion } from "framer-motion";
import { CheckCircle2, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export interface ValuePropData {
  learningOutcomes: { en: string; ar: string }[];
  tools: string[];
}

interface ValuePropositionProps {
  data: ValuePropData;
  gradient: string;
}

export default function ValueProposition({ data, gradient }: ValuePropositionProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* What you will learn */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`rounded-3xl border p-8 ${isLight ? "bg-white border-slate-200 shadow-lg" : "bg-white/[0.02] border-white/[0.06]"}`}
          >
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 text-xs font-bold uppercase tracking-wider ${isLight ? "bg-indigo-50 text-indigo-700" : "bg-indigo-500/20 text-indigo-300"}`}>
              {t("What You Will Learn", "ماذا ستتعلم", "Learning Outcomes")}
            </div>
            <h3 className={`text-2xl font-black mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
              {t("Core Competencies", "الكفاءات الأساسية", "Core Skills")}
            </h3>
            <div className="space-y-4">
              {data.learningOutcomes.map((outcome, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-gradient-to-br ${gradient}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className={`text-sm font-medium leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    {t(outcome.en, outcome.ar, outcome.en)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tools & Technologies */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`rounded-3xl border p-8 ${isLight ? "bg-white border-slate-200 shadow-lg" : "bg-white/[0.02] border-white/[0.06]"}`}
          >
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 text-xs font-bold uppercase tracking-wider ${isLight ? "bg-cyan-50 text-cyan-700" : "bg-cyan-500/20 text-cyan-300"}`}>
              {t("Tools & Technologies", "الأدوات والتقنيات", "Tech Stack")}
            </div>
            <h3 className={`text-2xl font-black mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
              {t("Industry-Standard Stack", "أدوات بمعايير الصناعة", "Tech Stack")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.tools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all hover:scale-[1.02] ${isLight ? "bg-slate-50 border-slate-200 hover:bg-slate-100" : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"}`}
                >
                  <Cpu className={`w-4 h-4 shrink-0 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
                  <span className={`text-xs font-semibold truncate ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    {tool}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

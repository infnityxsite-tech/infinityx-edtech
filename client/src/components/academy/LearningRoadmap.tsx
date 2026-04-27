import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export interface RoadmapStep {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  skills: string[];
}

interface LearningRoadmapProps {
  steps: RoadmapStep[];
  gradient: string;
}

export default function LearningRoadmap({ steps, gradient }: LearningRoadmapProps) {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className={`py-24 border-y ${isLight ? "border-slate-200 bg-slate-50/50" : "border-white/[0.04] bg-[#030712]"}`}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("Learning Roadmap", "خريطة المسار التعليمي", "Roadmap")}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            {t(
              "Your structured journey from fundamentals to mastery. Each phase builds upon the last.",
              "رحلتك المنظمة من الأساسيات إلى الإتقان — كل مرحلة تُبنى على ما سبقها.",
              "Structured journey to mastery."
            )}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute ${isRTL ? "right-6 md:right-8" : "left-6 md:left-8"} top-0 bottom-0 w-px ${isLight ? "bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" : "bg-gradient-to-b from-slate-600 via-slate-700 to-transparent"}`} />

          <div className="space-y-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className={`relative ${isRTL ? "pr-20 md:pr-24" : "pl-20 md:pl-24"}`}
              >
                {/* Timeline node */}
                <div
                  className={`absolute ${isRTL ? "right-3 md:right-5" : "left-3 md:left-5"} top-6 w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg z-10`}
                >
                  <span className="text-[10px] font-black text-white">{String(idx + 1).padStart(2, "0")}</span>
                </div>

                {/* Step label */}
                <div className={`absolute ${isRTL ? "right-0 md:right-0" : "left-0 md:left-0"} top-7 text-[10px] font-bold uppercase tracking-widest ${isLight ? "text-slate-400" : "text-slate-600"}`}>
                  {/* Phase number on far left */}
                </div>

                {/* Card */}
                <div className={`rounded-2xl border p-6 transition-all duration-300 ${isLight ? "bg-white border-slate-200 shadow-sm hover:shadow-lg" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"}`}>
                  <h3 className={`text-lg font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                    {t(step.title, step.titleAr, step.title)}
                  </h3>
                  <p className={`text-sm leading-relaxed font-medium mb-4 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {t(step.description, step.descriptionAr, step.description)}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {step.skills.map((skill, j) => (
                      <div
                        key={j}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${isLight ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Completion node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative ${isRTL ? "pr-20 md:pr-24" : "pl-20 md:pl-24"} mt-8`}
          >
            <div className={`absolute ${isRTL ? "right-3 md:right-5" : "left-3 md:left-5"} top-4 w-7 h-7 rounded-full flex items-center justify-center z-10 ${isLight ? "bg-emerald-500" : "bg-emerald-400"}`}>
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div className={`rounded-2xl border-2 border-dashed p-6 text-center ${isLight ? "border-emerald-300 bg-emerald-50/50" : "border-emerald-500/30 bg-emerald-500/5"}`}>
              <h3 className={`text-lg font-bold mb-1 ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                {t("🎓 Graduation & Portfolio", "🎓 التخرج ومعرض الأعمال", "Graduation")}
              </h3>
              <p className={`text-sm font-medium ${isLight ? "text-emerald-600" : "text-emerald-400/70"}`}>
                {t(
                  "Complete your capstone project, build your portfolio, and earn your Infinity X certificate.",
                  "أكمل مشروع تخرجك، ابنِ معرض أعمالك، واحصل على شهادة إنفينيتي إكس.",
                  "Complete capstone & earn certificate."
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

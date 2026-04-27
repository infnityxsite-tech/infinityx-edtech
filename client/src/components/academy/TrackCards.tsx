import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export interface Track {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  level: string;
  levelAr: string;
  duration: string;
  tools: string[];
  gradient: string;
}

interface TrackCardsProps {
  tracks: Track[];
}

export default function TrackCards({ tracks }: TrackCardsProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("Available Tracks", "المسارات المتاحة", "Tracks")}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            {t(
              "Structured learning paths from beginner to advanced. Each track is project-driven and industry-aligned.",
              "مسارات تعليمية منظمة من المبتدئ إلى المتقدم — كل مسار قائم على المشاريع ومتوافق مع متطلبات السوق.",
              "Structured learning paths."
            )}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tracks.map((track, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className={`group rounded-3xl border overflow-hidden transition-all duration-300 ${isLight ? "bg-white border-slate-200 shadow-sm hover:shadow-xl" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"}`}
            >
              {/* Gradient header bar */}
              <div className={`h-2 bg-gradient-to-r ${track.gradient}`} />

              <div className="p-6">
                {/* Level badge */}
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4 ${isLight ? "bg-slate-100 text-slate-600" : "bg-white/[0.06] text-slate-300"}`}>
                  {t(track.level, track.levelAr, track.level)}
                </div>

                {/* Title */}
                <h3 className={`text-lg font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                  {t(track.title, track.titleAr, track.title)}
                </h3>

                {/* Description */}
                <p className={`text-sm leading-relaxed font-medium mb-4 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  {t(track.description, track.descriptionAr, track.description)}
                </p>

                {/* Duration */}
                <div className={`text-xs font-semibold mb-4 ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>
                  ⏱ {track.duration}
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-1.5">
                  {track.tools.map((tool, j) => (
                    <span
                      key={j}
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${isLight ? "bg-slate-100 text-slate-600 border border-slate-200" : "bg-white/[0.04] text-slate-400 border border-white/[0.06]"}`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

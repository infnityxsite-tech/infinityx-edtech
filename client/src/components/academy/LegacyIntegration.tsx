import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, PenLine, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

export default function LegacyIntegration() {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const gateways = [
    {
      icon: BookOpen,
      title: t("Explore Courses", "استكشف الدورات", "Courses"),
      description: t(
        "Browse our full catalog of live and recorded courses. Filter by topic, level, and format to find your perfect fit.",
        "تصفّح كامل مكتبة دوراتنا الحية والمسجلة — فلتر بحسب الموضوع والمستوى والشكل لتجد ما يناسبك.",
        "Browse course catalog."
      ),
      href: "/courses",
      gradient: "from-cyan-500 to-blue-600",
      glow: isLight ? "bg-cyan-50" : "bg-cyan-500/10",
      iconColor: isLight ? "text-cyan-600" : "text-cyan-400",
    },
    {
      icon: PenLine,
      title: t("Read the Blog", "اقرأ المدونة", "Blog"),
      description: t(
        "Technical articles, industry insights, tutorials, and behind-the-scenes engineering deep dives from our team.",
        "مقالات تقنية ورؤى صناعية ودروس تعليمية ونظرة عميقة خلف الكواليس الهندسية من فريقنا.",
        "Technical articles & tutorials."
      ),
      href: "/blog",
      gradient: "from-purple-500 to-indigo-600",
      glow: isLight ? "bg-purple-50" : "bg-purple-500/10",
      iconColor: isLight ? "text-purple-600" : "text-purple-400",
    },
    {
      icon: ShieldCheck,
      title: t("Verify Certificate", "التحقق من الشهادة", "Verify"),
      description: t(
        "Validate the authenticity of any Infinity X Academy certificate. Enter the certificate ID to verify instantly.",
        "تحقق من صحة أي شهادة صادرة عن أكاديمية إنفينيتي إكس — أدخل رقم الشهادة للتحقق الفوري.",
        "Validate certificates."
      ),
      href: "/verify",
      gradient: "from-emerald-500 to-teal-600",
      glow: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
      iconColor: isLight ? "text-emerald-600" : "text-emerald-400",
    },
  ];

  return (
    <section className={`py-24 border-t ${isLight ? "border-slate-200 bg-slate-50/50" : "border-white/[0.04] bg-[#030712]"}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("Quick Access", "وصول سريع", "Quick Access")}
          </h2>
          <p className={`text-base max-w-xl mx-auto font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            {t(
              "Jump directly to our course catalog, blog, or certificate verification.",
              "انتقل مباشرة إلى كتالوج الدورات أو المدونة أو التحقق من الشهادات.",
              "Direct access links."
            )}
          </p>
        </motion.div>

        {/* Gateway cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {gateways.map((gw, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Link href={gw.href}>
                <div className={`group rounded-3xl border p-8 h-full transition-all duration-300 cursor-pointer ${isLight ? "bg-white border-slate-200 shadow-sm hover:shadow-xl" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"}`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${gw.glow}`}>
                    <gw.icon className={`w-7 h-7 ${gw.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                    {gw.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed font-medium mb-6 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {gw.description}
                  </p>

                  {/* Link */}
                  <div className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${isLight ? "text-indigo-600 group-hover:text-indigo-700" : "text-indigo-400 group-hover:text-indigo-300"}`}>
                    {t("Go", "انتقل", "Go")}
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

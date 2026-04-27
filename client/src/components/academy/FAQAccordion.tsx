import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export interface FAQItem {
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("Frequently Asked Questions", "الأسئلة الشائعة", "FAQ")}
          </h2>
          <p className={`text-lg max-w-xl mx-auto font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            {t(
              "Everything you need to know about this program.",
              "كل ما تحتاج معرفته عن هذا البرنامج.",
              "Everything you need to know."
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-3xl border overflow-hidden ${isLight ? "bg-white border-slate-200 shadow-lg" : "bg-white/[0.02] border-white/[0.06]"}`}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className={`${isLight ? "border-slate-200" : "border-white/[0.06]"}`}
              >
                <AccordionTrigger
                  className={`px-6 py-5 text-left text-base font-semibold hover:no-underline ${isLight ? "text-slate-900 hover:bg-slate-50" : "text-white hover:bg-white/[0.02]"}`}
                >
                  {t(faq.question, faq.questionAr, faq.question)}
                </AccordionTrigger>
                <AccordionContent className={`px-6 pb-5 text-sm leading-relaxed font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  {t(faq.answer, faq.answerAr, faq.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

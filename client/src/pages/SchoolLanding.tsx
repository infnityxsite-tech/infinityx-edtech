import { useState } from "react";
import { useRoute } from "wouter"; // Get the category from URL
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Rocket, Brain, Code, Shield, CheckCircle, 
  ArrowRight, Globe, Database, Terminal, Satellite
} from "lucide-react";

// === DATA: THE CONTENT FOR EACH SCHOOL ===
const schoolData: any = {
  space: {
    title: "School of Space Technology",
    title_ar: "مدرسة تكنولوجيا الفضاء",
    description: "The region's premier program for Orbital Mechanics, Satellite Data Analysis, and Space Debris Mitigation.",
    heroImage: "/uploads/Gemini_Generated_Image_3p3go53p3go53p3g.png", // Use your specific space image
    color: "blue",
    icon: <Rocket className="w-16 h-16 text-blue-400" />,
    tracks: [
      "Orbital Mechanics & Astrodynamics",
      "Satellite Image Processing (CNNs)",
      "Space Debris Classification AI",
      "STK & Python for Space Applications"
    ]
  },
  ai: {
    title: "School of AI & Data Science",
    title_ar: "مدرسة الذكاء الاصطناعي وعلوم البيانات",
    description: "Master the algorithms shaping the future. From Computer Vision to Predictive Analytics and Large Language Models.",
    heroImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
    color: "green",
    icon: <Brain className="w-16 h-16 text-green-400" />,
    tracks: [
      "Deep Learning with TensorFlow",
      "Computer Vision & Object Detection",
      "Natural Language Processing (NLP)",
      "Generative AI & LLMs"
    ]
  },
  software: {
    title: "School of Software Engineering",
    title_ar: "مدرسة هندسة البرمجيات",
    description: "Build scalable, robust systems. Full-stack development with a focus on cloud architecture and microservices.",
    heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
    color: "purple",
    icon: <Code className="w-16 h-16 text-purple-400" />,
    tracks: [
      "Advanced React & Next.js",
      "Backend Microservices (Node/Go)",
      "Cloud Infrastructure (AWS/Docker)",
      "System Design & Architecture"
    ]
  },
  security: {
    title: "School of Cybersecurity",
    title_ar: "مدرسة الأمن السيبراني",
    description: "Defend against the threats of tomorrow. Ethical hacking, penetration testing, and SOC analysis.",
    heroImage: "https://images.unsplash.com/photo-1563206767-5b1d97289374?auto=format&fit=crop&q=80&w=1200",
    color: "red",
    icon: <Shield className="w-16 h-16 text-red-400" />,
    tracks: [
      "Ethical Hacking & Penetration Testing",
      "SOC Analysis & Incident Response",
      "Network Security Defense",
      "Cryptography Fundamentals"
    ]
  }
};

export default function SchoolLanding() {
  // 1. Get the "category" from the URL (e.g., "space", "ai")
  const [match, params] = useRoute("/programs/:category");
  const category = params?.category || "space";
  const data = schoolData[category] || schoolData.space; // Fallback to space if not found

  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRTL = lang === 'ar';
  
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);

  return (
    <div className={`min-h-screen bg-slate-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* LANGUAGE TOGGLE */}
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
      <section className="relative bg-slate-900 text-white py-32 overflow-hidden">
        {/* Dynamic Background Image */}
        <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.heroImage})` }}
        ></div>
        <div className={`absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900`}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-6 animate-pulse-slow">
                {data.icon}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {t(data.title, data.title_ar || data.title)}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {data.description}
            </p>
        </div>
      </section>

      {/* === CURRICULUM TRACKS === */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">
                    {t("Core Curriculum", "المنهج الدراسي الأساسي")}
                </h2>
                <p className="text-slate-500 mt-2">{t("What you will master in this school", "ما ستتقنه في هذه المدرسة")}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {data.tracks.map((track: string, idx: number) => (
                    <div key={idx} className="flex items-start p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                        <CheckCircle className={`w-6 h-6 mr-4 mt-1 text-${data.color}-500`} />
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">{track}</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {t("Comprehensive module with hands-on projects and labs.", "وحدة شاملة مع مشاريع عملية ومختبرات.")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">
                {t("Ready to Join?", "هل أنت مستعد للانضمام؟")}
            </h2>
            <p className="text-slate-400 mb-8">
                {t("Applications are open. Secure your spot in the next cohort.", "باب التقديم مفتوح. احجز مقعدك في الدفعة القادمة.")}
            </p>
            <Link href="/programs">
                <Button size="lg" className={`bg-${data.color}-600 hover:bg-${data.color}-700 text-white px-10 py-6 text-lg`}>
                    {t("View Available Batches", "عرض الدفعات المتاحة")} <ArrowRight className="ml-2" />
                </Button>
            </Link>
        </div>
      </section>
    </div>
  );
}
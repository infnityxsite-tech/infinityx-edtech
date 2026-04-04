import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Rocket 
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Apply() {
  const [location, navigate] = useLocation();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  // 1️⃣ جلب قائمة الكورسات من قاعدة البيانات (لعمل الـ Dropdown)
  const { data: courses = [], isLoading: isLoadingCourses } = trpc.admin.getCourses.useQuery();

  // 2️⃣ دالة لاستخراج رقم الكورس من الرابط (URL)
  const getUrlParameter = (name: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  const preSelectedId = getUrlParameter("courseId");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    courseId: "", // سيتم تحديده تلقائياً أو يدوياً
    message: "",
  });

  // 3️⃣ عند تحميل الصفحة: إذا كان هناك كورس في الرابط، قم باختياره فوراً
  useEffect(() => {
    if (preSelectedId) {
      setForm((prev) => ({ ...prev, courseId: preSelectedId }));
    }
  }, [preSelectedId]);

  // إعداد دالة الإرسال (Mutation)
  const createApplication = trpc.admin.createApplication.useMutation({
    onSuccess: () => {
      toast.success(t("Application submitted successfully! We will contact you soon.", "تم إرسال الطلب بنجاح! سنتواصل معك قريبًا.", "Application submitted successfully!"));
      // تفريغ النموذج
      setForm({ fullName: "", email: "", phone: "", courseId: "", message: "" });
      setLoading(false);
      
      // توجيه المستخدم للصفحة الرئيسية بعد ثانيتين
      setTimeout(() => navigate("/"), 2000);
    },
    onError: (error) => {
      toast.error(t("Failed to submit:", "فشل الإرسال:", "Failed to submit:") + ` ${error.message}`);
      setLoading(false);
    },
  });

  // معالجة الضغط على زر الإرسال
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!form.fullName || !form.email || !form.phone || !form.courseId) {
      toast.error(t("Please fill in all required fields (Name, Email, Phone, Course).", "يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، الهاتف، الدورة).", "Please fill in all required fields."));
      return;
    }

    setLoading(true);
    
    // إرسال البيانات للسيرفر
    createApplication.mutate({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      courseId: form.courseId,
      message: form.message,
    });
  };

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* 🏛️ HERO SECTION */}
      <section className={`relative pt-36 pb-24 overflow-hidden ${isLight ? '' : 'bg-[#0b1120] text-white'}`}>
        {/* تأثيرات الخلفية */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none ${isLight ? 'opacity-10' : ''}`} 
             style={{ 
               backgroundImage: `linear-gradient(${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px)`, 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-amber-500/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 ${isLight ? 'bg-amber-100 border border-amber-200 text-amber-700' : 'bg-amber-900/40 border border-amber-700/50 text-amber-300'}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("Start Your Journey", "ابدأ رحلتك", "Start Your Journey")}</span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("Join the Next Cohort of ", "انضم إلى الدفعة القادمة من ", "Join the Next Cohort of ")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{t("Innovators.", "المبتكرين.", "Innovators.")}</span>
          </h1>
          
          <p className={`text-lg max-w-2xl mx-auto mb-8 font-light ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {t("Fill out the form below to reserve your spot. Our admissions team will review your application and get back to you within 24 hours.", "املأ النموذج أدناه لحجز مكانك. سيقوم فريق القبول لدينا بمراجعة طلبك والرد عليك في غضون ٢٤ ساعة.", "Fill out the form below to reserve your spot.")}
          </p>
        </div>
      </section>

      {/* 📝 APPLICATION FORM */}
      <section className="max-w-3xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <Card className={`border shadow-xl backdrop-blur-xl ${isLight ? 'bg-white/80 border-slate-200' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
          <CardHeader className={`text-center border-b pb-8 ${isLight ? 'border-slate-100' : 'border-white/[0.04]'}`}>
             <div className="w-14 h-14 bg-indigo-500/15 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
               <Rocket className="w-7 h-7" />
            </div>
            <CardTitle className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Student Application", "طلب إضافة طالب", "Student Application")}</CardTitle>
            <CardDescription className={isLight ? 'text-slate-500' : 'text-slate-500'}>
               {t("Please ensure all information is correct to avoid delays.", "يرجى التأكد من صحة جميع المعلومات لتجنب أي تأخير.", "Please ensure all information is correct.")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* الاسم ورقم الهاتف */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className={isLight ? 'text-slate-700' : 'text-slate-400'}>{t("Full Name *", "الاسم الكامل *", "Full Name *")}</Label>
                  <Input
                    id="fullName"
                    placeholder={t("e.g. Ahmed Mohamed", "مثال: أحمد محمد", "e.g. Ahmed Mohamed")}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                    className={`h-11 focus:ring-cyan-500/30 focus:border-cyan-500/40 rounded-xl ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className={isLight ? 'text-slate-700' : 'text-slate-400'}>{t("Phone Number (WhatsApp) *", "رقم الهاتف (واتساب) *", "Phone Number (WhatsApp) *")}</Label>
                  <Input
                    id="phone"
                    placeholder={t("e.g. +20 1xxx xxx xxxx", "مثال: +20 1xxx xxx xxxx", "e.g. +20 1xxx xxx xxxx")}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className={`h-11 focus:ring-cyan-500/30 focus:border-cyan-500/40 rounded-xl ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                  />
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <Label htmlFor="email" className={isLight ? 'text-slate-700' : 'text-slate-400'}>{t("Email Address *", "البريد الإلكتروني *", "Email Address *")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className={`h-11 focus:ring-cyan-500/30 focus:border-cyan-500/40 rounded-xl ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                />
              </div>

              {/* 🎓 اختيار الكورس (Dropdown) */}
              <div className="space-y-2">
                <Label htmlFor="course" className={isLight ? 'text-slate-700' : 'text-slate-400'}>{t("Select Program / Course *", "اختر البرنامج / الدورة *", "Select Program / Course *")}</Label>
                
                {isLoadingCourses ? (
                  // شكل تحميل (Loading Skeleton)
                  <div className={`h-11 w-full animate-pulse rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.04] border-white/[0.08]'}`}></div>
                ) : (
                  <Select 
                    value={form.courseId} 
                    onValueChange={(val) => setForm({ ...form, courseId: val })}
                  >
                    <SelectTrigger className={`h-11 rounded-xl ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-white/[0.04] border-white/[0.08] text-white'}`}>
                      <SelectValue placeholder={t("-- Choose a Course --", "-- اختر دورة --", "-- Choose a Course --")} />
                    </SelectTrigger>
                    <SelectContent className={isLight ? 'bg-white' : ''}>
                      {courses.map((course: any) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} {course.priceEgp ? `(${Number(course.priceEgp).toLocaleString()} EGP)` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* رسالة تأكيد إذا تم الاختيار تلقائياً */}
                {preSelectedId && !isLoadingCourses && form.courseId === preSelectedId && (
                   <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t("Course automatically selected based on your choice.", "تم تحديد الدورة تلقائيًا بناءً على اختيارك.", "Course automatically selected.")}
                   </p>
                )}
              </div>

              {/* رسالة إضافية */}
              <div className="space-y-2">
                <Label htmlFor="message" className={isLight ? 'text-slate-700' : 'text-slate-400'}>{t("Statement of Purpose (Optional)", "بيان الغرض (اختياري)", "Statement of Purpose (Optional)")}</Label>
                <Textarea
                  id="message"
                  placeholder={t("Why do you want to join this program? (Optional)", "لماذا تريد الانضمام إلى هذا البرنامج؟ (اختياري)", "Why do you want to join?")}
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`resize-none rounded-xl focus:ring-cyan-500/30 focus:border-cyan-500/40 ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                />
              </div>

              {/* زر الإرسال */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-6 text-lg transition-all shadow-lg shadow-cyan-500/20 mt-4 rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t("Submitting...", "جاري الإرسال...", "Submitting...")}
                  </>
                ) : (
                  <>
                    {t("Submit Application", "إرسال الطلب", "Submit Application")} <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
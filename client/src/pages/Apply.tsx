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

export default function Apply() {
  const [location, navigate] = useLocation();
  
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
      toast.success("Application submitted successfully! We will contact you soon.");
      // تفريغ النموذج
      setForm({ fullName: "", email: "", phone: "", courseId: "", message: "" });
      setLoading(false);
      
      // توجيه المستخدم للصفحة الرئيسية بعد ثانيتين
      setTimeout(() => navigate("/"), 2000);
    },
    onError: (error) => {
      toast.error(`Failed to submit: ${error.message}`);
      setLoading(false);
    },
  });

  // معالجة الضغط على زر الإرسال
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!form.fullName || !form.email || !form.phone || !form.courseId) {
      toast.error("Please fill in all required fields (Name, Email, Phone, Course).");
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation />

      {/* 🏛️ HERO SECTION */}
      <section className="relative bg-[#0b1120] text-white pt-36 pb-24 overflow-hidden">
        {/* تأثيرات الخلفية */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Your Journey</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Join the Next Cohort of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Innovators.</span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 font-light">
            Fill out the form below to reserve your spot. Our admissions team will review your application and get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* 📝 APPLICATION FORM */}
      <section className="max-w-3xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <Card className="border border-slate-200 shadow-xl bg-white">
          <CardHeader className="text-center border-b border-slate-100 pb-8">
            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
               <Rocket className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Student Application</CardTitle>
            <CardDescription>
               Please ensure all information is correct to avoid delays.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* الاسم ورقم الهاتف */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="e.g. Ahmed Mohamed"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (WhatsApp) *</Label>
                  <Input
                    id="phone"
                    placeholder="e.g. +20 1xxx xxx xxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="h-11 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>

              {/* 🎓 اختيار الكورس (Dropdown) */}
              <div className="space-y-2">
                <Label htmlFor="course">Select Program / Course *</Label>
                
                {isLoadingCourses ? (
                  // شكل تحميل (Loading Skeleton)
                  <div className="h-11 w-full bg-slate-100 animate-pulse rounded-md border border-slate-200"></div>
                ) : (
                  <Select 
                    value={form.courseId} 
                    onValueChange={(val) => setForm({ ...form, courseId: val })}
                  >
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:bg-white">
                      <SelectValue placeholder="-- Choose a Course --" />
                    </SelectTrigger>
                    <SelectContent>
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
                   <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Course automatically selected based on your choice.
                   </p>
                )}
              </div>

              {/* رسالة إضافية */}
              <div className="space-y-2">
                <Label htmlFor="message">Statement of Purpose (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Why do you want to join this program? (Optional)"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white resize-none"
                />
              </div>

              {/* زر الإرسال */}
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-6 text-lg transition-all shadow-lg shadow-slate-900/10 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit Application <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
          <p className="text-slate-500 text-sm">
            By submitting this form, you agree to be contacted by InfinityX for enrollment purposes.
          </p>
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} InfinityX EdTech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
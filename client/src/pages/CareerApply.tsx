import { useState } from "react";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Briefcase, Link as LinkIcon, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function CareerApply() {
  const [, setLocation] = useLocation();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    cvLink: "",
    message: "",
  });

  const createApplication = trpc.admin.createApplication.useMutation({
    onSuccess: () => {
      toast.success(t("Application Submitted. Thank you!", "تم إرسال الطلب. شكراً لك!", "Application Submitted"));
      setLocation("/careers");
    },
    onError: (error) => {
      toast.error(error.message || t("An error occurred. Please try again.", "حدث خطأ. يرجى المحاولة مرة أخرى.", "An error occurred."));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createApplication.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      courseInterest: formData.position, // using courseInterest to store position for now
      cvLink: formData.cvLink,
      message: formData.message,
      type: "career",
    });
  };

  return (
    <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#0a0e1a] text-white"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-4 ${isLight ? "bg-blue-100 text-blue-600" : "bg-blue-500/20 text-blue-400"}`}>
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
              {t("Career Application", "طلب توظيف", "Career Application")}
            </h1>
            <p className={`${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {t("Join our team. Fill out the form below to apply.", "انضم إلى فريقنا. املأ النموذج أدناه للتقديم.", "Join our team. Apply below.")}
            </p>
          </div>
          <Link href="/careers">
            <Button variant="ghost" className={`hidden sm:flex ${isLight ? "text-slate-600 hover:bg-slate-200" : "text-slate-400 hover:text-white"}`}>
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"} ${isRTL && "rotate-180"}`} />
              {t("Back to Careers", "العودة للوظائف", "Back to Careers")}
            </Button>
          </Link>
        </div>

        <div className={`backdrop-blur-xl rounded-2xl border p-8 shadow-xl ${isLight ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-[#0d1225]/80 border-white/[0.06]"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={isLight ? "text-slate-700" : "text-slate-300"}>
                  {t("Full Name", "الاسم الكامل", "Full Name")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t("John Doe", "أحمد محمد", "John Doe")}
                  className={isLight ? "bg-slate-50 border-slate-200" : "bg-[#0a0e1a] border-white/10"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={isLight ? "text-slate-700" : "text-slate-300"}>
                  {t("Email Address", "البريد الإلكتروني", "Email Address")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className={isLight ? "bg-slate-50 border-slate-200" : "bg-[#0a0e1a] border-white/10"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={isLight ? "text-slate-700" : "text-slate-300"}>
                  {t("Phone Number", "رقم الهاتف", "Phone Number")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+20 100 000 0000"
                  className={isLight ? "bg-slate-50 border-slate-200" : "bg-[#0a0e1a] border-white/10"}
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className={isLight ? "text-slate-700" : "text-slate-300"}>
                  {t("Position Applied For", "المسمى الوظيفي المتقدم إليه", "Position Applied For")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder={t("e.g. Frontend Developer", "مثال: مطور واجهات أمامية", "e.g. Frontend Developer")}
                  className={isLight ? "bg-slate-50 border-slate-200" : "bg-[#0a0e1a] border-white/10"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvLink" className={isLight ? "text-slate-700" : "text-slate-300"}>
                {t("CV / Resume Link", "رابط السيرة الذاتية (CV)", "CV / Resume Link")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <LinkIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                <Input
                  id="cvLink"
                  type="url"
                  required
                  value={formData.cvLink}
                  onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
                  placeholder={t("Drive, Dropbox, Notion, LinkedIn...", "رابط Drive، Dropsbox، LinkedIn...", "Drive, Dropbox, etc.")}
                  className={`${isLight ? "bg-slate-50 border-slate-200" : "bg-[#0a0e1a] border-white/10"} ${isRTL ? "pr-10" : "pl-10"}`}
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t("Please ensure the link is publicly accessible.", "يرجى التأكد من أن الرابط متاح للجمهور.", "Make sure link is public.")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className={isLight ? "text-slate-700" : "text-slate-300"}>
                {t("Cover Letter / Message", "رسالة تعريفية", "Cover Letter (Optional)")}
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t("Tell us why you're a great fit...", "أخبرنا لماذا أنت مناسب لهذا الدور...", "Tell us about yourself...")}
                className={`min-h-[120px] ${isLight ? "bg-slate-50 border-slate-200" : "bg-[#0a0e1a] border-white/10"}`}
              />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <Button
                type="submit"
                disabled={createApplication.isPending}
                className={`w-full py-6 text-lg font-bold ${isLight ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                {createApplication.isPending && <Loader2 className={`w-5 h-5 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                {t("Submit Application - Apply Now", "إرسال طلب التوظيف", "Submit Application")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

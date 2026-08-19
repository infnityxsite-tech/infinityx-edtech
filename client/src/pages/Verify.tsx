import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, XCircle, Award, Calendar, User, BookOpen, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Verify() {
  const [certId, setCertId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const { data: certificate, isLoading } = trpc.admin.getCertificateByCertId.useQuery(
    { certId: searchId },
    { enabled: !!searchId, retry: false }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setSearchId(certId.trim().toUpperCase());
    setHasSearched(true);
  };

  return (
    <div
      className={`ix-page min-h-screen font-sans flex flex-col ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />

      {/* Hero */}
      <section className="relative pt-12 sm:pt-16 pb-12 overflow-hidden">
        <div className="max-w-2xl w-full mx-auto text-center px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4EBE6] border border-[#D8DDD8] text-[#52735F] text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t("Certificate Verification", "التحقق من الشهادة", "Certificate Verification")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-[#1F2925]">
            {t("Verify a ", "تحقق من ", "Verify a ")}
            <span className="text-[#52735F]">{t("Certificate", "شهادة", "Certificate")}</span>
          </h1>
          <p className="text-lg font-light leading-relaxed max-w-lg mx-auto text-[#5E6862]">
            {t(
              "Enter the unique InfinityX certificate ID below to verify its authenticity and details.",
              "أدخل رقم شهادة InfinityX الفريد أدناه للتحقق من صحتها وتفاصيلها.",
              "Enter the certificate ID to verify."
            )}
          </p>
        </div>
      </section>

      {/* Search Card */}
      <main className="flex-1 px-6 pb-20 relative z-10">
        <div className="w-full max-w-2xl mx-auto bg-white border border-[#D8DDD8] rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
          <div className="p-8 md:p-10">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 text-[#7B847F] w-5 h-5 pointer-events-none ${isRTL ? "right-4" : "left-4"}`} />
                <Input
                  type="text"
                  placeholder="e.g. INF-2025-0001"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className={`py-6 text-base rounded-xl font-medium uppercase placeholder:normal-case focus:ring-[#52735F]/20 focus:border-[#52735F] bg-white border-[#D8DDD8] text-[#1F2925] ${
                    isRTL ? "pr-12" : "pl-12"
                  }`}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="py-6 px-8 rounded-xl bg-[#52735F] hover:bg-[#43614F] text-white font-bold shadow-md shadow-[#52735F]/20 transition-all hover:-translate-y-0.5 text-base"
              >
                {isLoading ? (isRTL ? "جارٍ التحقق..." : "Verifying...") : isRTL ? "تحقق" : "Verify"}
              </Button>
            </form>

            <div className="mt-8 transition-all duration-500">
              {hasSearched && isLoading && (
                <div className="text-center text-[#5E6862] py-8 animate-pulse">
                  {isRTL ? "جارٍ البحث في السجلات..." : "Searching records..."}
                </div>
              )}

              {hasSearched && !isLoading && !certificate && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-red-700 mb-1">
                    {isRTL ? "الشهادة غير موجودة" : "Certificate Not Found"}
                  </h3>
                  <p className="text-red-600/80 text-sm">
                    {isRTL
                      ? `لا توجد شهادة بالمعرّف ${searchId}. يرجى التحقق من الرقم والمحاولة مرة أخرى.`
                      : `No certificate exists with the ID ${searchId}. Please check the ID and try again.`}
                  </p>
                </div>
              )}

              {hasSearched && !isLoading && certificate && (
                <div className="bg-[#E4EBE6] border border-[#52735F]/30 rounded-xl p-6">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#52735F]" />
                    <h3 className="text-xl font-bold text-[#1F2925]">{isRTL ? "شهادة موثقة" : "Valid Certificate"}</h3>
                  </div>

                  <div className="space-y-4 bg-white rounded-xl p-5 border border-[#D8DDD8] text-[#1F2925] shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#7B847F] uppercase font-semibold flex items-center gap-1 mb-1">
                          <User className="w-3.5 h-3.5 text-[#52735F]" /> {isRTL ? "اسم الطالب" : "Student Name"}
                        </p>
                        <p className="font-semibold text-[#1F2925]">{certificate.studentName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#7B847F] uppercase font-semibold flex items-center gap-1 mb-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#52735F]" /> {isRTL ? "البرنامج / الدورة" : "Course"}
                        </p>
                        <p className="font-semibold text-[#1F2925]">{certificate.courseName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#7B847F] uppercase font-semibold flex items-center gap-1 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-[#52735F]" /> {isRTL ? "تاريخ الإصدار" : "Issue Date"}
                        </p>
                        <p className="font-semibold text-[#1F2925]">
                          {new Date(certificate.issueDate).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#7B847F] uppercase font-semibold flex items-center gap-1 mb-1">
                          <Award className="w-3.5 h-3.5 text-[#52735F]" /> {isRTL ? "معرّف الشهادة" : "Credential ID"}
                        </p>
                        <p className="font-mono text-sm font-semibold bg-[#F5F4EF] text-[#52735F] px-2 py-0.5 rounded inline-block">
                          {certificate.certId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Button asChild className="bg-[#52735F] hover:bg-[#43614F] text-white rounded-xl px-6">
                      <Link href={`/certificates/${certificate.certId}`}>
                        {isRTL ? "عرض الشهادة الرقمية" : "View Digital Certificate"}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

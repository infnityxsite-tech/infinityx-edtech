import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Award, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

export default function Certificate() {
  const { certId } = useParams<{ certId: string }>();
  const [isDownloading, setIsDownloading] = useState(false);
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { data: certificate, isLoading, isError } = trpc.admin.getCertificateByCertId.useQuery(
    { certId: certId?.toUpperCase() || "" },
    { enabled: !!certId, retry: false }
  );
  useSEO({
    title: certificate ? `Certificate ${certificate.certId}` : "Certificate verification",
    description: "Infinity X Academy digital certificate verification.",
    canonical: `https://infx.space/certificates/${certId || ""}`,
    robots: isLoading ? undefined : "noindex, follow",
  });

  const handleDownload = () => {
    if (!certificate) return;
    setIsDownloading(true);
    window.location.href = `/api/certificates/${encodeURIComponent(certificate.certId)}/download`;
    window.setTimeout(() => setIsDownloading(false), 2000);
  };

  if (isLoading) {
    return (
      <div className={`grid min-h-screen place-items-center ${isLight ? "bg-[#F5F4EF]" : "bg-[#07111b]"}`}>
        <Loader2 className="h-8 w-8 animate-spin text-[#52735F]" />
      </div>
    );
  }

  if (isError || !certificate) {
    return (
      <div
        className={`grid min-h-screen place-items-center px-6 text-center ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div>
          <Award className="mx-auto h-10 w-10 text-[#52735F]" />
          <h1 className="mt-6 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">
            {t("Certificate not found.", "الشهادة غير موجودة.", "Certificate not found.")}
          </h1>
          <p className={`mt-4 ${isLight ? "text-[#5E6862]" : "text-slate-400"}`}>
            {t(
              "Check the credential ID and try verification again.",
              "تحقق من معرّف الشهادة وحاول التحقق مرة أخرى.",
              "Check the credential ID and try verification again."
            )}
          </p>
          <Link href="/verify">
            <Button className="mt-8 rounded-md bg-[#52735F] text-white hover:bg-[#43614F]">
              {t("Verify another certificate", "تحقق من شهادة أخرى", "Verify another certificate")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ix-page ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-16 lg:px-8">
        <div className={`flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-center sm:justify-between ${isLight ? "border-[#D8DDD8]" : "border-white/10"}`}>
          <Link
            href="/verify"
            className={`inline-flex items-center gap-2 text-sm font-bold ${isLight ? "text-[#5E6862] hover:text-[#1F2925]" : "text-slate-400 hover:text-white"}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            {t("Certificate verification", "التحقق من الشهادة", "Certificate verification")}
          </Link>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-10 rounded-md bg-[#52735F] px-4 text-sm font-bold text-white hover:bg-[#43614F]"
          >
            {isDownloading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Download className="me-2 h-4 w-4" />}
            {t("Download certificate", "تنزيل الشهادة", "Download certificate")}
          </Button>
        </div>

        <section className="grid gap-12 py-12 lg:grid-cols-[1.2fr_.8fr] lg:py-16">
          <div className={`border p-3 sm:p-5 rounded-lg ${isLight ? "border-[#D8DDD8] bg-white shadow-xl shadow-black/5" : "border-white/10 bg-white/[.03]"}`}>
            <img
              src={`/api/certificates/${encodeURIComponent(certificate.certId)}/image`}
              alt={t("Infinity X Academy certificate", "شهادة أكاديمية إنفينيتي إكس", "Infinity X Academy certificate")}
              className="w-full object-contain"
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </div>

          <aside className={`self-start border-s ps-7 ${isLight ? "border-[#D8DDD8]" : "border-white/10"}`}>
            <div className="flex items-center gap-2 text-[#52735F]">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[.16em]">
                {t("Verified credential", "شهادة موثقة", "Verified credential")}
              </p>
            </div>
            <h1 className="mt-8 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">{certificate.studentName}</h1>
            <dl className={`mt-10 space-y-6 border-t pt-6 ${isLight ? "border-[#D8DDD8]" : "border-white/10"}`}>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[.15em] text-[#7B847F]">
                  {t("Program", "البرنامج", "Program")}
                </dt>
                <dd className="mt-2 text-lg font-bold text-[#1F2925]">{certificate.courseName}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[.15em] text-[#7B847F]">
                  {t("Issued", "تاريخ الإصدار", "Issued")}
                </dt>
                <dd className="mt-2 font-bold text-[#1F2925]">
                  {new Date(certificate.issueDate).toLocaleDateString(
                    isRTL ? "ar-EG" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[.15em] text-[#7B847F]">
                  {t("Credential ID", "معرّف الشهادة", "Credential ID")}
                </dt>
                <dd className="mt-2 break-all font-mono text-sm font-bold text-[#52735F]">{certificate.certId}</dd>
              </div>
            </dl>
            <p className={`mt-10 text-sm leading-7 ${isLight ? "text-[#5E6862]" : "text-slate-400"}`}>
              {t(
                "This page confirms the credential record held by Infinity X Academy.",
                "تؤكد هذه الصفحة سجل الشهادة المحفوظ لدى أكاديمية إنفينيتي إكس.",
                "This page confirms the credential record held by Infinity X Academy."
              )}
            </p>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}

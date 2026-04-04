import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    const isLight = theme === 'light';

    const { data: certificate, isLoading, isError } = trpc.admin.getCertificateByCertId.useQuery(
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
        <div className={`min-h-screen font-sans flex flex-col ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <Navigation />

            {/* Hero */}
            <section className={`relative pt-36 pb-20 overflow-hidden ${isLight ? '' : 'text-white'}`}>
                <div className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-10' : 'opacity-[0.03]'}`} style={{ backgroundImage: `linear-gradient(${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-emerald-600/15 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-2xl w-full mx-auto text-center px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t("Certificate Verification", "التحقق من الشهادة", "Certificate Verification")}</span>
                    </div>
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {t("Verify a ", "تحقق من ", "Verify a ")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{t("Certificate", "شهادة", "Certificate")}</span>
                    </h1>
                    <p className={`text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {t(
                            "Enter the unique InfinityX certificate ID below to verify its authenticity and details.",
                            "أدخل رقم شهادة InfinityX الفريد أدناه للتحقق من صحتها وتفاصيلها.",
                            "Enter the certificate ID to verify."
                        )}
                    </p>
                </div>
            </section>

            {/* Search Card */}
            <main className="flex-1 px-6 pb-20 relative z-10 -mt-4">
                <div className="w-full max-w-2xl mx-auto bg-[#0d1225]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
                    <div className="p-8 md:p-10">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 pointer-events-none" />
                                <Input
                                    type="text"
                                    placeholder="e.g. INF-2025-0001"
                                    value={certId}
                                    onChange={(e) => setCertId(e.target.value)}
                                    className={`pl-12 py-7 text-lg rounded-xl font-medium uppercase placeholder:normal-case focus:ring-emerald-500/30 focus:border-emerald-500/40 ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                                />
                            </div>
                            <Button type="submit" size="lg" disabled={isLoading} className="py-7 px-10 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 text-lg">
                                {isLoading ? "Verifying..." : "Verify"}
                            </Button>
                        </form>

                        <div className="mt-8 transition-all duration-500">
                            {hasSearched && isLoading && (
                                <div className="text-center text-slate-500 py-8 animate-pulse">Searching records...</div>
                            )}

                            {hasSearched && !isLoading && !certificate && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-red-300 mb-1">Certificate Not Found</h3>
                                    <p className="text-red-400/70 text-sm">
                                        No certificate exists with the ID <span className="font-mono font-semibold">{searchId}</span>. Please check the ID and try again.
                                    </p>
                                </div>
                            )}

                            {hasSearched && !isLoading && certificate && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                                    <div className="flex items-center justify-center gap-2 mb-6">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                        <h3 className="text-xl font-bold text-emerald-300">Valid Certificate</h3>
                                    </div>

                                    <div className="space-y-4 bg-white rounded-xl p-5 border border-slate-200 text-slate-900 shadow-sm">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                                    <User className="w-3.5 h-3.5" /> Student Name
                                                </p>
                                                <p className="font-semibold">{certificate.studentName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                                    <BookOpen className="w-3.5 h-3.5" /> Course
                                                </p>
                                                <p className="font-semibold">{certificate.courseName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                                    <Calendar className="w-3.5 h-3.5" /> Issue Date
                                                </p>
                                                <p className="font-semibold">
                                                    {new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                                    <Award className="w-3.5 h-3.5" /> Credential ID
                                                </p>
                                                <p className="font-mono text-sm font-semibold bg-slate-100 px-2 py-0.5 rounded inline-block">
                                                    {certificate.certId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6">
                                            <Link href={`/certificates/${certificate.certId}`}>
                                                View Digital Certificate
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

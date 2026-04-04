import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, Award, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Certificate() {
    const { certId } = useParams<{ certId: string }>();
    const [isDownloading, setIsDownloading] = useState(false);

    const { data: certificate, isLoading, isError } = trpc.admin.getCertificateByCertId.useQuery(
        { certId: certId?.toUpperCase() || "" },
        { enabled: !!certId, retry: false }
    );

    const handleDownload = () => {
        if (!certificate) return;
        setIsDownloading(true);
        window.location.href = `/api/certificates/${encodeURIComponent(certificate.certId)}/download`;
        setTimeout(() => setIsDownloading(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center flex-col gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                <p className="text-slate-500 font-medium">Loading certificate…</p>
            </div>
        );
    }

    if (isError || !certificate) {
        return (
            <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center flex-col gap-4 text-center px-4">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400">
                    <Award className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-white">Certificate Not Found</h1>
                <p className="text-slate-500">The ID <strong className="text-slate-300">{certId}</strong> does not exist or is invalid.</p>
                <Button asChild className="mt-4 bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 rounded-xl"><Link href="/verify">← Verify another certificate</Link></Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex flex-col">
            <Navigation />

            <main className="flex-1 flex flex-col items-center py-28 px-4">
                {/* Action bar */}
                <div className="w-full max-w-5xl flex items-center justify-between mb-6">
                    <Button asChild variant="ghost" className="text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-xl">
                        <Link href="/verify" className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> Back
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 hidden sm:block">Certificate ID: <strong className="text-slate-300">{certificate.certId}</strong></span>
                        <Button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center gap-2 min-w-[160px] rounded-xl shadow-lg shadow-cyan-500/20"
                        >
                            {isDownloading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                                : <><Download className="w-4 h-4" /> Download PDF</>}
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-x-auto rounded-2xl shadow-2xl shadow-black/30 border border-white/[0.06] flex justify-center bg-white p-2 sm:p-4">
                    <img
                        src={`/api/certificates/${encodeURIComponent(certificate.certId)}/download`}
                        alt="Certificate"
                        className="max-w-[1000px] w-full h-auto rounded-lg shadow-sm object-contain"
                        draggable={false}
                    />
                </div>

                <p className="text-xs text-slate-600 mt-4 text-center">
                    Rendered securely by the server · Click Download for the original PNG file.
                </p>
            </main>

            <Footer />
        </div>
    );
}

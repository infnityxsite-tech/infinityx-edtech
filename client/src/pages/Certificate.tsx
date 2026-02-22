import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, Award, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// End of local rendering logic. Now heavily relies on server.

export default function Certificate() {
    const { certId } = useParams<{ certId: string }>();
    const certRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [imgReady, setImgReady] = useState(false);

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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Loading certificate…</p>
            </div>
        );
    }

    if (isError || !certificate) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4 text-center px-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                    <Award className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Certificate Not Found</h1>
                <p className="text-slate-500">The ID <strong>{certId}</strong> does not exist or is invalid.</p>
                <Button asChild className="mt-4"><Link href="/verify">← Verify another certificate</Link></Button>
            </div>
        );
    }

    const formattedDate = new Date(certificate.issueDate).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric"
    });

    const verifyUrl = `${window.location.origin}/certificates/${certificate.certId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(verifyUrl)}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50/40 flex flex-col">
            <Navigation />

            <main className="flex-1 flex flex-col items-center py-24 px-4">
                {/* Action bar */}
                <div className="w-full max-w-5xl flex items-center justify-between mb-6">
                    <Button asChild variant="ghost" className="text-slate-500 hover:text-slate-800">
                        <Link href="/verify" className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> Back
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 hidden sm:block">Certificate ID: <strong>{certificate.certId}</strong></span>
                        <Button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 min-w-[160px]"
                        >
                            {isDownloading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                                : <><Download className="w-4 h-4" /> Download PDF</>}
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-x-auto rounded-xl shadow-2xl shadow-slate-400/20 border border-slate-200 flex justify-center bg-white p-2 sm:p-4">
                    <img
                        src={`/api/certificates/${encodeURIComponent(certificate.certId)}/download`}
                        alt="Certificate"
                        className="max-w-[1000px] w-full h-auto rounded shadow-sm object-contain"
                        draggable={false}
                    />
                </div>

                <p className="text-xs text-slate-400 mt-4 text-center">
                    Rendered securely by the server · Click Download for the original PNG file.
                </p>
            </main>
        </div>
    );
}

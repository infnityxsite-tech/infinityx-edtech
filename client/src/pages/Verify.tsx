import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, XCircle, Award, Calendar, User, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function Verify() {
    const [certId, setCertId] = useState("");
    const [searchId, setSearchId] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    // We only fetch when searchId is set
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            <Navigation />

            <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 pb-24 relative overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[500px] max-w-3xl bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-2xl w-full text-center mb-12 relative z-10">
                    <Badge className="bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/50 border border-indigo-200 mb-6 tracking-widest uppercase text-xs font-bold px-4 py-1.5 shadow-sm">
                        Certificate Verification
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">
                        Verify a Certificate
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto">
                        Enter the unique InfinityX certificate ID below to verify its authenticity and details.
                    </p>
                </div>

                <Card className="w-full max-w-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden rounded-3xl relative z-10 bg-white/90 backdrop-blur-xl">
                    <CardContent className="p-8 md:p-12">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                <Input
                                    type="text"
                                    placeholder="e.g. INF-2025-0001"
                                    value={certId}
                                    onChange={(e) => setCertId(e.target.value)}
                                    className="pl-12 py-7 text-lg rounded-2xl border-slate-200 shadow-sm focus-visible:ring-indigo-500 focus-visible:border-indigo-500 uppercase placeholder:normal-case font-medium bg-slate-50"
                                />
                            </div>
                            <Button type="submit" size="lg" disabled={isLoading} className="py-7 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 text-lg">
                                {isLoading ? "Verifying..." : "Verify"}
                            </Button>
                        </form>

                        <div className="mt-8 transition-all duration-500">
                            {hasSearched && isLoading && (
                                <div className="text-center text-slate-500 py-8 animate-pulse">
                                    Searching records...
                                </div>
                            )}

                            {hasSearched && !isLoading && !certificate && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-red-900 mb-1">Certificate Not Found</h3>
                                    <p className="text-red-600 text-sm">
                                        No certificate exists with the ID <span className="font-mono font-semibold">{searchId}</span>. Please check the ID and try again.
                                    </p>
                                </div>
                            )}

                            {hasSearched && !isLoading && certificate && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
                                    <div className="flex items-center justify-center gap-2 mb-6">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                        <h3 className="text-xl font-bold text-emerald-900">Valid Certificate</h3>
                                    </div>

                                    <div className="space-y-4 bg-white rounded-lg p-5 border border-emerald-100 shadow-sm">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                                    <User className="w-3.5 h-3.5" /> Student Name
                                                </p>
                                                <p className="font-semibold text-slate-900">{certificate.studentName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                                    <BookOpen className="w-3.5 h-3.5" /> Course
                                                </p>
                                                <p className="font-semibold text-slate-900">{certificate.courseName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                                    <Calendar className="w-3.5 h-3.5" /> Issue Date
                                                </p>
                                                <p className="font-semibold text-slate-900">
                                                    {new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                                    <Award className="w-3.5 h-3.5" /> Credential ID
                                                </p>
                                                <p className="font-mono text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded inline-block">
                                                    {certificate.certId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
                                            <Link href={`/certificates/${certificate.certId}`}>
                                                View Digital Certificate
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

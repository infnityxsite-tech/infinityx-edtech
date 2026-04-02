import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Award, Plus, Trash2, Calendar, Link as LinkIcon, Download } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CertificatesManager() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        studentName: "",
        studentEmail: "",
        courseName: "",
        duration: "",
        issueDate: new Date().toISOString().split('T')[0],
    });

    const utils = trpc.useUtils();
    const { data: certificates = [], isLoading } = trpc.admin.getCertificates.useQuery();
    const [allStudents, setAllStudents] = useState<any[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'students'));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllStudents(data);
            } catch (error) {
                console.error("Failed to fetch students for certificates", error);
            }
        };
        fetchStudents();
    }, []);

    const createMutation = trpc.admin.createCertificate.useMutation({
        onSuccess: (data) => {
            toast.success(`Certificate generated successfully: ${data.certId}`);
            setIsOpen(false);
            setFormData({
                studentName: "",
                studentEmail: "",
                courseName: "",
                duration: "",
                issueDate: new Date().toISOString().split('T')[0],
            });
            utils.admin.getCertificates.invalidate();
        },
        onError: (error) => {
            toast.error(`Failed to create certificate: ${error.message}`);
        }
    });

    const deleteMutation = trpc.admin.deleteCertificate.useMutation({
        onSuccess: () => {
            toast.success("Certificate deleted successfully");
            utils.admin.getCertificates.invalidate();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading certificates...</div>;
    }

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
                <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Award className="w-6 h-6 text-blue-600" />
                        Certificates
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                        Generate and manage digital certificates for students.
                    </CardDescription>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Create Certificate
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Generate New Certificate</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="studentSelect">Select Student *</Label>
                                <select
                                    id="studentSelect"
                                    className="w-full h-10 px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                    value={formData.studentEmail}
                                    onChange={(e) => {
                                        const email = e.target.value;
                                        const student = (allStudents as any[]).find((s) => s.email === email);
                                        if (student) {
                                            setFormData({ ...formData, studentEmail: student.email, studentName: student.name });
                                        } else {
                                            setFormData({ ...formData, studentEmail: "", studentName: "" });
                                        }
                                    }}
                                    required
                                >
                                    <option value="">-- Choose a registered student --</option>
                                    {(allStudents as any[]).map((s) => (
                                        <option key={s.id} value={s.email}>
                                            {s.name} ({s.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="courseName">Course Name</Label>
                                <Input
                                    id="courseName"
                                    value={formData.courseName}
                                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                    placeholder="e.g. Advanced React Patterns"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration / Hours (Optional)</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="e.g. 40 Hours"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="issueDate">Issue Date</Label>
                                <Input
                                    id="issueDate"
                                    type="date"
                                    value={formData.issueDate}
                                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full mt-6" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Generating..." : "Generate Certificate"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="p-0">
                {certificates.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No Certificates Found</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                            You haven't generated any certificates yet. Click the button above to create your first one.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {certificates.map((cert: any) => (
                            <div key={cert.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Award className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{cert.studentName}</h4>
                                        <p className="text-slate-600 font-medium mb-1">{cert.courseName}</p>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(cert.issueDate).toLocaleDateString()}
                                            </span>
                                            {cert.duration && (
                                                <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium border border-slate-200">
                                                    {cert.duration}
                                                </span>
                                            )}
                                            <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-xs border border-indigo-100">
                                                {cert.certId}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
                                    <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                                        <a href={`/certificates/${cert.certId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                            <LinkIcon className="w-3.5 h-3.5" /> View
                                        </a>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete certificate ${cert.certId} for ${cert.studentName}?`)) {
                                                deleteMutation.mutate({ id: cert.id });
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

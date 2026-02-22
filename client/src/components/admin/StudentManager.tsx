import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, UserPlus, RefreshCcw, Search, Plus, Mail, Lock, User } from "lucide-react";

export default function StudentManager() {
    const utils = trpc.useUtils();
    const { data: students = [], isLoading } = trpc.admin.getAllStudents.useQuery();
    const { data: courses = [] } = trpc.admin.getCourses.useQuery();

    const [searchQuery, setSearchQuery] = useState("");
    const [enrollForm, setEnrollForm] = useState({ userId: "", courseId: "" });

    // Add Student Dialog state
    const [addOpen, setAddOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: "", email: "", password: "" });
    const [isCreating, setIsCreating] = useState(false);

    const enrollMutation = trpc.admin.enrollUser.useMutation({
        onSuccess: () => {
            toast.success("Student enrolled successfully!");
            utils.admin.getAllStudents.invalidate();
            setEnrollForm({ userId: "", courseId: "" });
        },
        onError: (err) => toast.error(err.message)
    });

    const resetDevicesMutation = trpc.admin.clearUserDevices.useMutation({
        onSuccess: () => toast.success("Device sessions reset successfully!"),
        onError: (err) => toast.error(err.message)
    });

    // Add student via the studentRegister endpoint
    const registerMutation = trpc.admin.studentRegister.useMutation({
        onSuccess: () => {
            toast.success("✅ Student account created successfully!");
            setNewStudent({ name: "", email: "", password: "" });
            setAddOpen(false);
            utils.admin.getAllStudents.invalidate();
        },
        onError: (err) => {
            toast.error(err.message || "Failed to create student");
        }
    });

    const handleCreateStudent = async () => {
        if (!newStudent.name.trim()) return toast.error("Full name is required");
        if (!newStudent.email.trim() || !newStudent.email.includes("@")) return toast.error("Valid email is required");
        if (newStudent.password.length < 6) return toast.error("Password must be at least 6 characters");
        setIsCreating(true);
        try {
            await registerMutation.mutateAsync({
                name: newStudent.name.trim(),
                email: newStudent.email.trim().toLowerCase(),
                password: newStudent.password
            });
        } finally {
            setIsCreating(false);
        }
    };

    const filteredStudents = students.filter((s: any) =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>Manage students, enrollments, and device limits.</CardDescription>
                </div>
                <Button onClick={() => setAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Student
                </Button>
            </CardHeader>

            <CardContent>
                {/* Manual Enrollment */}
                <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-blue-500" /> Enroll Student in a Course
                    </h3>
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                        <div className="flex-1 space-y-1 w-full">
                            <label className="text-xs text-slate-500 font-medium">Select Student</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={enrollForm.userId} onChange={e => setEnrollForm({ ...enrollForm, userId: e.target.value })}>
                                <option value="">-- Choose Student --</option>
                                {students.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 space-y-1 w-full">
                            <label className="text-xs text-slate-500 font-medium">Select Course</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={enrollForm.courseId} onChange={e => setEnrollForm({ ...enrollForm, courseId: e.target.value })}>
                                <option value="">-- Choose Course --</option>
                                {courses.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <Button onClick={() => enrollMutation.mutate(enrollForm)}
                            disabled={!enrollForm.userId || !enrollForm.courseId || enrollMutation.isPending}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                            {enrollMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll"}
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-5">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <Input placeholder="Search by name or email…" className="pl-9"
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>

                {/* Student List */}
                {isLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center p-10 border border-dashed rounded-xl text-slate-400">
                        <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No students found.</p>
                        <p className="text-sm mt-1">Click "Add Student" to create the first account.</p>
                    </div>
                ) : (
                    <div className="border rounded-xl overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Joined</th>
                                    <th className="px-4 py-3 text-center">Enrollments</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student: any) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                                        <td className="px-4 py-3 text-slate-500">{student.email}</td>
                                        <td className="px-4 py-3 text-slate-500">{new Date(student.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full text-xs min-w-[24px]">
                                                {student.enrollments || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="outline" size="sm"
                                                className="h-8 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200"
                                                onClick={() => {
                                                    if (window.confirm(`Reset device sessions for ${student.name}?`)) {
                                                        resetDevicesMutation.mutate({ userId: student.id });
                                                    }
                                                }}
                                                disabled={resetDevicesMutation.isPending}>
                                                <RefreshCcw className="w-3 h-3 mr-1" /> Reset Devices
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>

            {/* ADD STUDENT DIALOG */}
            <Dialog open={addOpen} onOpenChange={v => { if (!v) { setAddOpen(false); setNewStudent({ name: "", email: "", password: "" }); } }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-indigo-600" /> Create Student Account
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <p className="text-sm text-slate-500">The student will be able to sign in with these credentials. Device sessions are capped at 2.</p>
                        <div>
                            <Label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                                <User className="w-3.5 h-3.5" /> Full Name *
                            </Label>
                            <Input value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                placeholder="e.g. Ahmed Mohamed" />
                        </div>
                        <div>
                            <Label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                                <Mail className="w-3.5 h-3.5" /> Email Address *
                            </Label>
                            <Input type="email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                placeholder="student@example.com" />
                        </div>
                        <div>
                            <Label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                                <Lock className="w-3.5 h-3.5" /> Password * <span className="text-xs font-normal text-slate-400">(min 6 chars)</span>
                            </Label>
                            <Input type="password" value={newStudent.password} onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                                placeholder="••••••••" />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateStudent} disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {isCreating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating…</> : "Create Account"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

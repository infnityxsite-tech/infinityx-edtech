import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, RefreshCcw, Search, User, Edit, Trash2, ShieldCheck } from "lucide-react";

export default function StudentManager() {
    const utils = trpc.useUtils();
    const { data: students = [], isLoading } = trpc.admin.getAllStudents.useQuery();
    const { data: courses = [] } = trpc.admin.getCourses.useQuery();

    const [searchQuery, setSearchQuery] = useState("");
    const [enrollForm, setEnrollForm] = useState({ userId: "", courseId: "" });

    // Edit Student Dialog state
    const [editOpen, setEditOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

    // tRPC mutations
    const enrollUserMutation = trpc.admin.enrollUser.useMutation({
        onSuccess: () => {
            toast.success("Student enrolled successfully!");
            utils.admin.getAllStudents.invalidate();
            setEnrollForm({ userId: "", courseId: "" });
        },
        onError: (err) => toast.error(err.message || "Failed to enroll user"),
    });

    const updateStudentCoursesMutation = trpc.admin.updateStudentCourses.useMutation({
        onSuccess: () => {
            toast.success("Student access updated successfully!");
            setEditOpen(false);
            utils.admin.getAllStudents.invalidate();
        },
        onError: (err) => toast.error(err.message || "Failed to update access"),
    });

    const clearDevicesMutation = trpc.admin.clearUserDevices.useMutation({
        onSuccess: () => {
            toast.success("Device sessions reset successfully!");
            utils.admin.getAllStudents.invalidate();
        },
        onError: (err) => toast.error(err.message || "Failed to reset devices"),
    });

    const deleteStudentMutation = trpc.admin.deleteStudent.useMutation({
        onSuccess: () => {
            toast.success("Student deleted successfully!");
            utils.admin.getAllStudents.invalidate();
        },
        onError: (err) => toast.error(err.message || "Failed to delete student"),
    });

    // When editing a student, fetch their enrolled course IDs from PostgreSQL
    const { data: fetchedEnrolledIds } = trpc.admin.getStudentEnrolledCourseIds.useQuery(
        { userId: String(editingStudent?.id) },
        { enabled: !!editingStudent }
    );

    useEffect(() => {
        if (fetchedEnrolledIds) {
            setEnrolledCourseIds(fetchedEnrolledIds.map(String));
        }
    }, [fetchedEnrolledIds]);

    const handleEnroll = () => {
        if (!enrollForm.userId || !enrollForm.courseId) return;
        enrollUserMutation.mutate({ userId: enrollForm.userId, courseId: enrollForm.courseId });
    };

    const handleSaveAccess = () => {
        if (!editingStudent) return;
        updateStudentCoursesMutation.mutate({
            userId: String(editingStudent.id),
            courseIds: enrolledCourseIds,
        });
    };

    const handleResetDevices = (studentId: string) => {
        clearDevicesMutation.mutate({ userId: studentId });
    };

    const handleDelete = (studentId: string) => {
        deleteStudentMutation.mutate({ userId: studentId });
    };

    const filteredStudents = (students as any[]).filter((s: any) =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>إدارة التراخيص والطلاب</CardTitle>
                    <CardDescription>Manage student access, enrollments, and device limits.</CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                {/* Manual Enrollment */}
                <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-500" /> Manual Quick Enrollment
                    </h3>
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                        <div className="flex-1 space-y-1 w-full">
                            <label className="text-xs text-slate-500 font-medium">Select Student</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={enrollForm.userId} onChange={e => setEnrollForm({ ...enrollForm, userId: e.target.value })}>
                                <option value="">-- Choose Student --</option>
                                {(students as any[]).map((s: any) => (
                                    <option key={s.id} value={String(s.id)}>{s.name} ({s.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 space-y-1 w-full">
                            <label className="text-xs text-slate-500 font-medium">Select Course</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={enrollForm.courseId} onChange={e => setEnrollForm({ ...enrollForm, courseId: e.target.value })}>
                                <option value="">-- Choose Course --</option>
                                {(courses as any[]).map((c: any) => (
                                    <option key={c.id} value={String(c.id)}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <Button onClick={handleEnroll}
                            disabled={!enrollForm.userId || !enrollForm.courseId || enrollUserMutation.isPending}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                            {enrollUserMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll"}
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
                        <p className="text-sm mt-1">Students will appear here once they sign up.</p>
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
                                        <td className="px-4 py-3 text-slate-500">{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full text-xs min-w-[24px]">
                                                {student.enrollmentCount ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon"
                                                    className="w-8 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => {
                                                        setEditingStudent(student);
                                                        setEditOpen(true);
                                                    }}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>

                                                <Button variant="ghost" size="icon"
                                                    className="w-8 h-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                    onClick={() => {
                                                        if (window.confirm(`Reset device sessions for ${student.name}?`)) {
                                                            handleResetDevices(String(student.id));
                                                        }
                                                    }}
                                                    disabled={clearDevicesMutation.isPending}
                                                    title="Reset Devices">
                                                    <RefreshCcw className="w-4 h-4" />
                                                </Button>

                                                <Button variant="ghost" size="icon"
                                                    className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (window.confirm(`Are you absolutely sure you want to delete student ${student.name}? This will remove all their enrollments and data.`)) {
                                                            handleDelete(String(student.id));
                                                        }
                                                    }}
                                                    disabled={deleteStudentMutation.isPending}
                                                    title="Delete Student">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>

            {/* EDIT STUDENT DIALOG */}
            <Dialog open={editOpen} onOpenChange={v => { if (!v) { setEditOpen(false); setEditingStudent(null); } }}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-600" /> إدارة صلاحيات الطالب
                        </DialogTitle>
                    </DialogHeader>
                    {editingStudent && (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-slate-500 font-semibold mb-1 block">Full Name</Label>
                                    <Input value={editingStudent.name} readOnly className="bg-slate-50 text-slate-500" />
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500 font-semibold mb-1 block">Email</Label>
                                    <Input value={editingStudent.email} readOnly className="bg-slate-50 text-slate-500" />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <Label className="font-semibold text-slate-800 mb-3 block">Available Courses</Label>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 border border-slate-200 rounded-md p-3 bg-slate-50">
                                    {(courses as any[]).map((course: any) => (
                                        <label key={course.id} className="flex items-center gap-3 p-2 hover:bg-white rounded border border-transparent hover:border-slate-200 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                checked={enrolledCourseIds.includes(String(course.id))}
                                                onChange={(e) => {
                                                    const courseIdStr = String(course.id);
                                                    if (e.target.checked) {
                                                        setEnrolledCourseIds([...enrolledCourseIds, courseIdStr]);
                                                    } else {
                                                        setEnrolledCourseIds(enrolledCourseIds.filter(id => id !== courseIdStr));
                                                    }
                                                }}
                                            />
                                            <span className="text-sm font-medium text-slate-700">{course.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveAccess} disabled={updateStudentCoursesMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {updateStudentCoursesMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : "Save Access"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}

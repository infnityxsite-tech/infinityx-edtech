import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, RefreshCcw, Search, User, Edit, Trash2, ShieldCheck } from "lucide-react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StudentManager() {
    const utils = trpc.useUtils();
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: courses = [] } = trpc.admin.getCourses.useQuery();

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'students'));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch students");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [enrollForm, setEnrollForm] = useState({ userId: "", courseId: "" });

    // Edit Student Dialog state
    const [editOpen, setEditOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

    const [isEnrolling, setIsEnrolling] = useState(false);
    const handleEnroll = async () => {
        if (!enrollForm.userId || !enrollForm.courseId) return;
        setIsEnrolling(true);
        try {
            const studentRef = doc(db, 'students', enrollForm.userId);
            const studentToUpdate = students.find(s => s.id === enrollForm.userId);
            if (studentToUpdate) {
                const currentCourses = studentToUpdate.enrolledSubjectIds || [];
                if (!currentCourses.includes(enrollForm.courseId)) {
                    await updateDoc(studentRef, {
                        enrolledSubjectIds: [...currentCourses, enrollForm.courseId]
                    });
                }
            }
            toast.success("Student enrolled manually successfully!");
            fetchStudents();
            setEnrollForm({ userId: "", courseId: "" });
        } catch (e: any) {
            toast.error(e.message || "Failed to enroll user");
        } finally {
            setIsEnrolling(false);
        }
    };

    const [isSavingAccess, setIsSavingAccess] = useState(false);
    const handleSaveAccess = async () => {
        if (!editingStudent) return;
        setIsSavingAccess(true);
        try {
            await updateDoc(doc(db, 'students', editingStudent.id), {
                enrolledSubjectIds: enrolledCourseIds
            });
            toast.success("Student access updated successfully!");
            setEditOpen(false);
            fetchStudents();
        } catch (e: any) {
            toast.error(e.message || "Failed to update access");
        } finally {
            setIsSavingAccess(false);
        }
    };

    const [isResetting, setIsResetting] = useState<string | null>(null);
    const handleResetDevices = async (studentId: string) => {
        setIsResetting(studentId);
        try {
            await updateDoc(doc(db, 'students', studentId), {
                devices: []
            });
            toast.success("Device sessions reset successfully!");
            fetchStudents();
        } catch (e: any) {
            toast.error(e.message || "Failed to reset devices list");
        } finally {
            setIsResetting(null);
        }
    };

    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const handleDelete = async (studentId: string) => {
        setIsDeleting(studentId);
        try {
            // 1. Delete student progress (if exists)
            await deleteDoc(doc(db, 'student_progress', studentId)).catch(() => {});
            // 2. Delete the student profile
            await deleteDoc(doc(db, 'students', studentId));
            
            toast.success("Student deleted successfully!");
            fetchStudents();
        } catch (e: any) {
            console.error("Firestore Delete Error:", e);
            toast.error(e.message || "Failed to delete student");
        } finally {
            setIsDeleting(null);
        }
    };

    useEffect(() => {
        if (editingStudent) {
            setEnrolledCourseIds(editingStudent.enrolledSubjectIds || []);
        }
    }, [editingStudent]);

    const filteredStudents = students.filter((s: any) =>
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
                        <Button onClick={handleEnroll}
                            disabled={!enrollForm.userId || !enrollForm.courseId || isEnrolling}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                            {isEnrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll"}
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
                        <p className="text-sm mt-1">Students will appear here once they sign up via Firebase Auth.</p>
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
                                        <td className="px-4 py-3 text-slate-500">{student.createdAt ? new Date(student.createdAt?.seconds ? student.createdAt.seconds * 1000 : student.createdAt).toLocaleDateString() : "N/A"}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full text-xs min-w-[24px]">
                                                {student.enrolledSubjectIds?.length || 0}
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
                                                            handleResetDevices(student.id);
                                                        }
                                                    }}
                                                    disabled={isResetting === student.id}
                                                    title="Reset Devices">
                                                    <RefreshCcw className="w-4 h-4" />
                                                </Button>

                                                <Button variant="ghost" size="icon"
                                                    className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (window.confirm(`Are you absolutely sure you want to delete student ${student.name}? This will remove all their enrollments and data.`)) {
                                                            handleDelete(student.id);
                                                        }
                                                    }}
                                                    disabled={isDeleting === student.id}
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
                                    {courses.map((course: any) => (
                                        <label key={course.id} className="flex items-center gap-3 p-2 hover:bg-white rounded border border-transparent hover:border-slate-200 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                checked={enrolledCourseIds.includes(course.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setEnrolledCourseIds([...enrolledCourseIds, course.id]);
                                                    } else {
                                                        setEnrolledCourseIds(enrolledCourseIds.filter(id => id !== course.id));
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
                                <Button onClick={handleSaveAccess} disabled={isSavingAccess} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {isSavingAccess ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : "Save Access"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}

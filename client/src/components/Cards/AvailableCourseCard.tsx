import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";

export function AvailableCourseCard({ course, studentId }: { course: any; studentId: string }) {
    const utils = trpc.useUtils();
    const enrollMutation = trpc.admin.enrollUser.useMutation({
        onSuccess: () => {
            toast.success("Enrolled successfully! 🎉");
            utils.admin.getEnrolledCourses.invalidate({ userId: studentId });
        },
        onError: (e) => toast.error(e.message),
    });

    return (
        <Card className="group overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 bg-white rounded-2xl">
            <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
                {course.imageUrl ? (
                    <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <CardContent className="p-5">
                <h3 className="font-bold text-slate-900 leading-snug mb-1 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description || "Learn from industry experts."}</p>
                <div className="flex items-center gap-2">
                    {course.priceEgp === 0 && course.priceUsd === 0 ? (
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl h-9 text-sm"
                            onClick={() => enrollMutation.mutate({ userId: studentId, courseId: course.id })}
                            disabled={enrollMutation.isPending}
                        >
                            {enrollMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll Free"}
                        </Button>
                    ) : (
                        <Link href={`/courses`} className="flex-1">
                            <Button variant="outline" className="w-full rounded-xl h-9 text-sm border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                                View Details
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

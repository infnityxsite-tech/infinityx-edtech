import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle } from "lucide-react";

export function EnrolledCourseCard({ course }: { course: any }) {
    return (
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
            <div className="relative h-44 bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
                {course.imageUrl ? (
                    <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full uppercase tracking-wide">
                        {course.courseType || "Recorded"}
                    </span>
                </div>
            </div>
            <CardContent className="p-5">
                <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 line-clamp-2">{course.title}</h3>
                {course.instructor && (
                    <p className="text-sm text-slate-500 mb-4">By {course.instructor}</p>
                )}
                <Link href={`/learn/${course.id}`}>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 justify-center h-10">
                        <PlayCircle className="w-4 h-4" />
                        Continue Learning
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

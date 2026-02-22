import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Globe, Wifi } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { CourseCard } from "@/components/Cards/CourseCard";

export default function CoursesLive() {
    const { data: allCourses = [], isLoading } = trpc.admin.getCourses.useQuery();
    const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const liveOnly = (allCourses as any[]).filter((c: any) => c.courseType === "Live");

    const filtered = liveOnly.filter((course: any) => {
        const matchesCat = selectedCategory === "All" || course.category === selectedCategory;
        const q = searchQuery.toLowerCase();
        const matchesQ = !q || course.title?.toLowerCase().includes(q) || course.description?.toLowerCase().includes(q);
        return matchesCat && matchesQ;
    });

    const categories = ["All", "Artificial Intelligence & Applications", "Web Development", "Cybersecurity", "Data Science", "Mobile Development"];

    const { studentId } = useStudentAuth();
    const { data: enrolledCourses = [] } = trpc.admin.getEnrolledCourses.useQuery(
        studentId ? { userId: studentId } : (undefined as any),
        { enabled: !!studentId }
    );
    const enrolledIds = new Set((enrolledCourses as any[]).map(c => c.id));

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navigation />

            {/* HEADER */}
            <section className="bg-[#0b1120] text-white pt-28 pb-12 overflow-hidden border-b-4 border-orange-500">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4 text-orange-400">
                        <Wifi className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Live Sessions
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light mb-8">
                        Interactive, instructor-led cohorts with strict schedules and deep collaboration.
                    </p>

                    <div className="w-full max-w-xl relative">
                        <Search className="h-5 w-5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 border border-slate-700/50 rounded-xl bg-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white/20 focus:ring-1 focus:ring-orange-500"
                            placeholder="Search live batches..." />
                    </div>
                </div>
            </section>

            {/* FILTERS */}
            <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-orange-400">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        {(["EGP", "USD"] as const).map(cur => (
                            <button key={cur} onClick={() => setCurrency(cur)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all
                  ${currency === cur ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                                {cur}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <main className="py-12 px-6 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
                        <p className="text-slate-500 font-medium">Loading live schedules...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
                        <Globe className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700">No live sessions found</h3>
                        <p className="text-slate-400 mt-2 text-sm">We don't have active cohorts matching this criteria.</p>
                        <Button variant="outline" className="mt-4 border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                            Reset Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-start">
                        {filtered.map((course: any) => (
                            <CourseCard key={course.id} course={course} currency={currency} isEnrolled={enrolledIds.has(course.id)} studentId={studentId} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

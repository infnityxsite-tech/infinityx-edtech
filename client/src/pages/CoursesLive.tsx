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
            <section className="relative bg-[#0b1120] text-white pt-36 pb-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 text-orange-400 shadow-inner border border-orange-500/30">
                        <Wifi className="w-8 h-8 drop-shadow-md" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
                        Live Sessions
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light mb-10 leading-relaxed">
                        Interactive, instructor-led cohorts with strict schedules and deep collaboration.
                    </p>

                    <div className="w-full max-w-2xl relative group">
                        <Search className="h-6 w-6 text-slate-400 absolute left-4 top-4 pointer-events-none group-focus-within:text-orange-400 transition-colors" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="block w-full pl-14 pr-6 py-4 border border-slate-700/50 rounded-2xl bg-white/5 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-orange-500/60 backdrop-blur-md shadow-2xl transition-all text-lg"
                            placeholder="Search live batches..." />
                    </div>
                </div>
            </section>

            {/* FILTERS */}
            <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-auto text-sm font-medium border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:border-orange-300 transition-all cursor-pointer">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 shadow-inner">
                        {(["EGP", "USD"] as const).map(cur => (
                            <button key={cur} onClick={() => setCurrency(cur)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all
                  ${currency === cur ? "bg-white text-orange-700 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}>
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

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Clock,
  BarChart,
  ChevronRight,
  Search,
  CheckCircle2,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Link } from "wouter";

// 🌟 Sub-component to handle individual card state (Read More toggle)
const CourseCard = ({ course, currency }: { course: any, currency: "EGP" | "USD" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className="group flex flex-col border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden rounded-xl h-fit"
    >
      {/* Image Section */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden bg-slate-100">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
            <Globe className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-xs font-medium">No Preview</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
            <Badge className="bg-white/95 text-slate-900 backdrop-blur text-xs font-bold px-3 py-1 shadow-sm border-0">
              {course.category || "Course"}
            </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-1 p-6 flex flex-col">
        {/* Metadata Row */}
        <div className="flex items-center gap-4 mb-4">
          {course.level && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
              <BarChart className="w-3.5 h-3.5 text-blue-500" />
              {course.level}
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              {course.duration}
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors">
          {course.title}
        </h3>
        
        {/* ✅ FIXED: Description with Read More Toggle */}
        <div className="mb-4">
          <div className={`text-slate-600 text-sm leading-relaxed whitespace-pre-line ${isExpanded ? '' : 'line-clamp-4'}`}>
            {course.description}
          </div>
          
          {/* Show toggle button only if text is likely long enough */}
          {course.description && course.description.length > 150 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 text-xs font-semibold mt-2 flex items-center gap-1 focus:outline-none"
            >
              {isExpanded ? (
                <>Show Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read More <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        <ul className="mb-6 space-y-1.5 border-t border-slate-100 pt-4 mt-auto">
          <li className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span>Industry-standard curriculum</span>
          </li>
          <li className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span>Hands-on projects & labs</span>
          </li>
        </ul>

        {/* Price & Buttons Row */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Tuition</p>
              <div className="text-xl font-bold text-slate-900">
              {currency === "EGP" ? (
                  Number(course.priceEgp) > 0 ? `${Number(course.priceEgp).toLocaleString()} EGP` : <span className="text-emerald-600">Free</span>
              ) : (
                  Number(course.priceUsd) > 0 ? `$${Number(course.priceUsd).toLocaleString()}` : <span className="text-emerald-600">Free</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Syllabus Button */}
            {course.courseLink ? (
              <Button variant="outline" asChild className="w-full border-slate-200 hover:bg-slate-50 hover:text-blue-700 h-10">
                <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                  <span>Syllabus</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            ) : (
                <Button variant="outline" disabled className="w-full opacity-50 h-10">
                  Syllabus
                </Button>
            )}

            {/* Enroll Button */}
            <Button asChild className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-all shadow-lg shadow-slate-900/10 h-10">
              <Link href={`/apply?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}`}>
                Enroll
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Courses() {
  const { data: courses = [], isLoading } = trpc.admin.getCourses.useQuery();
  const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course: any) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      course.title?.toLowerCase().includes(searchLower) || 
      course.description?.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    "Artificial Intelligence & Applications",
    "Web Development", 
    "Cybersecurity"
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation />

      {/* 🏛️ HERO SECTION */}
      <section className="relative bg-[#0b1120] text-white pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Accepting Applications for 2025
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            World-Class Tech Education
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Advanced curriculum designed by industry leaders. Master the tools that power the modern world.
          </p>

          <div className="max-w-xl mx-auto relative group z-20">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 border border-slate-700/50 rounded-xl leading-5 bg-white/10 text-slate-200 placeholder-slate-400 backdrop-blur-sm focus:outline-none focus:bg-white/20 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm shadow-xl" 
              placeholder="Search for courses (e.g., Python, React, AI...)" 
            />
          </div>
        </div>
      </section>

      {/* 🎛️ FILTER BAR */}
      <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    selectedCategory === category
                      ? "bg-[#0f172a] text-white border-[#0f172a] shadow-md ring-2 ring-offset-2 ring-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
              <button
                onClick={() => setCurrency("EGP")}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  currency === "EGP" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                EGP
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  currency === "USD" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                USD
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 📚 COURSES GRID */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading curriculum...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No courses found</h3>
            <p className="text-slate-500 mt-2">
              We couldn't find matches for "{searchQuery}" in this category.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}>
              Reset Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {filteredCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} currency={currency} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
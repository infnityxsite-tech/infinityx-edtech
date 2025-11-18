import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Clock,
  Users,
  BookOpen,
  DollarSign,
} from "lucide-react";
import { Link } from "wouter";

export default function Courses() {
  const { data: courses = [], isLoading } = trpc.admin.getCourses.useQuery();
  const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter courses by category
  const filteredCourses = selectedCategory === "All" 
    ? courses 
    : courses.filter((course: any) => course.category === selectedCategory);

  const categories = [
    "All",
    "Artificial Intelligence & Applications",
    "Web Development",
    "Cybersecurity"
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-24 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-3">Explore Our Courses</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Learn from top instructors, master cutting-edge technologies, and
            build real-world skills in Artificial Intelligence, Web Development,
            and Cybersecurity.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTERS & CURRENCY TOGGLE */}
      <section className="bg-slate-50 py-6">
        <div className="max-w-6xl mx-auto px-6">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-slate-700 font-medium">View prices in:</span>
            <Button
              variant={currency === "EGP" ? "default" : "outline"}
              onClick={() => setCurrency("EGP")}
            >
              🇪🇬 EGP
            </Button>
            <Button
              variant={currency === "USD" ? "default" : "outline"}
              onClick={() => setCurrency("USD")}
            >
              💵 USD
            </Button>
          </div>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                No courses available in this category yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredCourses.map((course: any) => (
                <Card
                  key={course.id}
                  className="hover:shadow-xl transition border border-slate-200 flex flex-col"
                >
                  {course.imageUrl && (
                    <div className="relative">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {/* Course Type Badge */}
                      {course.courseType && (
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                          course.courseType === "Professional Diploma" 
                            ? "bg-purple-600 text-white" 
                            : "bg-green-600 text-white"
                        }`}>
                          {course.courseType}
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-blue-700">
                      {course.title}
                    </CardTitle>
                    <CardDescription>{course.level}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {course.description}
                      </p>
                      {course.courseLink && (
                        <a
                          href={course.courseLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                        >
                          📖 Know More →
                        </a>
                      )}
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        {course.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            {course.duration}
                          </div>
                        )}
                        {course.instructor && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            {course.instructor}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PRICE SECTION */}
                    <div className="mt-4 flex items-center justify-between">
                      {course.priceEgp || course.priceUsd ? (
                        <div className="flex items-center gap-2 text-blue-700 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {currency === "EGP"
                            ? `🇪🇬 ${course.priceEgp?.toLocaleString()} EGP`
                            : `💵 $${course.priceUsd?.toLocaleString()}`}
                        </div>
                      ) : (
                        <p className="text-green-600 font-semibold">Free</p>
                      )}

                      {/* APPLY NOW BUTTON */}
                      <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-1"
                      >
                        <Link
                          href={`/apply?courseId=${
                            course.id
                          }&courseName=${encodeURIComponent(course.title)}`}
                        >
                          <BookOpen className="w-4 h-4" />
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

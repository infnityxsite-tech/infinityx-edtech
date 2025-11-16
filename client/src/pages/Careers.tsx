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
import { Loader2, BookOpen, Clock, DollarSign, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Courses() {
  const { data: courses = [], isLoading } = trpc.admin.getCourses.useQuery();
  const [location, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Explore Our Professional Courses</h1>
          <p className="text-blue-100 text-lg">
            Empower your future with practical AI, data, and technology education.
          </p>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Hands-On Learning</h3>
            <p className="text-slate-600">
              Learn by doing through projects, mentorship, and real-world case studies.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-slate-600">
              Get guidance from professionals with real industry experience.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Career-Oriented</h3>
            <p className="text-slate-600">
              Gain skills that matter — prepare for your dream job in tech and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Available Courses</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No courses available at the moment.</p>
              <p className="text-slate-500 mt-2">Please check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course: any) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition border border-slate-200"
                >
                  <CardHeader>
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <CardTitle className="text-2xl text-blue-700 mb-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {course.description || "No description available."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                      {course.level && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {course.level}
                        </div>
                      )}
                      {course.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                      )}
                    </div>

                    <p className="text-blue-700 font-semibold text-lg flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {course.price
                        ? `${course.price} ${course.currency === "USD" ? "USD" : "EGP"}`
                        : "Free"}
                    </p>

                    <Button
                      onClick={() => navigate(`/apply/${course.id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <CheckCircle2 className="w-14 h-14 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Skills?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start your journey with InfinityX today — learn, grow, and lead the future.
          </p>
          <Button
            onClick={() => navigate("/programs")}
            className="bg-white text-blue-700 font-semibold hover:bg-blue-100"
          >
            Explore Our Programs
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
          <p className="text-lg font-semibold">InfinityX EdTech Platform</p>
          <p className="text-blue-200">infnityx.site@gmail.com • +20 109 036 4947</p>
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} InfinityX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

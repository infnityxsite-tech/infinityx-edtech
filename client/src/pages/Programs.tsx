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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Clock,
  Award,
  Search,
  Rocket,
  GraduationCap,
  Layers,
  Brain,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Programs() {
  const { data: programs = [], isLoading } = trpc.admin.getPrograms.useQuery();
  const [query, setQuery] = useState("");
  const [location, navigate] = useLocation();

  const filteredPrograms = programs.filter((program: any) =>
    program.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-24 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-3">InfinityX Specialized Programs</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Advance your career with expert-led, industry-focused programs in AI, Data Science,
            and emerging technologies.
          </p>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Career-Focused Learning</h3>
            <p className="text-slate-600">
              Programs designed to bridge the gap between academia and industry with hands-on training.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Curriculum</h3>
            <p className="text-slate-600">
              Learn cutting-edge technologies guided by artificial intelligence and expert mentors.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Layers className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stackable Skills</h3>
            <p className="text-slate-600">
              Earn certifications and stack your learning path for advanced programs.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a program (e.g., AI, Robotics, Space Technology)"
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setQuery("")}
            className="text-slate-700"
          >
            Reset
          </Button>
        </div>
      </section>

      {/* PROGRAMS GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Available Programs</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                No matching programs found. Try a different search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPrograms.map((program: any) => (
                <Card
                  key={program.id}
                  className="hover:shadow-xl transition border border-slate-200 flex flex-col"
                >
                  {program.imageUrl && (
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-blue-700">
                      {program.title}
                    </CardTitle>
                    <CardDescription>
                      {program.duration || "Flexible Duration"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {program.description || "No description available."}
                    </p>

                    {program.skills && (
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-700 flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" /> Skills You’ll Gain:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {program.skills.split(",").map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* APPLY BUTTON */}
                    <Button
                      onClick={() =>
                        navigate(
                          `/apply/${program.id}?courseName=${encodeURIComponent(
                            program.title
                          )}`
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <Rocket className="w-10 h-10 mx-auto text-blue-200 mb-3" />
          <h2 className="text-4xl font-bold mb-3">
            Start Your Professional Journey with InfinityX
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-6">
            Learn with experts, grow with community, and gain certifications that shape your career.
          </p>
          <Button
            className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 font-semibold"
            onClick={() => navigate("/courses")}
          >
            View All Courses
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg font-semibold mb-2">InfinityX EdTech Platform</p>
          <p className="text-blue-200">infnityx.site@gmail.com • +20 109 036 4947</p>
          <p className="text-slate-400 text-sm mt-2">
            &copy; {new Date().getFullYear()} InfinityX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

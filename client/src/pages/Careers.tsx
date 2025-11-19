import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, MapPin, Clock, Users, Rocket, Heart, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

// تعريف شكل الوظيفة بناءً على ملف db.ts
interface JobListing {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  type: string | null;
}

export default function Careers() {
  // 1. الاتصال الصحيح بناءً على ملف routers.ts
  const { data: jobs = [], isLoading } = trpc.admin.getJobListings.useQuery(); 
  const [location, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-emerald-100 text-lg">
            Help us shape the future of education technology. Work on things that matter.
          </p>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Rocket className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Innovation First</h3>
            <p className="text-slate-600">
              Work with cutting-edge AI and data tools to build the next generation of EdTech.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Great Culture</h3>
            <p className="text-slate-600">
              Join a diverse, supportive team that values growth, mentorship, and collaboration.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Work-Life Balance</h3>
            <p className="text-slate-600">
              Flexible working hours and remote options to help you perform at your best.
            </p>
          </div>
        </div>
      </section>

      {/* JOB LISTINGS SECTION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Open Positions</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No open positions at the moment.</p>
              <p className="text-slate-500 mt-2">We are always growing, so check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* هنا بنعرض الوظائف الحقيقية من قاعدة البيانات */}
              {jobs.map((job: any) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition border border-slate-200 group"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* Job Info */}
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-xl text-emerald-800 group-hover:text-emerald-600 transition-colors">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 line-clamp-2">
                        {job.description || "No description provided."}
                      </CardDescription>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-3">
                        {/* عرض نوع الوظيفة لو موجود */}
                        {job.type && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                            <Briefcase className="w-3.5 h-3.5" />
                            {job.type}
                          </div>
                        )}
                        {/* عرض المكان لو موجود */}
                        {job.location && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      <Button
                        onClick={() => navigate(`/apply/${job.id}?type=job`)}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
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
          <h2 className="text-4xl font-bold mb-4">Not seeing the right fit?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            We're always looking for talent. Send us your CV and we'll keep you in mind for future roles.
          </p>
          <Button
            onClick={() => navigate("/contact")}
            className="bg-white text-blue-700 font-semibold hover:bg-blue-100"
          >
            Contact Us
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-10 mt-auto">
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
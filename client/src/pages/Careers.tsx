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
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Rocket, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Globe,
  Zap
} from "lucide-react";
import { useLocation, Link } from "wouter";

export default function Careers() {
  const { data: jobs = [], isLoading } = trpc.admin.getJobListings.useQuery(); 
  const [location, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation />

      {/* 🏛️ HERO SECTION */}
      <section className="relative bg-[#0b1120] text-white pt-36 pb-24 overflow-hidden">
        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        
        {/* Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>We are hiring!</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Build the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">EdTech.</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            Join a team of innovators, engineers, and educators dedicated to transforming how the world learns Artificial Intelligence and Space Tech.
          </p>

          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-full px-8" onClick={() => {
                document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' });
            }}>
                View Open Roles
            </Button>
          </div>
        </div>
      </section>

      {/* 🌟 CULTURE / VALUES SECTION */}
      <section className="py-20 relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Value 1 */}
                <Card className="border border-slate-200 shadow-lg bg-white/95 backdrop-blur">
                    <CardContent className="p-8 text-center">
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <Rocket className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation First</h3>
                        <p className="text-slate-600 leading-relaxed">
                            We don't just teach tech; we build it. Work with cutting-edge AI, Satellite Data, and modern stacks.
                        </p>
                    </CardContent>
                </Card>

                {/* Value 2 */}
                <Card className="border border-slate-200 shadow-lg bg-white/95 backdrop-blur">
                    <CardContent className="p-8 text-center">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Collaborative Culture</h3>
                        <p className="text-slate-600 leading-relaxed">
                            No silos. Engineers, instructors, and designers work together to create world-class experiences.
                        </p>
                    </CardContent>
                </Card>

                {/* Value 3 */}
                <Card className="border border-slate-200 shadow-lg bg-white/95 backdrop-blur">
                    <CardContent className="p-8 text-center">
                        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">High Impact</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Your code and content will directly impact thousands of students launching their careers.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>

      {/* 📋 JOB LISTINGS */}
      <section id="open-roles" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Open Positions</h2>
                <p className="text-slate-500 mt-2">Find your next challenge.</p>
            </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No open roles right now</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              We are currently fully staffed, but we are always looking for talent. Check back soon or email us your resume.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <div 
                key={job.id}
                className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {job.title}
                        </h3>
                        {job.type && (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                {job.type}
                            </Badge>
                        )}
                    </div>
                    
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4 max-w-2xl">
                        {job.description || "Join our team to help build the next generation of education technology."}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        {job.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Posted Recently</span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <Button 
                        onClick={() => navigate(`/apply/${job.id}?type=job`)}
                        className="w-full md:w-auto bg-slate-900 hover:bg-emerald-600 text-white font-medium px-6 py-2 h-10 transition-colors"
                    >
                        Apply Now
                    </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 📧 CTA SECTION */}
      <section className="py-24 bg-[#020617] text-white text-center mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 mb-6 px-3 py-1">General Application</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Don't see the right fit?</h2>
          <p className="text-slate-400 mb-8 text-lg max-w-xl mx-auto">
            We are always growing. Send us your portfolio and CV, and we'll keep you in mind for future roles.
          </p>
          <Button 
            onClick={() => navigate("/contact")}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 shadow-lg shadow-emerald-900/50"
          >
            Contact Recruitment Team <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="text-2xl font-bold tracking-tight">Infinity<span className="text-emerald-500">X</span></div>
          <div className="flex gap-6 text-sm text-slate-400">
             <Link href="/courses" className="hover:text-white transition">Courses</Link>
             <Link href="/about" className="hover:text-white transition">About</Link>
             <Link href="/blog" className="hover:text-white transition">Blog</Link>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            &copy; {new Date().getFullYear()} InfinityX EdTech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
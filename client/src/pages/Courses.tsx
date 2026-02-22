import Navigation from "@/components/Navigation";
import { Link } from "wouter";
import { Video, Wifi, ArrowRight } from "lucide-react";

export default function Courses() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation />

      {/* HERO */}
      <section className="relative bg-[#0b1120] text-white pt-36 pb-32 overflow-hidden text-center z-10">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Choose Your Path
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-5">
            World-Class Tech Education
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light mb-10">
            Select your learning style: Interactive Live Sessions or Self-Paced Recorded Courses.
          </p>
        </div>
      </section>

      {/* SELECTION CARDS */}
      <main className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-8 relative z-10">
        <Link href="/courses/live">
          <div className="bg-white rounded-2xl p-10 cursor-pointer border border-slate-200 shadow-xl hover:shadow-2xl hover:border-orange-300 transition-all group flex flex-col items-center text-center h-full">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform">
              <Wifi className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Live Sessions</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Join interactive, instructor-led cohorts. Get real-time feedback, collaborate with peers, and follow a structured schedule.
            </p>
            <div className="mt-auto flex items-center text-orange-600 font-bold group-hover:translate-x-2 transition-transform">
              Explore Live Programs <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </div>
        </Link>

        <Link href="/courses/recorded">
          <div className="bg-white rounded-2xl p-10 cursor-pointer border border-slate-200 shadow-xl hover:shadow-2xl hover:border-indigo-300 transition-all group flex flex-col items-center text-center h-full">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
              <Video className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Recorded Courses</h2>
            <p className="text-slate-500 mb-8 leading-relaxed flex-1">
              Pre-recorded, high-quality video lessons. Learn at your own pace, anytime, anywhere. Full lifetime access.
            </p>
            <div className="mt-auto flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
              Explore Curriculum <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </div>
        </Link>
      </main>
    </div>
  );
}
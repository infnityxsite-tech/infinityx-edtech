import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Loader2,
  Users,
  Brain,
  Shield,
  Laptop,
  Code,
  Rocket,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery({
    pageKey: "home",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* === HERO SECTION === */}
      <section
        className="relative text-white py-32 md:py-40 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${
            pageContent?.heroImageUrl || "/assets/hero-banner.jpg"
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {pageContent?.headline ||
                "Empowering the Next Generation of Tech Leaders"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              {pageContent?.subHeadline ||
                "Master cutting-edge technologies through hands-on learning, expert mentorship, and real-world projects that prepare you for the future."}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 font-semibold text-lg px-8 py-6"
                >
                  Explore Courses <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold text-lg px-8 py-6"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === STATS SECTION === */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Users className="w-12 h-12 text-white mx-auto mb-3" />
              <p className="text-5xl font-bold mb-2">
                {pageContent?.studentsTrained?.toLocaleString() || "5,000"}+
              </p>
              <p className="text-blue-100 text-lg">Students Trained</p>
            </div>
            <div className="p-6">
              <Laptop className="w-12 h-12 text-white mx-auto mb-3" />
              <p className="text-5xl font-bold mb-2">
                {pageContent?.expertInstructors || 50}+
              </p>
              <p className="text-blue-100 text-lg">Expert Instructors</p>
            </div>
            <div className="p-6">
              <Rocket className="w-12 h-12 text-white mx-auto mb-3" />
              <p className="text-5xl font-bold mb-2">
                {pageContent?.jobPlacementRate || 95}%
              </p>
              <p className="text-blue-100 text-lg">Job Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* === VISION SECTION === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                Our Vision
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                At InfinityX, we envision a future where technology education is accessible, 
                practical, and transformative. We're committed to empowering learners with 
                the skills they need to thrive in the digital age.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Industry-Relevant Curriculum</h3>
                    <p className="text-slate-600">Learn technologies that companies actually use</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Hands-On Projects</h3>
                    <p className="text-slate-600">Build real-world applications from day one</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Expert Mentorship</h3>
                    <p className="text-slate-600">Learn from industry professionals with years of experience</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={pageContent?.visionImageUrl || "/assets/vision-learning.jpg"}
                alt="Vision"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === TECH FIELDS === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Master In-Demand Technologies
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our specialized programs designed to make you job-ready in the most 
              sought-after tech fields
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Card */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                Artificial Intelligence
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Master machine learning, deep learning, and AI applications. Build intelligent 
                systems that solve real-world problems.
              </p>
              <Link href="/courses">
                <Button variant="link" className="text-blue-600 p-0 h-auto font-semibold">
                  Learn More <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Web Dev Card */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                Web Development
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Build modern, responsive web applications using the latest frameworks and 
                technologies. Full-stack expertise guaranteed.
              </p>
              <Link href="/courses">
                <Button variant="link" className="text-blue-600 p-0 h-auto font-semibold">
                  Learn More <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Cybersecurity Card */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                Cybersecurity
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Protect digital assets and infrastructure. Learn ethical hacking, security 
                protocols, and defense strategies.
              </p>
              <Link href="/courses">
                <Button variant="link" className="text-blue-600 p-0 h-auto font-semibold">
                  Learn More <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === CALL TO ACTION === */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of students who have launched successful tech careers with InfinityX. 
            Start your journey today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/courses">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-lg px-8 py-6"
              >
                Browse Courses
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold text-lg px-8 py-6"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">InfinityX EdTech</h3>
              <p className="text-slate-400">
                Empowering the next generation of tech leaders through quality education and mentorship.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/courses"><a className="block text-slate-400 hover:text-white transition">Courses</a></Link>
                <Link href="/programs"><a className="block text-slate-400 hover:text-white transition">Programs</a></Link>
                <Link href="/about"><a className="block text-slate-400 hover:text-white transition">About Us</a></Link>
                <Link href="/contact"><a className="block text-slate-400 hover:text-white transition">Contact</a></Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2 text-slate-400">
                <p>Email: <a href="mailto:infnityx.site@gmail.com" className="hover:text-white transition">infnityx.site@gmail.com</a></p>
                <p>Phone: <a href="tel:+201090364947" className="hover:text-white transition">+20 109 036 4947</a></p>
                <p>Location: Cairo, Egypt</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} InfinityX EdTech Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

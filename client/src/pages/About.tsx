import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Brain,
  Users,
  Rocket,
  Award,
  Target,
  Eye,
  Mail,
  Phone,
} from "lucide-react";

export default function About() {
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery({
    pageKey: "about",
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
        className="relative bg-cover bg-center text-white py-32 md:py-40"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${
            pageContent?.bannerImageUrl || "/assets/about-banner.jpg"
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About InfinityX</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Transforming education through technology, innovation, and a commitment to 
            empowering the next generation of tech leaders.
          </p>
        </div>
      </section>

      {/* === COMPANY STORY === */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Who We Are
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {pageContent?.aboutCompany ||
                "InfinityX is a leading EdTech platform dedicated to making world-class technology education accessible to everyone. We specialize in Artificial Intelligence, Web Development, and Cybersecurity training that prepares students for real-world careers."}
            </p>
          </div>
          {pageContent?.companyImageUrl && (
            <div className="flex justify-center">
              <img
                src={pageContent.companyImageUrl}
                alt="InfinityX Company"
                className="rounded-2xl shadow-2xl w-full max-w-4xl object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* === FOUNDER STORY === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-6 text-blue-700">
                Meet Our Founder
              </h2>
              <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                <p>
                  {pageContent?.founderBio ||
                    "Our founder brings years of experience in technology education and a passion for making quality learning accessible to all. With a background in software engineering and educational technology, they've dedicated their career to bridging the gap between academic learning and industry requirements."}
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                  <p className="italic text-slate-800">
                    "{pageContent?.founderMessage ||
                      "Education is the most powerful tool for transformation. At InfinityX, we're committed to providing every student with the skills and confidence they need to succeed in the tech industry."}"
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={pageContent?.founderImageUrl || "/assets/founder-portrait.jpg"}
                alt="Founder of InfinityX"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === MISSION & VISION === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Our Mission & Vision
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Guided by purpose and driven by innovation
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-2xl shadow-lg border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-blue-700 mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                {pageContent?.missionText ||
                  "To provide accessible, high-quality technology education that empowers learners worldwide to build careers in AI, Web Development, and Cybersecurity. We're committed to bridging the skills gap and creating opportunities for everyone, regardless of their background."}
              </p>
              {pageContent?.missionImageUrl && (
                <img
                  src={pageContent.missionImageUrl}
                  alt="Mission"
                  className="mt-6 rounded-xl shadow-md w-full object-cover"
                />
              )}
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-2xl shadow-lg border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-blue-700 mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                {pageContent?.visionText ||
                  "To become the world's leading platform for technology education, recognized for transforming lives through innovative learning experiences. We envision a future where every aspiring tech professional has the tools, knowledge, and support they need to thrive."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === CORE VALUES === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={<Brain className="w-12 h-12 text-blue-600" />}
              title="Innovation"
              text="We constantly evolve our curriculum and teaching methods to stay ahead of industry trends and provide cutting-edge education."
            />
            <ValueCard
              icon={<Users className="w-12 h-12 text-blue-600" />}
              title="Community"
              text="We build a supportive learning environment where students, instructors, and industry professionals collaborate and grow together."
            />
            <ValueCard
              icon={<Rocket className="w-12 h-12 text-blue-600" />}
              title="Excellence"
              text="We maintain the highest standards in education, ensuring every student receives world-class training and support."
            />
            <ValueCard
              icon={<Award className="w-12 h-12 text-blue-600" />}
              title="Impact"
              text="We measure success by the careers we launch and the lives we transform through quality technology education."
            />
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join our community of learners and take the first step towards a successful tech career.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/courses">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-lg px-8 py-6"
              >
                Explore Courses
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold text-lg px-8 py-6"
              >
                Get in Touch
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
                <Link href="/blog"><a className="block text-slate-400 hover:text-white transition">Blog</a></Link>
                <Link href="/careers"><a className="block text-slate-400 hover:text-white transition">Careers</a></Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:infnityx.site@gmail.com" className="hover:text-white transition">
                    infnityx.site@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <a href="tel:+201090364947" className="hover:text-white transition">
                    +20 109 036 4947
                  </a>
                </div>
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

// ✅ Reusable value card component
function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-slate-100">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-xl mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

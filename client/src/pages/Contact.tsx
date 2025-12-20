import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  Loader2,
  Sparkles,
  Clock,
  Globe,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const createMessage = trpc.admin.createMessage.useMutation({
    onSuccess: () => {
      toast.success("Your message has been sent successfully!");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    },
    onError: () => {
      toast.error("Failed to send your message. Please try again.");
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields before sending your message.");
      return;
    }
    setLoading(true);
    createMessage.mutate({
      name: form.name,
      email: form.email,
      message: form.message,
      messageType: "contact",
    });
  };

  const siteInfo = {
    email: "infnityx.site@gmail.com",
    phone: "+20 110 013 5225",
    whatsapp: "https://wa.me/qr/DPIFTRQ4NI3VP1",
    location: "Cairo, Egypt",
  };

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Support Team</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Conversation.</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            Whether you're a student with questions, a university looking to partner, or just want to say hi — we're here to help.
          </p>
        </div>
      </section>

      {/* 📬 MAIN CONTENT (Grid Layout) */}
      <section className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Contact Info */}
            <div className="space-y-6">
                {/* Info Card */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Email Support</p>
                                <a href={`mailto:${siteInfo.email}`} className="text-slate-900 font-semibold hover:text-blue-600 transition">
                                    {siteInfo.email}
                                </a>
                                <p className="text-xs text-slate-400 mt-1">Replies within 24 hours</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Phone & WhatsApp</p>
                                <a href={`tel:${siteInfo.phone}`} className="text-slate-900 font-semibold hover:text-blue-600 transition block">
                                    {siteInfo.phone}
                                </a>
                                <a href={siteInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-green-600 hover:text-green-700 inline-flex items-center gap-1 mt-1">
                                    <MessageCircle className="w-3 h-3" /> Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Headquarters</p>
                                <p className="text-slate-900 font-semibold">
                                    {siteInfo.location}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Working Hours</p>
                                <p className="text-slate-900 font-medium text-sm">Sun - Thu: 10:00 AM - 06:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Preview (Styled) */}
                <div className="bg-slate-200 rounded-2xl h-64 w-full overflow-hidden border border-slate-300 relative group">
                     {/* Placeholder Map Image or Iframe */}
                     <iframe
                        title="InfinityX Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.163777727914!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzQwLjAiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1630000000000!5m2!1sen!2seg"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(100%)' }}
                        allowFullScreen
                        loading="lazy"
                        className="group-hover:filter-none transition-all duration-500"
                    ></iframe>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                        Cairo, Egypt
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Contact Form */}
            <div className="lg:col-span-2">
                <Card className="border border-slate-200 shadow-xl bg-white h-full">
                    <CardContent className="p-8 lg:p-10">
                         <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
                            <p className="text-slate-500 mt-2">
                                Have a specific inquiry? Fill out the form below and our team will get back to you shortly.
                            </p>
                         </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                        className="bg-slate-50 border-slate-200 focus:bg-white h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                        className="bg-slate-50 border-slate-200 focus:bg-white h-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-semibold text-slate-700">Message</label>
                                <Textarea
                                    id="message"
                                    placeholder="How can we help you?"
                                    rows={8}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    required
                                    className="bg-slate-50 border-slate-200 focus:bg-white resize-none p-4"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-6 text-lg transition-all shadow-lg shadow-slate-900/10"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="text-2xl font-bold tracking-tight">Infinity<span className="text-blue-500">X</span></div>
          <div className="flex gap-6 text-sm text-slate-400">
             <Link href="/courses" className="hover:text-white transition">Courses</Link>
             <Link href="/about" className="hover:text-white transition">About</Link>
             <Link href="/careers" className="hover:text-white transition">Careers</Link>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            &copy; {new Date().getFullYear()} InfinityX EdTech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
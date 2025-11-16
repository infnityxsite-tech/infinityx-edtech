import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
          <span className="font-bold text-lg text-slate-900">{APP_TITLE}</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-slate-700 hover:text-slate-900 transition">
            Home
          </Link>
          <Link href="/about" className="text-slate-700 hover:text-slate-900 transition">
            About
          </Link>
          <Link href="/courses" className="text-slate-700 hover:text-slate-900 transition">
            Courses
          </Link>
          <Link href="/programs" className="text-slate-700 hover:text-slate-900 transition">
            Programs
          </Link>
          <Link href="/blog" className="text-slate-700 hover:text-slate-900 transition">
            Blog
          </Link>
          <Link href="/careers" className="text-slate-700 hover:text-slate-900 transition">
            Careers
          </Link>
          <Link href="/contact">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

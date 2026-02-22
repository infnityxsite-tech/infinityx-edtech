import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";
import { Menu, X, ChevronRight, GraduationCap, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  // Student auth state — read from localStorage
  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    const name = localStorage.getItem("studentName");
    setStudentId(id);
    setStudentName(name);
  }, [location]); // re-run whenever route changes so login/logout is reflected

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location === path;

  const navLinkClass = (path: string) => `
    text-sm font-medium transition-colors duration-200
    ${isActive(path) ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-indigo-600"}
  `;

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    setStudentId(null);
    setStudentName(null);
    navigate("/");
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <img
              src="/uploads/logo_new.png"
              alt={APP_TITLE}
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-indigo-700 transition-colors">
            {APP_TITLE}
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={navLinkClass("/")}>Home</Link>
          <Link href="/about" className={navLinkClass("/about")}>About</Link>
          <Link href="/courses" className={navLinkClass("/courses")}>Courses</Link>
          <Link href="/programs" className={navLinkClass("/programs")}>Programs</Link>
          <Link href="/blog" className={navLinkClass("/blog")}>Blog</Link>
          <Link href="/verify" className={navLinkClass("/verify")}>Verify</Link>
          <Link href="/careers" className={navLinkClass("/careers")}>Careers</Link>

          <div className="pl-2 border-l border-slate-200 flex items-center gap-2">
            {studentId ? (
              // LOGGED IN STATE
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium transition-colors">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      {(studentName || "S").charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{studentName}</span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // LOGGED OUT STATE
              <Link href="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-full px-5 h-9 text-sm font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/contact">
              <Button className="bg-slate-900 hover:bg-indigo-600 text-white shadow-lg shadow-slate-900/10 transition-all rounded-full px-6 h-10 text-xs font-bold uppercase tracking-wide">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col p-6 space-y-4">
            {["Home", "About", "Courses", "Programs", "Blog", "Verify", "Careers"].map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <Link key={path} href={path}>
                  <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isActive(path) ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"}`}>
                    <span className="font-medium">{item}</span>
                    {isActive(path) && <ChevronRight className="w-4 h-4" />}
                  </div>
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
              {studentId ? (
                <>
                  <Link href="/dashboard">
                    <Button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 h-12 text-base flex items-center gap-2 justify-center" variant="ghost">
                      <LayoutDashboard className="w-5 h-5" />
                      My Dashboard ({studentName})
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50">
                    <LogOut className="w-5 h-5 mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base flex items-center gap-2 justify-center">
                    <GraduationCap className="w-5 h-5" /> Sign In to Portal
                  </Button>
                </Link>
              )}
              <Link href="/contact">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
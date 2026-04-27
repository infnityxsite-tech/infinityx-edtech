import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Briefcase,
  FileText,
  Settings,
  Users,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  Globe,
  Phone,
  Mail,
  MessageCircle,
  Trash2,
  Calendar,
  Sparkles,
  Award,
  Building,
  ArrowLeft,
  Save,
  Loader2,
  Menu,
  X
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import PageContentManager from "@/components/admin/PageContentManager";
import CoursesManager from "@/components/admin/CoursesManager";
import BlogManager from "@/components/admin/BlogManager";
import CareersManager from "@/components/admin/CareersManager";
import MessagesManager from "@/components/admin/MessagesManager";
import CertificatesManager from "@/components/admin/CertificatesManager";
import SponsorsManager from "@/components/admin/SponsorsManager";
import StudentManager from "@/components/admin/StudentManager";
import LeadsManager from "@/components/admin/LeadsManager";
import ServicesManager from "@/components/admin/ServicesManager";
import CaseStudiesManager from "@/components/admin/CaseStudiesManager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

// Menu items config (with generic English labels that will be translated in render)
const MENU_ITEMS = [
  { key: "overview", label: "Overview", label_ar: "نظرة عامة", icon: LayoutDashboard, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { key: "courses", label: "Courses", label_ar: "الدورات", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { key: "students", label: "Students", label_ar: "الطلاب", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { key: "leads", label: "B2B Leads", label_ar: "العملاء المحتملين", icon: Phone, color: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/20" },
  { key: "services", label: "Services", label_ar: "الخدمات", icon: Sparkles, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
  { key: "case-studies", label: "Case Studies", label_ar: "دراسات الحالة", icon: FileText, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { key: "certificates", label: "Certificates", label_ar: "الشهادات", icon: Award, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { key: "sponsors", label: "Sponsors", label_ar: "الرعاة", icon: Building, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { key: "page-content", label: "Pages", label_ar: "الصفحات", icon: FileText, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  { key: "blog", label: "Blog", label_ar: "المدونة", icon: FileText, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { key: "careers", label: "Careers", label_ar: "الوظائف", icon: Briefcase, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  { key: "applications", label: "Applications", label_ar: "الطلبات", icon: ClipboardList, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { key: "messages", label: "Messages", label_ar: "الرسائل", icon: Mail, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { key: "site-settings", label: "Settings", label_ar: "الإعدادات", icon: Settings, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
];

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [appTab, setAppTab] = useState("course");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    footerText: "",
    default_theme: "dark",
    default_language: "en",
  });

  const [settingsDirty, setSettingsDirty] = useState(false);

  const utils = trpc.useUtils();

  const { data: applications = [] } = trpc.admin.getApplications.useQuery();
  const { data: siteSettings = {} } = trpc.admin.getSiteSettings.useQuery();

  useEffect(() => {
    if (siteSettings) {
      setSettings({
        email: (siteSettings as any)?.email || "",
        phone: (siteSettings as any)?.phone || "",
        whatsapp: (siteSettings as any)?.whatsapp || "",
        footerText: (siteSettings as any)?.footerText || "",
        default_theme: (siteSettings as any)?.default_theme || "dark",
        default_language: (siteSettings as any)?.default_language || "en",
      });
    }
  }, [siteSettings]);

  const { data: messages = [] } = trpc.admin.getMessages.useQuery();

  const updateSettingMutation = trpc.admin.updateSiteSettings.useMutation({
    onSuccess: () => {
      toast.success("✅ Settings saved successfully!");
      utils.admin.getSiteSettings.invalidate();
      setSettingsDirty(false);
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const deleteApplicationMutation = trpc.admin.deleteApplication.useMutation({
    onSuccess: () => {
      toast.success("Application deleted!");
      utils.admin.getApplications.invalidate();
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a]">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
      </div>
    );
  }

  const isLocalAdmin = localStorage.getItem("isAdminLoggedIn") === "true";
  if (!user && !isLocalAdmin) {
    navigate("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout?.();
    } catch { }
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };

  const handleSettingFieldChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
    setSettingsDirty(true);
  };

  const handleSaveSettings = () => {
    updateSettingMutation.mutate({ settings });
  };

  const activeMenuItem = MENU_ITEMS.find(m => m.key === activeTab);

  return (
    <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#0a0e1a] text-white"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* HEADER */}
      <header className={`${isLight ? "bg-white/90 border-slate-200" : "bg-[#0d1225]/90 border-white/[0.06]"} backdrop-blur-xl border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeTab !== "overview" && (
              <button
                onClick={() => setActiveTab("overview")}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
            )}
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                {t("InfinityX Admin", "لوحة تحكم InfinityX", "InfinityX Admin")}
              </h1>
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                {t("Welcome, ", "أهلاً، ", "Welcome, ")}{user?.name || t("Administrator", "المدير", "Administrator")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${isLight ? "bg-slate-100 border-slate-200" : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className={`${isLight ? "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 border-slate-200 hover:border-red-200" : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-red-500/10 border-white/[0.06] hover:border-red-500/20"} flex items-center gap-2 text-sm`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-40 ${isLight ? "bg-white/95" : "bg-[#0a0e1a]/95"} backdrop-blur-xl md:hidden pt-20 px-4 overflow-y-auto`}>
          <div className="grid grid-cols-2 gap-3">
            {MENU_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key); setMobileMenuOpen(false); }}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    activeTab === item.key
                      ? `${item.bg} ${item.border} border`
                      : `${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06] hover:border-white/[0.12]"}`
                  }`}
                >
                  <Icon className={`w-6 h-6 ${item.color} mb-2`} />
                  <span className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-white"}`}>{t(item.label, item.label_ar, item.label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* OVERVIEW — Card Grid Navigation */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>{t("Dashboard", "لوحة التحكم", "Dashboard")}</h2>
              <p className="text-slate-500">{t("Select a section to manage your platform", "حدد قسمًا لإدارة منصتك", "Select a section to manage your platform")}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {MENU_ITEMS.filter(m => m.key !== "overview").map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`group ${item.bg} ${item.border} border rounded-2xl p-5 md:p-6 text-center transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${isLight ? "bg-white" : ""}`}>
                      <Icon className={`w-6 h-6 md:w-7 md:h-7 ${item.color}`} />
                    </div>
                    <h3 className={`text-sm md:text-base font-semibold ${isLight ? "text-slate-800" : "text-white"}`}>{t(item.label, item.label_ar, item.label)}</h3>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06]"} border rounded-xl p-4 text-center`}>
                <p className="text-2xl font-bold text-cyan-400">{applications.length}</p>
                <p className="text-xs text-slate-500 mt-1">Applications</p>
              </div>
              <div className={`${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06]"} border rounded-xl p-4 text-center`}>
                <p className="text-2xl font-bold text-blue-400">{(messages as any[]).length}</p>
                <p className="text-xs text-slate-500 mt-1">Messages</p>
              </div>
              <div className={`${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06]"} border rounded-xl p-4 text-center`}>
                <p className="text-2xl font-bold text-emerald-400">—</p>
                <p className="text-xs text-slate-500 mt-1">Active Students</p>
              </div>
              <div className={`${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06]"} border rounded-xl p-4 text-center`}>
                <p className="text-2xl font-bold text-purple-400">—</p>
                <p className="text-xs text-slate-500 mt-1">Courses</p>
              </div>
            </div>
          </div>
        )}

        {/* Sub-page header */}
        {activeTab !== "overview" && (
          <div className="mb-6 flex items-center gap-3">
            {activeMenuItem && (
              <>
                <div className={`w-10 h-10 rounded-lg ${activeMenuItem.bg} border ${activeMenuItem.border} flex items-center justify-center`}>
                  <activeMenuItem.icon className={`w-5 h-5 ${activeMenuItem.color}`} />
                </div>
                <h2 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{t(activeMenuItem.label, activeMenuItem.label_ar, activeMenuItem.label)}</h2>
              </>
            )}
          </div>
        )}

        {/* CERTIFICATES */}
        {activeTab === "certificates" && <CertificatesManager />}

        {/* SPONSORS */}
        {activeTab === "sponsors" && <SponsorsManager />}

        {/* PAGE CONTENT */}
        {activeTab === "page-content" && <PageContentManager />}

        {/* COURSES */}
        {activeTab === "courses" && <CoursesManager />}

        {/* STUDENTS */}
        {activeTab === "students" && <StudentManager />}

        {/* B2B LEADS */}
        {activeTab === "leads" && <LeadsManager />}

        {/* SERVICES */}
        {activeTab === "services" && <ServicesManager />}

        {/* CASE STUDIES */}
        {activeTab === "case-studies" && <CaseStudiesManager />}

        {/* BLOG */}
        {activeTab === "blog" && <BlogManager />}

        {/* CAREERS */}
        {activeTab === "careers" && <CareersManager />}

        {/* APPLICATIONS */}
        {activeTab === "applications" && (
          <Card className={`${isLight ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06] text-white"}`}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Applications CRM</CardTitle>
                  <CardDescription className="text-slate-500">
                    Manage and review all incoming applications.
                  </CardDescription>
                </div>
                <div className={`flex gap-2 p-1 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.04] border-white/[0.06]"}`}>
                  <button
                    onClick={() => setAppTab("course")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${appTab === "course" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}
                  >
                    Course Applications
                  </button>
                  <button
                    onClick={() => setAppTab("career")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${appTab === "career" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}
                  >
                    Career Applications
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {applications.filter((a: any) => appTab === "career" ? a.type === "career" : (a.type === "course" || !a.type)).length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-white/[0.06] rounded-lg">
                  <p className="text-slate-500">No {appTab} applications received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications
                    .filter((a: any) => appTab === "career" ? a.type === "career" : (a.type === "course" || !a.type))
                    .map((app: any) => (
                    <div
                      key={app.id}
                      className={`p-5 rounded-xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border ${isLight ? "border-slate-200 bg-white hover:bg-slate-50 shadow-sm" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                            {app.full_name || app.fullName}
                          </h3>
                          {appTab === "career" ? (
                            <Badge className="bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {app.course_interest || "General Application"}
                            </Badge>
                          ) : app.course_title ? (
                            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {app.course_title}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-500 border-white/[0.06]">
                              General Inquiry
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-500" /> {app.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-500" /> {app.phone}
                          </span>
                          {appTab === "career" && app.cv_link && (
                            <a
                              href={app.cv_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 underline"
                            >
                              <Briefcase className="w-3.5 h-3.5" /> View CV/Resume
                            </a>
                          )}
                        </div>

                        {app.message && (
                          <div className={`mt-2 text-sm p-3 rounded-md border-l-4 italic ${isLight ? "text-slate-600 bg-slate-50 border-cyan-400" : "text-slate-400 bg-white/[0.02] border-cyan-500/30"}`}>
                            "{app.message}"
                          </div>
                        )}

                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          Applied on {new Date(app.created_at || app.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() =>
                          deleteApplicationMutation.mutate({ id: app.id })
                        }
                        title="Delete Application"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && <MessagesManager />}

        {/* SITE SETTINGS — with Save Button */}
        {activeTab === "site-settings" && (
          <Card className={`${isLight ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06] text-white"}`}>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription className="text-slate-500">
                Manage contact info and footer details for the website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { key: "email", label: "Email", icon: Mail, placeholder: "support@infx.space" },
                { key: "phone", label: "Phone", icon: Phone, placeholder: "+201100135225" },
                { key: "whatsapp", label: "WhatsApp Link", icon: MessageCircle, placeholder: "https://api.whatsapp.com/..." },
                { key: "footerText", label: "Footer Text", icon: Globe, placeholder: "Enter Footer Text" },
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                    <Icon className="w-4 h-4 text-cyan-400" /> {label}
                  </Label>
                  <Input
                    value={settings[key as keyof typeof settings]}
                    onChange={(e) => handleSettingFieldChange(key, e.target.value)}
                    placeholder={placeholder}
                    className={`${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-white/[0.04] border-white/[0.08] text-white"} placeholder:text-slate-600 focus:ring-cyan-500/30 focus:border-cyan-500/40 rounded-xl h-11`}
                  />
                </div>
              ))}

              {/* Default Theme & Language */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                    🎨 Default Theme
                  </Label>
                  <select
                    value={settings.default_theme}
                    onChange={(e) => handleSettingFieldChange('default_theme', e.target.value)}
                    className={`w-full h-11 rounded-xl px-4 text-sm border focus:outline-none ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0d1225] border-white/[0.08] text-white [color-scheme:dark]'}`}
                  >
                    <option value="dark">🌙 Dark Mode (Default)</option>
                    <option value="light">☀️ Light Mode</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                    🌐 Default Language
                  </Label>
                  <select
                    value={settings.default_language}
                    onChange={(e) => handleSettingFieldChange('default_language', e.target.value)}
                    className={`w-full h-11 rounded-xl px-4 text-sm border focus:outline-none ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0d1225] border-white/[0.08] text-white [color-scheme:dark]'}`}
                  >
                    <option value="en">🇬🇧 English (Default)</option>
                    <option value="ar">🇪🇬 العربية</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className={`pt-4 border-t ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
                <Button
                  onClick={handleSaveSettings}
                  disabled={!settingsDirty || updateSettingMutation.isPending}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateSettingMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Settings</>
                  )}
                </Button>
                {settingsDirty && (
                  <p className="text-xs text-amber-400 mt-2">You have unsaved changes.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
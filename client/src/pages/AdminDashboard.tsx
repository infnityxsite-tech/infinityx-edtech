import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"; // ✅ تم إضافة Badge
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
  Sparkles
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import PageContentManager from "@/components/admin/PageContentManager";
import CoursesManager from "@/components/admin/CoursesManager";
import ProgramsManager from "@/components/admin/ProgramsManager";
import BlogManager from "@/components/admin/BlogManager";
import CareersManager from "@/components/admin/CareersManager";
import MessagesManager from "@/components/admin/MessagesManager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const [location, navigate] = useLocation();

  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    footerText: "",
  });

  const utils = trpc.useUtils();

  const { data: applications = [] } = trpc.admin.getApplications.useQuery();
  const { data: siteSettings = {} } = trpc.admin.getSiteSettings.useQuery();

  // Update settings when data changes
  useEffect(() => {
    if (siteSettings) {
      setSettings({
        email: (siteSettings as any)?.email || "",
        phone: (siteSettings as any)?.phone || "",
        whatsapp: (siteSettings as any)?.whatsapp || "",
        footerText: (siteSettings as any)?.footerText || "",
      });
    }
  }, [siteSettings]);

  const { data: messages = [] } = trpc.admin.getMessages.useQuery();

  const updateSettingMutation = trpc.admin.updateSiteSetting.useMutation({
    onSuccess: () => {
      toast.success("Settings updated!");
      utils.admin.getSiteSettings.invalidate();
    },
  });

  const deleteApplicationMutation = trpc.admin.deleteApplication.useMutation({
    onSuccess: () => {
      toast.success("Application deleted!");
      utils.admin.getApplications.invalidate();
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isLocalAdmin = localStorage.getItem("isAdminLoggedIn") === "true";
  if ((!user || user.role !== "admin") && !isLocalAdmin) {
    navigate("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout?.();
    } catch {}
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
    updateSettingMutation.mutate({ key, value });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              InfinityX Admin Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Welcome, {user?.name || "Local Admin"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-9 w-full min-w-[800px]">
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="page-content">
              <Settings className="w-4 h-4 mr-2" /> Pages
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="w-4 h-4 mr-2" /> Courses
            </TabsTrigger>
            <TabsTrigger value="programs">
              <Users className="w-4 h-4 mr-2" /> Programs
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileText className="w-4 h-4 mr-2" /> Blog
            </TabsTrigger>
            <TabsTrigger value="careers">
              <Briefcase className="w-4 h-4 mr-2" /> Careers
            </TabsTrigger>
            <TabsTrigger value="applications">
              <ClipboardList className="w-4 h-4 mr-2" /> Applications
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="w-4 h-4 mr-2" /> Messages
            </TabsTrigger>
            <TabsTrigger value="site-settings">
              <Globe className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
                <CardDescription>General site metrics summary</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600">
                Manage your InfinityX platform effectively with the tools above.
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAGE CONTENT TAB */}
          <TabsContent value="page-content">
            <PageContentManager />
          </TabsContent>

          {/* COURSES TAB */}
          <TabsContent value="courses">
            <CoursesManager />
          </TabsContent>

          {/* PROGRAMS TAB */}
          <TabsContent value="programs">
            <ProgramsManager />
          </TabsContent>

          {/* BLOG TAB */}
          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          {/* CAREERS TAB */}
          <TabsContent value="careers">
            <CareersManager />
          </TabsContent>

          {/* 🌟 APPLICATIONS TAB (UPDATED) */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Student Applications</CardTitle>
                <CardDescription>
                  View all student submissions from the Apply page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg">
                    <p className="text-slate-500">No applications received yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <div
                        key={app.id}
                        className="p-5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 hover:shadow-sm transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="flex-1 space-y-2">
                          {/* Header: Name + Course Badge */}
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">
                                {/* Use full_name (DB field) or fallback to fullName */}
                                {app.full_name || app.fullName}
                            </h3>
                            {app.course_title ? (
                              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {app.course_title}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-500">
                                General Inquiry
                              </Badge>
                            )}
                          </div>

                          {/* Contact Info */}
                          <div className="text-sm text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                            <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-slate-400" /> {app.email}
                            </span>
                            <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" /> {app.phone}
                            </span>
                          </div>

                          {/* Message */}
                          {app.message && (
                            <div className="mt-2 text-sm text-slate-600 bg-slate-100/50 p-3 rounded-md border-l-4 border-slate-300 italic">
                              "{app.message}"
                            </div>
                          )}
                          
                          {/* Date */}
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                             <Calendar className="w-3 h-3" />
                             Applied on {new Date(app.created_at || app.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                             })}
                          </div>
                        </div>

                        {/* Actions */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>

          {/* SITE SETTINGS TAB */}
          <TabsContent value="site-settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>
                  Manage contact info and footer details for the website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "email", label: "Email", icon: Mail },
                  { key: "phone", label: "Phone", icon: Phone },
                  { key: "whatsapp", label: "WhatsApp Link", icon: MessageCircle },
                  { key: "footerText", label: "Footer Text", icon: Globe },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold">
                      <Icon className="w-4 h-4 text-blue-600" /> {label}
                    </Label>
                    <Input
                      value={settings[key as keyof typeof settings]}
                      onChange={(e) => handleSettingChange(key, e.target.value)}
                      placeholder={`Enter ${label}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
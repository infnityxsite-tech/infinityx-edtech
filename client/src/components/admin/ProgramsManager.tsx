import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, GripVertical, BookOpen, X, Search } from "lucide-react";

// === Types ===
interface ModuleCourse {
  courseId: string;
  title?: string;
  overridePriceEgp?: number;
  overridePriceUsd?: number;
  orderIndex: number;
}

interface ProgramModule {
  title: string;
  description: string;
  duration: string;
  imageUrl: string;
  links: string;
  orderIndex: number;
  deliveryMode: string;
  courses: ModuleCourse[];
}

const emptyModule = (): ProgramModule => ({
  title: "", description: "", duration: "", imageUrl: "", links: "",
  orderIndex: 0, deliveryMode: "Recorded", courses: [],
});

import { useLanguage } from "@/contexts/LanguageContext";

export default function ProgramsManager() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "", title_ar: "", description: "", description_ar: "",
    imageUrl: "", duration: "", skills: "", category: "space",
    priceEgp: 0, priceUsd: 0, deliveryMode: "Recorded",
  });

  const [modules, setModules] = useState<ProgramModule[]>([]);

  const { data: programs = [], isLoading } = trpc.admin.getPrograms.useQuery();
  const { data: allCourses = [] } = trpc.admin.getCourses.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.admin.createProgramComplete.useMutation({
    onSuccess: () => {
      toast.success("Program created successfully!");
      setOpen(false); resetForm();
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to create program"),
  });

  const updateMutation = trpc.admin.updateProgramComplete.useMutation({
    onSuccess: () => {
      toast.success("Program updated successfully!");
      setOpen(false); resetForm();
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to update program"),
  });

  const deleteMutation = trpc.admin.deleteProgram.useMutation({
    onSuccess: () => {
      toast.success("Program deleted!");
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to delete"),
  });

  const resetForm = () => {
    setFormData({
      title: "", title_ar: "", description: "", description_ar: "",
      imageUrl: "", duration: "", skills: "", category: "space",
      priceEgp: 0, priceUsd: 0, deliveryMode: "Recorded",
    });
    setModules([]);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title) { toast.error("Title is required"); return; }

    const payload = {
      info: formData,
      modules: modules.map((m, i) => ({ ...m, orderIndex: i })),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = async (program: any) => {
    setFormData({
      title: program.title || "", title_ar: program.titleAr || "",
      description: program.description || "", description_ar: program.descriptionAr || "",
      imageUrl: program.imageUrl || "", duration: program.duration || "",
      skills: program.skills || "", category: program.category || "space",
      priceEgp: Number(program.priceEgp) || 0, priceUsd: Number(program.priceUsd) || 0,
      deliveryMode: program.deliveryMode || "Recorded",
    });
    // For now load empty modules; a full edit would call getProgramComplete
    setModules([]);
    setEditingId(program.id);
    setOpen(true);
  };

  // Module CRUD helpers
  const addModule = () => setModules([...modules, emptyModule()]);
  const removeModule = (idx: number) => setModules(modules.filter((_, i) => i !== idx));
  const updateModule = (idx: number, field: string, value: any) => {
    const copy = [...modules];
    (copy[idx] as any)[field] = value;
    setModules(copy);
  };

  const addCourseToModule = (modIdx: number, courseId: string) => {
    const course = (allCourses as any[]).find((c: any) => String(c.id) === courseId);
    if (!course) return;
    const copy = [...modules];
    if (copy[modIdx].courses.find(c => String(c.courseId) === courseId)) {
      toast.error("Course already added");
      return;
    }
    copy[modIdx].courses.push({
      courseId: String(course.id),
      title: course.title,
      overridePriceEgp: undefined,
      overridePriceUsd: undefined,
      orderIndex: copy[modIdx].courses.length,
    });
    setModules(copy);
  };

  const removeCourseFromModule = (modIdx: number, courseIdx: number) => {
    const copy = [...modules];
    copy[modIdx].courses.splice(courseIdx, 1);
    setModules(copy);
  };

  const filteredCourses = (allCourses as any[]).filter((c: any) =>
    !courseSearchQuery || c.title?.toLowerCase().includes(courseSearchQuery.toLowerCase())
  );

  const categoryLabel = (cat: string) => {
    const map: any = { space: "🚀 Space Tech", ai: "🧠 AI & Data", software: "💻 Software", security: "🛡️ Security" };
    return map[cat] || cat;
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50">
        <div>
          <CardTitle>{t("Programs Builder", "منشئ البرامج", "Programs Builder")}</CardTitle>
          <CardDescription>{t("Create structured Learning Path programs with modules and courses", "قم بإنشاء برامج مسار تعليمي مهيكلة مع وحدات ودورات", "Create learning paths")}</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> New Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingId ? t("Edit Program", "تعديل البرنامج", "Edit") : t("Create New Program", "إنشاء برنامج جديد", "Create")}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* School Category */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <Label className="text-amber-800 font-bold block mb-2">Assign to School</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger className="bg-white border-amber-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="space">🚀 School of Space Tech</SelectItem>
                    <SelectItem value="ai">🧠 School of AI & Data</SelectItem>
                    <SelectItem value="software">💻 School of Software</SelectItem>
                    <SelectItem value="security">🛡️ School of Cybersecurity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title + Arabic */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (English) *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. AI & Machine Learning Diploma" />
                </div>
                <div className="space-y-2" dir="rtl">
                  <Label>اسم البرنامج (Arabic)</Label>
                  <Input value={formData.title_ar} onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })} />
                </div>
              </div>

              {/* Description */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2" dir="rtl">
                  <Label>الوصف (Arabic)</Label>
                  <Textarea value={formData.description_ar} onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })} rows={3} />
                </div>
              </div>

              {/* Metadata row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><Label>Duration</Label><Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 16 Weeks" /></div>
                <div><Label>Skills</Label><Input value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Python, React..." /></div>
                <div><Label>Delivery Mode</Label>
                  <Select value={formData.deliveryMode} onValueChange={(val) => setFormData({ ...formData, deliveryMode: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Recorded">Recorded</SelectItem>
                      <SelectItem value="Live">Live</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Image URL</Label><Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} /></div>
              </div>

              {/* Pricing */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                <Label className="text-emerald-800 font-bold block mb-3">💰 Program Pricing</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-emerald-700">Price (EGP)</Label>
                    <Input type="number" value={formData.priceEgp} onChange={(e) => setFormData({ ...formData, priceEgp: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs text-emerald-700">Price (USD)</Label>
                    <Input type="number" value={formData.priceUsd} onChange={(e) => setFormData({ ...formData, priceUsd: Number(e.target.value) })} />
                  </div>
                </div>
              </div>

              {/* === MODULES BUILDER === */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" /> Modules ({modules.length})
                  </h3>
                  <Button variant="outline" size="sm" onClick={addModule} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <Plus className="w-3 h-3 mr-1" /> Add Module
                  </Button>
                </div>

                {modules.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No modules yet. Click "Add Module" to start building.</p>
                  </div>
                )}

                <div className="space-y-4">
                  {modules.map((mod, modIdx) => (
                    <div key={modIdx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-300" />
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Module {modIdx + 1}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeModule(modIdx)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3 mb-3">
                        <div><Label className="text-xs">Title *</Label><Input value={mod.title} onChange={(e) => updateModule(modIdx, 'title', e.target.value)} placeholder="Module title" /></div>
                        <div><Label className="text-xs">Duration</Label><Input value={mod.duration} onChange={(e) => updateModule(modIdx, 'duration', e.target.value)} placeholder="e.g. 4 Weeks" /></div>
                        <div><Label className="text-xs">Delivery</Label>
                          <Select value={mod.deliveryMode} onValueChange={(val) => updateModule(modIdx, 'deliveryMode', val)}>
                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Recorded">Recorded</SelectItem>
                              <SelectItem value="Live">Live</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <Label className="text-xs">Description</Label>
                        <Textarea value={mod.description} onChange={(e) => updateModule(modIdx, 'description', e.target.value)} rows={2} className="text-sm" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div><Label className="text-xs">Image URL</Label><Input value={mod.imageUrl} onChange={(e) => updateModule(modIdx, 'imageUrl', e.target.value)} className="text-sm" /></div>
                        <div><Label className="text-xs">Links / Resources</Label><Input value={mod.links} onChange={(e) => updateModule(modIdx, 'links', e.target.value)} className="text-sm" /></div>
                      </div>

                      {/* Courses inside module */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-bold text-slate-700">Courses in this Module ({mod.courses.length})</Label>
                        </div>

                        {mod.courses.map((c, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 mb-1.5 text-sm">
                            <span className="flex-1 font-medium text-slate-700 truncate">{c.title || `Course #${c.courseId}`}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => removeCourseFromModule(modIdx, cIdx)}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}

                        {/* Course picker */}
                        <div className="flex gap-2 mt-2">
                          <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                            <Input
                              className="pl-8 h-9 text-sm"
                              placeholder="Search courses..."
                              value={courseSearchQuery}
                              onChange={(e) => setCourseSearchQuery(e.target.value)}
                            />
                          </div>
                          <select
                            className="h-9 px-2 border border-slate-200 rounded-md text-sm bg-white min-w-[180px]"
                            onChange={(e) => { if (e.target.value) { addCourseToModule(modIdx, e.target.value); e.target.value = ""; setCourseSearchQuery(""); } }}
                            defaultValue=""
                          >
                            <option value="">+ Add course</option>
                            {filteredCourses.map((c: any) => (
                              <option key={c.id} value={String(c.id)}>{c.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button onClick={handleSubmit} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 text-sm font-semibold">
                {createMutation.isPending || updateMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (editingId ? "Update Program" : "Create Program")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> {t("Loading...", "جاري التحميل...", "Loading...")}</div>
        ) : programs.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium">{t("No programs yet", "لا توجد برامج حتى الآن", "No programs yet")}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {programs.map((program: any) => (
              <div key={program.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase w-24 text-center
                    ${program.category === 'space' ? 'bg-blue-100 text-blue-700' :
                      program.category === 'ai' ? 'bg-green-100 text-green-700' :
                      program.category === 'software' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'}`}>
                    {categoryLabel(program.category)}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{program.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>{program.deliveryMode || "Recorded"}</span>
                      {Number(program.priceEgp) > 0 && <span className="font-semibold text-emerald-600">{Number(program.priceEgp).toLocaleString()} EGP</span>}
                      {Number(program.priceUsd) > 0 && <span className="font-semibold text-emerald-600">${Number(program.priceUsd).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(program)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => { if (window.confirm("Delete this program?")) deleteMutation.mutate({ id: program.id }); }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
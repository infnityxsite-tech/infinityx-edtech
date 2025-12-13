import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// ✅ IMPORT SELECT COMPONENT FOR DROPDOWN
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

export default function ProgramsManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    imageUrl: "",
    duration: "",
    skills: "",
    category: "space", // ✅ Default Category
  });

  const { data: programs = [], isLoading } = trpc.admin.getPrograms.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.admin.createProgram.useMutation({
    onSuccess: () => {
      toast.success("Program created successfully!");
      setOpen(false);
      resetForm();
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to create program"),
  });

  const updateMutation = trpc.admin.updateProgram.useMutation({
    onSuccess: () => {
      toast.success("Program updated successfully!");
      setOpen(false);
      resetForm();
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to update program"),
  });

  const deleteMutation = trpc.admin.deleteProgram.useMutation({
    onSuccess: () => {
      toast.success("Program deleted successfully!");
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to delete program"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      imageUrl: "",
      duration: "",
      skills: "",
      category: "space", // Reset to default
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title) {
      toast.error("Please enter a program title");
      return;
    }

    // @ts-ignore
    if (editingId) updateMutation.mutate({ id: editingId, ...formData });
    // @ts-ignore
    else createMutation.mutate(formData);
  };

  const handleEdit = (program: any) => {
    setFormData({
        title: program.title || "",
        title_ar: program.title_ar || "",
        description: program.description || "",
        description_ar: program.description_ar || "",
        imageUrl: program.imageUrl || "",
        duration: program.duration || "",
        skills: program.skills || "",
        category: program.category || "space", // ✅ Load existing category
    });
    setEditingId(program.id);
    setOpen(true);
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50">
        <div>
          <CardTitle>Programs Manager</CardTitle>
          <CardDescription>Create courses and assign them to Schools</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Program" : "Create New Program"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              
              {/* === ✅ NEW: SCHOOL CATEGORY SELECTOR === */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <Label className="text-amber-800 font-bold block mb-2">
                      Assign to which School?
                  </Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger className="bg-white border-amber-200">
                        <SelectValue placeholder="Select a School" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="space">🚀 School of Space Tech</SelectItem>
                        <SelectItem value="ai">🧠 School of AI & Data</SelectItem>
                        <SelectItem value="software">💻 School of Software</SelectItem>
                        <SelectItem value="security">🛡️ School of Cybersecurity</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

              {/* English Inputs */}
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Title (English)</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Orbital Mechanics 101" />
                 </div>
                 <div className="space-y-2" dir="rtl">
                    <Label>اسم البرنامج (Arabic)</Label>
                    <Input value={formData.title_ar} onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })} placeholder="مثال: ميكانيكا المدارات" />
                 </div>
              </div>

              {/* Description Inputs */}
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

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                 <div><Label>Duration</Label><Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 12 Weeks" /></div>
                 <div><Label>Skills (Comma separated)</Label><Input value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="React, Python..." /></div>
              </div>

              <div><Label>Image URL</Label><Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} /></div>

              <Button onClick={handleSubmit} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                {createMutation.isPending || updateMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (editingId ? "Update Program" : "Create Program")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {/* List of Programs */}
        <div className="divide-y divide-slate-100">
            {programs.map((program: any) => (
              <div key={program.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                    {/* ✅ VISUAL BADGE FOR CATEGORY */}
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase w-24 text-center
                        ${program.category === 'space' ? 'bg-blue-100 text-blue-700' : 
                          program.category === 'ai' ? 'bg-green-100 text-green-700' : 
                          program.category === 'software' ? 'bg-purple-100 text-purple-700' : 
                          'bg-red-100 text-red-700'}`}>
                        {program.category === 'space' ? 'Space Tech' : 
                         program.category === 'ai' ? 'AI & Data' :
                         program.category === 'software' ? 'Software' : 'Security'}
                    </span>
                    <div>
                        <h3 className="font-bold text-slate-900">{program.title}</h3>
                        <p className="text-sm text-slate-500">{program.title_ar || "No Arabic Title"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(program)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate({ id: program.id })}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
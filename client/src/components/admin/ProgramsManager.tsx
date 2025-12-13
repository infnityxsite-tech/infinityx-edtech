import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Globe } from "lucide-react";

export default function ProgramsManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // ✅ Added Arabic fields to state
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    imageUrl: "",
    duration: "",
    skills: "",
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
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title) {
      toast.error("Please enter a program title");
      return;
    }

    if (editingId) {
      // @ts-ignore - Ignoring type check for dynamic DB columns
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      // @ts-ignore
      createMutation.mutate(formData);
    }
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
    });
    setEditingId(program.id);
    setOpen(true);
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50 rounded-t-lg border-b border-slate-100">
        <div>
          <CardTitle className="text-xl text-slate-800">Programs Manager</CardTitle>
          <CardDescription>Manage your specialized tracks and diplomas</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Program" : "Create New Program"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* === BILINGUAL SECTION === */}
              <div className="grid md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                {/* English Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">ENGLISH</span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Program Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Space Tech Diploma"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed program description..."
                            rows={4}
                        />
                    </div>
                </div>

                {/* Arabic Column */}
                <div className="space-y-4" dir="rtl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">العربية</span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title_ar">اسم البرنامج</Label>
                        <Input
                            id="title_ar"
                            value={formData.title_ar}
                            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                            placeholder="مثال: دبلومة تكنولوجيا الفضاء"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description_ar">الوصف</Label>
                        <Textarea
                            id="description_ar"
                            value={formData.description_ar}
                            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                            placeholder="وصف تفصيلي للبرنامج..."
                            rows={4}
                        />
                    </div>
                </div>
              </div>

              {/* === COMMON DETAILS === */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration / المدة</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 12 Weeks"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (Comma separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="React, Node, Python..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                    <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                    />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full bg-slate-900 hover:bg-slate-800"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingId ? "Update Program" : "Create Program"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>No programs yet. Click "Add Program" to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {programs.map((program: any) => (
              <div
                key={program.id}
                className="flex items-center justify-between p-6 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                    {program.imageUrl && (
                        <img src={program.imageUrl} alt="" className="w-16 h-16 rounded object-cover border border-slate-200" />
                    )}
                    <div>
                        <h3 className="font-bold text-slate-900">{program.title}</h3>
                        <p className="text-sm text-slate-500 mb-1">{program.title_ar || "No Arabic Title"}</p>
                        <div className="flex gap-2">
                             <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{program.duration}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(program)}
                    className="hover:text-blue-600 hover:border-blue-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: program.id })}
                    disabled={deleteMutation.isPending}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
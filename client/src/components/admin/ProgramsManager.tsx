import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

export default function ProgramsManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    duration: "",
    skills: "",
  });

  const { data: programs = [], isLoading } = trpc.admin.getPrograms.useQuery();

  const createMutation = trpc.admin.createProgram.useMutation({
    onSuccess: () => {
      toast.success("Program created successfully!");
      setOpen(false);
      resetForm();
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create program");
    },
  });

  const updateMutation = trpc.admin.updateProgram.useMutation({
    onSuccess: () => {
      toast.success("Program updated successfully!");
      setOpen(false);
      resetForm();
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update program");
    },
  });

  const deleteMutation = trpc.admin.deleteProgram.useMutation({
    onSuccess: () => {
      toast.success("Program deleted successfully!");
      utils.admin.getPrograms.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete program");
    },
  });

  const utils = trpc.useUtils();

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
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
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (program: any) => {
    setFormData(program);
    setEditingId(program.id);
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Programs Manager</CardTitle>
          <CardDescription>Manage specialized programs offered on your platform</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Program" : "Create New Program"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Program Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Full-Stack Web Development"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Program description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 12 weeks"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
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

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No programs yet. Click "Add Program" to create one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {programs.map((program: any) => (
              <div
                key={program.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{program.title}</h3>
                  <p className="text-sm text-slate-600">{program.duration}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(program)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: program.id })}
                    disabled={deleteMutation.isPending}
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

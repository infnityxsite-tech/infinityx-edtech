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

export default function CareersManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    requirements: "",
    jobType: "",
    salary: "",
    isActive: true,
  });

  const utils = trpc.useUtils();
  const { data: jobs = [], isLoading } = trpc.admin.getAllJobListings.useQuery();

  const createMutation = trpc.admin.createJobListing.useMutation({
    onSuccess: () => {
      toast.success("✅ Job created successfully!");
      setOpen(false);
      resetForm();
      utils.admin.getAllJobListings.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to create job"),
  });

  const updateMutation = trpc.admin.updateJobListing.useMutation({
    onSuccess: () => {
      toast.success("✅ Job updated successfully!");
      setOpen(false);
      resetForm();
      utils.admin.getAllJobListings.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to update job"),
  });

  const deleteMutation = trpc.admin.deleteJobListing.useMutation({
    onSuccess: () => {
      toast.success("🗑️ Job deleted successfully!");
      utils.admin.getAllJobListings.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to delete job"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      description: "",
      requirements: "",
      jobType: "",
      salary: "",
      isActive: true,
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a job title");
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (job: any) => {
    setFormData({
      title: job.title || "",
      location: job.location || "",
      description: job.description || "",
      requirements: job.requirements || "",
      jobType: job.jobType || "",
      salary: job.salary || "",
      isActive: job.isActive ?? 1,
    });
    setEditingId(job.id);
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Careers Manager</CardTitle>
          <CardDescription>Manage all job listings on your platform</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Job
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Job Listing" : "Create New Job Listing"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Frontend Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Cairo, Egypt / Remote"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the job responsibilities"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="List the qualifications required"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Input
                    id="jobType"
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    placeholder="e.g., Full-time / Part-time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g., 15,000 EGP / month"
                  />
                </div>
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
                ) : editingId ? (
                  "Update Job"
                ) : (
                  "Create Job"
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
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No job listings yet. Click “Add Job” to create one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job: any) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-600">
                    {job.jobType} • {job.location}
                  </p>
                  <p className="text-sm text-green-700 mt-1">{job.salary}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: job.id })}
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

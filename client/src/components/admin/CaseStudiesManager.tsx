import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Plus, Save, FileText, X, Globe, Edit, ChevronDown, ChevronRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

export default function CaseStudiesManager() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const utils = trpc.useUtils();
  const { data: studies = [], isLoading } = trpc.admin.getClientCaseStudies.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ clientName: "", clientNameAr: "", industry: "", industryAr: "", challenge: "", challengeAr: "", solution: "", solutionAr: "", outcome: "", outcomeAr: "", imageUrl: "", isPublished: false });
  const [editForm, setEditForm] = useState<any>({});
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  const createMutation = trpc.admin.createClientCaseStudy.useMutation({
    onSuccess: () => { toast.success("Created!"); utils.admin.getClientCaseStudies.invalidate(); setShowForm(false); setForm({ clientName: "", clientNameAr: "", industry: "", industryAr: "", challenge: "", challengeAr: "", solution: "", solutionAr: "", outcome: "", outcomeAr: "", imageUrl: "", isPublished: false }); },
    onError: () => toast.error("Failed"),
  });
  const deleteMutation = trpc.admin.deleteClientCaseStudy.useMutation({ onSuccess: () => { toast.success("Deleted!"); utils.admin.getClientCaseStudies.invalidate(); } });
  const updateMutation = trpc.admin.updateClientCaseStudyFull.useMutation({
    onSuccess: () => { toast.success("Updated!"); utils.admin.getClientCaseStudies.invalidate(); setEditId(null); },
    onError: () => toast.error("Failed to update"),
  });

  const inputCls = `${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-white/[0.04] border-white/[0.08] text-white"} placeholder:text-slate-600 rounded-xl h-10 text-sm`;

  const startEdit = (cs: any) => {
    setEditId(cs.id);
    setEditForm({
      clientName: cs.clientName || cs.client_name || "",
      clientNameAr: cs.clientNameAr || cs.client_name_ar || "",
      industry: cs.industry || "", industryAr: cs.industryAr || cs.industry_ar || "",
      challenge: cs.challenge || "", challengeAr: cs.challengeAr || cs.challenge_ar || "",
      solution: cs.solution || "", solutionAr: cs.solutionAr || cs.solution_ar || "",
      outcome: cs.outcome || "", outcomeAr: cs.outcomeAr || cs.outcome_ar || "",
      imageUrl: cs.imageUrl || cs.image_url || "",
      isPublished: cs.isPublished ?? cs.is_published ?? false,
    });
  };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  return (
    <Card className={`${isLight ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06] text-white"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-400" /> Client Case Studies</CardTitle><CardDescription className="text-slate-500">{studies.length} case studies</CardDescription></div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white">{showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add</>}</Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className={`p-6 rounded-xl border mb-6 space-y-4 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/[0.06]"}`}>
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label className="text-xs text-slate-400">Client Name (EN)</Label><Input value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} className={inputCls} /></div>
              <div><Label className="text-xs text-slate-400">Client Name (AR)</Label><Input value={form.clientNameAr} onChange={e => setForm({...form, clientNameAr: e.target.value})} className={inputCls} dir="rtl" /></div>
              <div><Label className="text-xs text-slate-400">Industry (EN)</Label><Input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className={inputCls} /></div>
              <div><Label className="text-xs text-slate-400">Industry (AR)</Label><Input value={form.industryAr} onChange={e => setForm({...form, industryAr: e.target.value})} className={inputCls} dir="rtl" /></div>
              <div><Label className="text-xs text-slate-400">Challenge (EN)</Label><Input value={form.challenge} onChange={e => setForm({...form, challenge: e.target.value})} className={inputCls} /></div>
              <div><Label className="text-xs text-slate-400">Challenge (AR)</Label><Input value={form.challengeAr} onChange={e => setForm({...form, challengeAr: e.target.value})} className={inputCls} dir="rtl" /></div>
              <div><Label className="text-xs text-slate-400">Solution (EN)</Label><Input value={form.solution} onChange={e => setForm({...form, solution: e.target.value})} className={inputCls} /></div>
              <div><Label className="text-xs text-slate-400">Solution (AR)</Label><Input value={form.solutionAr} onChange={e => setForm({...form, solutionAr: e.target.value})} className={inputCls} dir="rtl" /></div>
              <div><Label className="text-xs text-slate-400">Outcome / Result (EN)</Label><Input value={form.outcome} onChange={e => setForm({...form, outcome: e.target.value})} className={inputCls} placeholder="e.g. 99.2% accuracy, 4-month ROI" /></div>
              <div><Label className="text-xs text-slate-400">Outcome (AR)</Label><Input value={form.outcomeAr} onChange={e => setForm({...form, outcomeAr: e.target.value})} className={inputCls} dir="rtl" /></div>
              <div><Label className="text-xs text-slate-400">Image URL</Label><Input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className={inputCls} placeholder="/uploads/..." /></div>
              <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="rounded" /> Publish</label></div>
            </div>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.clientName || createMutation.isPending} className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {studies.map((cs: any) => (
            <div key={cs.id} className={`rounded-xl border overflow-hidden ${isLight ? "border-slate-200 bg-white" : "border-white/[0.06] bg-white/[0.02]"}`}>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{cs.clientName || cs.client_name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${(cs.isPublished ?? cs.is_published) ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>
                      {(cs.isPublished ?? cs.is_published) ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Globe className="w-3 h-3" /> {cs.industry || "No industry"}
                    {cs.outcome && <><span className="text-emerald-500 ml-2">✓</span> <span className="text-emerald-400">{cs.outcome.substring(0, 50)}...</span></>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-500/10" onClick={() => editId === cs.id ? setEditId(null) : startEdit(cs)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10" onClick={() => setPendingDelete({ id: String(cs.id), title: cs.clientName || cs.client_name || "" })} disabled={deleteMutation.isPending}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              {editId === cs.id && (
                <div className={`px-4 pb-4 space-y-3 border-t ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
                  <div className="grid md:grid-cols-2 gap-3 pt-3">
                    <div><Label className="text-xs text-slate-400">Client Name (EN)</Label><Input value={editForm.clientName} onChange={e => setEditForm({...editForm, clientName: e.target.value})} className={inputCls} /></div>
                    <div><Label className="text-xs text-slate-400">Client Name (AR)</Label><Input value={editForm.clientNameAr} onChange={e => setEditForm({...editForm, clientNameAr: e.target.value})} className={inputCls} dir="rtl" /></div>
                    <div><Label className="text-xs text-slate-400">Industry</Label><Input value={editForm.industry} onChange={e => setEditForm({...editForm, industry: e.target.value})} className={inputCls} /></div>
                    <div><Label className="text-xs text-slate-400">Industry (AR)</Label><Input value={editForm.industryAr} onChange={e => setEditForm({...editForm, industryAr: e.target.value})} className={inputCls} dir="rtl" /></div>
                    <div><Label className="text-xs text-slate-400">Challenge</Label><Input value={editForm.challenge} onChange={e => setEditForm({...editForm, challenge: e.target.value})} className={inputCls} /></div>
                    <div><Label className="text-xs text-slate-400">Challenge (AR)</Label><Input value={editForm.challengeAr} onChange={e => setEditForm({...editForm, challengeAr: e.target.value})} className={inputCls} dir="rtl" /></div>
                    <div><Label className="text-xs text-slate-400">Solution</Label><Input value={editForm.solution} onChange={e => setEditForm({...editForm, solution: e.target.value})} className={inputCls} /></div>
                    <div><Label className="text-xs text-slate-400">Solution (AR)</Label><Input value={editForm.solutionAr} onChange={e => setEditForm({...editForm, solutionAr: e.target.value})} className={inputCls} dir="rtl" /></div>
                    <div><Label className="text-xs text-slate-400">Outcome (EN)</Label><Input value={editForm.outcome} onChange={e => setEditForm({...editForm, outcome: e.target.value})} className={inputCls} /></div>
                    <div><Label className="text-xs text-slate-400">Outcome (AR)</Label><Input value={editForm.outcomeAr} onChange={e => setEditForm({...editForm, outcomeAr: e.target.value})} className={inputCls} dir="rtl" /></div>
                    <div><Label className="text-xs text-slate-400">Image URL</Label><Input value={editForm.imageUrl} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} className={inputCls} /></div>
                    <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer"><input type="checkbox" checked={editForm.isPublished} onChange={e => setEditForm({...editForm, isPublished: e.target.checked})} className="rounded" /> Published</label></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-emerald-600 text-white" disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: cs.id, ...editForm })}>
                      {updateMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <CheckCircle className="w-3 h-3 mr-1" />} Save Changes
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditId(null)} className={isLight ? 'border-slate-300' : 'border-white/10'}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <DeleteConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete || deleteMutation.isPending) return;
          const caseStudy = pendingDelete;
          setPendingDelete(null);
          deleteMutation.mutate({ id: caseStudy.id });
        }}
        entityType="Case Study"
        entityTitle={pendingDelete?.title ?? ""}
      />
    </Card>
  );
}

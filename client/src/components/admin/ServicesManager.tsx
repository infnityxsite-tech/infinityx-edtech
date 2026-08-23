import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Plus, Save, Package, X, ChevronDown, ChevronRight, Eye, Image, HelpCircle, Target, Wrench, DollarSign, Cpu, Edit, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

const emptyServiceForm = {
  title: "",
  titleAr: "",
  slug: "",
  categoryId: "",
  description: "",
  descriptionAr: "",
  heroImageUrl: "",
  problemStatement: "",
  problemStatementAr: "",
  overviewLong: "",
  overviewLongAr: "",
  featuresJson: "",
  priceTier: "",
  isActive: false,
};

function SubSection({ title, icon: Icon, color, children, count }: { title: string; icon: any; color: string; children: React.ReactNode; count?: number }) {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <div className={`rounded-xl border ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
      <button onClick={() => setOpen(!open)} className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
        <span className="flex items-center gap-2"><Icon className={`w-4 h-4 ${color}`} />{title}{count !== undefined && <span className={`text-xs px-2 py-0.5 rounded-full ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/[0.06] text-slate-400'}`}>{count}</span>}</span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className={`px-4 pb-4 space-y-3 border-t ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>{children}</div>}
    </div>
  );
}

export default function ServicesManager() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const utils = trpc.useUtils();
  const { data: services = [], isLoading } = trpc.admin.getServicePackages.useQuery();
  const { data: hubData } = trpc.admin.getSolutionsHub.useQuery();
  const categories = (hubData?.categories || []) as Array<{ id: number; name: string }>;
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyServiceForm);
  const [newItem, setNewItem] = useState<Record<string, any>>({});

  const createMutation = trpc.admin.createServicePackage.useMutation({
    onSuccess: (service: any) => {
      toast.success(service?.status === "active" ? "System profile published." : "Draft created. Complete all profile fields before publishing.");
      utils.admin.getServicePackages.invalidate();
      utils.admin.getSolutionsHub.invalidate();
      setShowForm(false);
      setForm(emptyServiceForm);
    },
    onError: () => toast.error("Failed"),
  });
  const deleteMutation = trpc.admin.deleteServicePackage.useMutation({ onSuccess: () => { toast.success("Deleted!"); utils.admin.getServicePackages.invalidate(); } });

  // Sub-table mutations
  const addTech = trpc.admin.addServiceTechStack.useMutation({ onSuccess: () => { toast.success("Tech added"); utils.admin.getSolutionBySlug.invalidate(); } });
  const delTech = trpc.admin.deleteServiceTechStack.useMutation({ onSuccess: () => { toast.success("Removed"); utils.admin.getSolutionBySlug.invalidate(); } });
  const addDel = trpc.admin.addServiceDeliverable.useMutation({ onSuccess: () => { toast.success("Deliverable added"); utils.admin.getSolutionBySlug.invalidate(); } });
  const delDel = trpc.admin.deleteServiceDeliverable.useMutation({ onSuccess: () => { toast.success("Removed"); utils.admin.getSolutionBySlug.invalidate(); } });
  const addUC = trpc.admin.addServiceUseCase.useMutation({ onSuccess: () => { toast.success("Use case added"); utils.admin.getSolutionBySlug.invalidate(); } });
  const delUC = trpc.admin.deleteServiceUseCase.useMutation({ onSuccess: () => { toast.success("Removed"); utils.admin.getSolutionBySlug.invalidate(); } });
  const addFaq = trpc.admin.addServiceFaq.useMutation({ onSuccess: () => { toast.success("FAQ added"); utils.admin.getSolutionBySlug.invalidate(); } });
  const delFaq = trpc.admin.deleteServiceFaq.useMutation({ onSuccess: () => { toast.success("Removed"); utils.admin.getSolutionBySlug.invalidate(); } });
  const addGal = trpc.admin.addServiceGalleryItem.useMutation({ onSuccess: () => { toast.success("Image added"); utils.admin.getSolutionBySlug.invalidate(); } });
  const delGal = trpc.admin.deleteServiceGalleryItem.useMutation({ onSuccess: () => { toast.success("Removed"); utils.admin.getSolutionBySlug.invalidate(); } });
  const addPricing = trpc.admin.addServicePricingModel.useMutation({ onSuccess: () => { toast.success("Pricing added"); utils.admin.getSolutionBySlug.invalidate(); } });
  const delPricing = trpc.admin.deleteServicePricingModel.useMutation({ onSuccess: () => { toast.success("Removed"); utils.admin.getSolutionBySlug.invalidate(); } });
  const updatePricing = trpc.admin.updateServicePricingModel.useMutation({ onSuccess: () => { toast.success("Pricing updated!"); utils.admin.getSolutionBySlug.invalidate(); } });
  const [editPricing, setEditPricing] = useState<Record<string, any>>({});

  const inputCls = `${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-white/[0.04] border-white/[0.08] text-white"} placeholder:text-slate-500 rounded-xl h-10 text-sm`;
  const itemCls = `flex items-center justify-between p-3 rounded-lg border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04] bg-white/[0.01]'}`;

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  return (
    <Card className={`${isLight ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06] text-white"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-cyan-400" /> Service Packages</CardTitle><CardDescription className="text-slate-500">{services.length} packages</CardDescription></div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-600 hover:bg-cyan-500 text-white">{showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add</>}</Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className={`p-6 rounded-xl border mb-6 space-y-4 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/[0.06]"}`}>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label className="text-sm text-slate-400">Title (EN)</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputCls} /></div>
              <div><Label className="text-sm text-slate-400">Title (AR)</Label><Input value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} className={inputCls} dir="rtl" /></div>
              <div><Label className="text-sm text-slate-400">Stable URL slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")})} placeholder="e.g. predictive-analytics" className={inputCls} /></div>
              <div>
                <Label className="text-sm text-slate-400">Primary category</Label>
                <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className={`${inputCls} w-full px-3`}>
                  <option value="">Select a category</option>
                  {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
              <div><Label className="text-sm text-slate-400">Description (EN)</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputCls} /></div>
              <div><Label className="text-sm text-slate-400">Description (AR)</Label><Input value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} className={inputCls} dir="rtl" /></div>
              <div><Label className="text-sm text-slate-400">Price Tier</Label><Input value={form.priceTier} onChange={e => setForm({...form, priceTier: e.target.value})} placeholder="e.g. Enterprise" className={inputCls} /></div>
              <div><Label className="text-sm text-slate-400">Hero image</Label><Input value={form.heroImageUrl} onChange={e => setForm({...form, heroImageUrl: e.target.value})} placeholder="/uploads/system-hero.webp" className={inputCls} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label className="text-sm text-slate-400">Business problem (EN)</Label><textarea value={form.problemStatement} onChange={e => setForm({...form, problemStatement: e.target.value})} className={`${inputCls} min-h-24 w-full p-3`} /></div>
              <div><Label className="text-sm text-slate-400">Business problem (AR)</Label><textarea value={form.problemStatementAr} onChange={e => setForm({...form, problemStatementAr: e.target.value})} className={`${inputCls} min-h-24 w-full p-3`} dir="rtl" /></div>
              <div><Label className="text-sm text-slate-400">Full overview (EN)</Label><textarea value={form.overviewLong} onChange={e => setForm({...form, overviewLong: e.target.value})} className={`${inputCls} min-h-32 w-full p-3`} /></div>
              <div><Label className="text-sm text-slate-400">Full overview (AR)</Label><textarea value={form.overviewLongAr} onChange={e => setForm({...form, overviewLongAr: e.target.value})} className={`${inputCls} min-h-32 w-full p-3`} dir="rtl" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
              Publish immediately when the complete bilingual profile is provided
            </label>
            <Button onClick={() => createMutation.mutate({...form, categoryId: form.categoryId ? Number(form.categoryId) : undefined})} disabled={!form.title || !form.categoryId || createMutation.isPending} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {services.map((s: any) => (
            <ServiceRow key={s.id} service={s} isLight={isLight} expanded={expandedId === s.id}
              onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
              onDelete={() => deleteMutation.mutate({ id: s.id })}
              inputCls={inputCls} itemCls={itemCls} newItem={newItem} setNewItem={setNewItem}
              addTech={addTech} delTech={delTech} addDel={addDel} delDel={delDel}
              addUC={addUC} delUC={delUC} addFaq={addFaq} delFaq={delFaq}
              addGal={addGal} delGal={delGal} addPricing={addPricing} delPricing={delPricing}
              updatePricing={updatePricing} editPricing={editPricing} setEditPricing={setEditPricing} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceRow({ service: s, isLight, expanded, onToggle, onDelete, inputCls, itemCls, newItem, setNewItem,
  addTech, delTech, addDel, delDel, addUC, delUC, addFaq, delFaq, addGal, delGal, addPricing, delPricing,
  updatePricing, editPricing, setEditPricing }: any) {
  const slug = s.slug || s.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const { data: detail } = trpc.admin.getSolutionBySlug.useQuery({ slug }, { enabled: expanded });
  const [deleteTarget, setDeleteTarget] = useState<{
    entityType: string;
    entityTitle: string;
    childSummary?: string;
    onConfirm: () => void;
  } | null>(null);

  const requestDelete = (target: NonNullable<typeof deleteTarget>) => setDeleteTarget(target);
  const confirmDelete = () => {
    deleteTarget?.onConfirm();
    setDeleteTarget(null);
  };

  return (
    <>
    <div className={`rounded-xl border ${isLight ? "border-slate-200 bg-white" : "border-white/[0.06] bg-white/[0.02]"}`}>
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div>
          <h4 className="font-bold">{s.title}</h4>
          <p className="text-sm text-slate-400">{s.description || "No description"}</p>
        </div>
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10" onClick={(e) => { e.stopPropagation(); requestDelete({ entityType: "Service Package", entityTitle: s.title, childSummary: "This will also permanently delete all associated service content.", onConfirm: onDelete }); }}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>
      {expanded && detail && (
        <div className={`px-4 pb-4 space-y-3 border-t ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
          {/* Tech Stack */}
          <SubSection title="Tech Stack" icon={Cpu} color="text-blue-400" count={detail.techStack?.length}>
            {(detail.techStack || []).map((t: any) => (
              <div key={t.id} className={itemCls}><span className="text-sm font-medium">{t.name}</span><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => requestDelete({ entityType: "Technology", entityTitle: t.name, onConfirm: () => delTech.mutate({ id: t.id }) })}><Trash2 className="w-3 h-3" /></Button></div>
            ))}
            <div className="flex gap-2 pt-2">
              <Input placeholder="Technology name" value={newItem[`tech_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`tech_${s.id}`]: e.target.value })} className={inputCls} />
              <Button size="sm" className="bg-blue-600 text-white shrink-0" onClick={() => { if (newItem[`tech_${s.id}`]) { addTech.mutate({ serviceId: s.id, name: newItem[`tech_${s.id}`] }); setNewItem({ ...newItem, [`tech_${s.id}`]: '' }); } }}><Plus className="w-3 h-3 mr-1" /> Add</Button>
            </div>
          </SubSection>

          {/* Deliverables */}
          <SubSection title="Deliverables" icon={Package} color="text-cyan-400" count={detail.deliverables?.length}>
            {(detail.deliverables || []).map((d: any) => (
              <div key={d.id} className={itemCls}><div><span className="text-sm font-bold">{d.title}</span><p className="text-xs text-slate-500">{d.description}</p></div><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => requestDelete({ entityType: "Deliverable", entityTitle: d.title, onConfirm: () => delDel.mutate({ id: d.id }) })}><Trash2 className="w-3 h-3" /></Button></div>
            ))}
            <div className="space-y-2 pt-2">
              <Input placeholder="Deliverable title" value={newItem[`del_t_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`del_t_${s.id}`]: e.target.value })} className={inputCls} />
              <Input placeholder="Description" value={newItem[`del_d_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`del_d_${s.id}`]: e.target.value })} className={inputCls} />
              <Button size="sm" className="bg-cyan-600 text-white" onClick={() => { if (newItem[`del_t_${s.id}`]) { addDel.mutate({ serviceId: s.id, title: newItem[`del_t_${s.id}`], description: newItem[`del_d_${s.id}`] }); setNewItem({ ...newItem, [`del_t_${s.id}`]: '', [`del_d_${s.id}`]: '' }); } }}><Plus className="w-3 h-3 mr-1" /> Add Deliverable</Button>
            </div>
          </SubSection>

          {/* Use Cases */}
          <SubSection title="Use Cases" icon={Target} color="text-purple-400" count={detail.useCases?.length}>
            {(detail.useCases || []).map((uc: any) => (
              <div key={uc.id} className={itemCls}><div><span className="text-sm font-bold">{uc.title}</span><p className="text-xs text-slate-500">{uc.description}</p></div><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => requestDelete({ entityType: "Use Case", entityTitle: uc.title, onConfirm: () => delUC.mutate({ id: uc.id }) })}><Trash2 className="w-3 h-3" /></Button></div>
            ))}
            <div className="space-y-2 pt-2">
              <Input placeholder="Use case title" value={newItem[`uc_t_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`uc_t_${s.id}`]: e.target.value })} className={inputCls} />
              <Input placeholder="Description" value={newItem[`uc_d_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`uc_d_${s.id}`]: e.target.value })} className={inputCls} />
              <Button size="sm" className="bg-purple-600 text-white" onClick={() => { if (newItem[`uc_t_${s.id}`]) { addUC.mutate({ serviceId: s.id, title: newItem[`uc_t_${s.id}`], description: newItem[`uc_d_${s.id}`] }); setNewItem({ ...newItem, [`uc_t_${s.id}`]: '', [`uc_d_${s.id}`]: '' }); } }}><Plus className="w-3 h-3 mr-1" /> Add Use Case</Button>
            </div>
          </SubSection>

          {/* Gallery */}
          <SubSection title="Gallery" icon={Image} color="text-emerald-400" count={detail.gallery?.length}>
            {(detail.gallery || []).map((g: any) => (
              <div key={g.id} className={itemCls}><div className="flex items-center gap-3"><img src={g.image_url} className="w-12 h-8 object-cover rounded" alt="" /><span className="text-sm">{g.caption || g.image_url}</span></div><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => requestDelete({ entityType: "Gallery Image", entityTitle: g.caption || g.image_url, onConfirm: () => delGal.mutate({ id: g.id }) })}><Trash2 className="w-3 h-3" /></Button></div>
            ))}
            <div className="space-y-2 pt-2">
              <Input placeholder="Image URL (/uploads/...)" value={newItem[`gal_u_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`gal_u_${s.id}`]: e.target.value })} className={inputCls} />
              <Input placeholder="Caption" value={newItem[`gal_c_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`gal_c_${s.id}`]: e.target.value })} className={inputCls} />
              <Button size="sm" className="bg-emerald-600 text-white" onClick={() => { if (newItem[`gal_u_${s.id}`]) { addGal.mutate({ serviceId: s.id, imageUrl: newItem[`gal_u_${s.id}`], caption: newItem[`gal_c_${s.id}`] }); setNewItem({ ...newItem, [`gal_u_${s.id}`]: '', [`gal_c_${s.id}`]: '' }); } }}><Plus className="w-3 h-3 mr-1" /> Add Image</Button>
            </div>
          </SubSection>

          {/* FAQ */}
          <SubSection title="FAQ" icon={HelpCircle} color="text-amber-400" count={detail.faq?.length}>
            {(detail.faq || []).map((f: any) => (
              <div key={f.id} className={itemCls}><div><span className="text-sm font-bold">{f.question}</span><p className="text-xs text-slate-500">{f.answer?.substring(0, 80)}...</p></div><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => requestDelete({ entityType: "FAQ", entityTitle: f.question, onConfirm: () => delFaq.mutate({ id: f.id }) })}><Trash2 className="w-3 h-3" /></Button></div>
            ))}
            <div className="space-y-2 pt-2">
              <Input placeholder="Question" value={newItem[`faq_q_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`faq_q_${s.id}`]: e.target.value })} className={inputCls} />
              <Input placeholder="Answer" value={newItem[`faq_a_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`faq_a_${s.id}`]: e.target.value })} className={inputCls} />
              <Button size="sm" className="bg-amber-600 text-white" onClick={() => { if (newItem[`faq_q_${s.id}`] && newItem[`faq_a_${s.id}`]) { addFaq.mutate({ serviceId: s.id, question: newItem[`faq_q_${s.id}`], answer: newItem[`faq_a_${s.id}`] }); setNewItem({ ...newItem, [`faq_q_${s.id}`]: '', [`faq_a_${s.id}`]: '' }); } }}><Plus className="w-3 h-3 mr-1" /> Add FAQ</Button>
            </div>
          </SubSection>

          <SubSection title="Pricing Models (USD + EGP)" icon={DollarSign} color="text-green-400" count={detail.pricingModels?.length}>
            {(detail.pricingModels || []).map((pm: any) => {
              const isEditing = editPricing[`id_${pm.id}`];
              return (
                <div key={pm.id} className={`rounded-lg border p-3 space-y-2 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04] bg-white/[0.01]'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold">{pm.model_type}</span>
                      <span className="text-xs text-cyan-400 ml-2">{pm.starting_price}</span>
                      {pm.price_egp && <span className="text-xs text-emerald-400 ml-2">| {pm.price_egp}</span>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-cyan-400" onClick={() => {
                        if (isEditing) { setEditPricing({...editPricing, [`id_${pm.id}`]: false}); }
                        else { setEditPricing({...editPricing, [`id_${pm.id}`]: true, [`mt_${pm.id}`]: pm.model_type, [`sp_${pm.id}`]: pm.starting_price, [`ep_${pm.id}`]: pm.price_egp || '', [`desc_${pm.id}`]: pm.description || '', [`feat_${pm.id}`]: pm.features_json || '[]'}); }
                      }}><Edit className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => requestDelete({ entityType: "Pricing Model", entityTitle: pm.model_type, onConfirm: () => delPricing.mutate({ id: pm.id }) })}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label className="text-[10px] text-slate-500">Model Type</Label><Input value={editPricing[`mt_${pm.id}`] || ''} onChange={e => setEditPricing({...editPricing, [`mt_${pm.id}`]: e.target.value})} className={inputCls} /></div>
                        <div><Label className="text-[10px] text-slate-500">Description</Label><Input value={editPricing[`desc_${pm.id}`] || ''} onChange={e => setEditPricing({...editPricing, [`desc_${pm.id}`]: e.target.value})} className={inputCls} /></div>
                        <div><Label className="text-[10px] text-cyan-400 font-bold">💵 Price (USD)</Label><Input value={editPricing[`sp_${pm.id}`] || ''} onChange={e => setEditPricing({...editPricing, [`sp_${pm.id}`]: e.target.value})} className={inputCls} placeholder="Starting from $5,000" /></div>
                        <div><Label className="text-[10px] text-emerald-400 font-bold">🇪🇬 Price (EGP)</Label><Input value={editPricing[`ep_${pm.id}`] || ''} onChange={e => setEditPricing({...editPricing, [`ep_${pm.id}`]: e.target.value})} className={inputCls} placeholder="Starting from 250,000 EGP" /></div>
                      </div>
                      <div><Label className="text-[10px] text-slate-500">Features (JSON array)</Label><Input value={editPricing[`feat_${pm.id}`] || '[]'} onChange={e => setEditPricing({...editPricing, [`feat_${pm.id}`]: e.target.value})} className={inputCls} /></div>
                      <Button size="sm" className="bg-green-600 text-white" disabled={updatePricing.isPending} onClick={() => {
                        updatePricing.mutate({ id: pm.id, modelType: editPricing[`mt_${pm.id}`], startingPrice: editPricing[`sp_${pm.id}`], priceEgp: editPricing[`ep_${pm.id}`], description: editPricing[`desc_${pm.id}`], featuresJson: editPricing[`feat_${pm.id}`] });
                        setEditPricing({...editPricing, [`id_${pm.id}`]: false});
                      }}>{updatePricing.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <CheckCircle className="w-3 h-3 mr-1" />} Save Changes</Button>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Model type (e.g. Retainer)" value={newItem[`pm_t_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`pm_t_${s.id}`]: e.target.value })} className={inputCls} />
                <Input placeholder="Price (USD)" value={newItem[`pm_p_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`pm_p_${s.id}`]: e.target.value })} className={inputCls} />
              </div>
              <Input placeholder="Description" value={newItem[`pm_d_${s.id}`] || ''} onChange={e => setNewItem({ ...newItem, [`pm_d_${s.id}`]: e.target.value })} className={inputCls} />
              <Button size="sm" className="bg-green-600 text-white" onClick={() => { if (newItem[`pm_t_${s.id}`]) { addPricing.mutate({ serviceId: s.id, modelType: newItem[`pm_t_${s.id}`], startingPrice: newItem[`pm_p_${s.id}`] || '', description: newItem[`pm_d_${s.id}`] }); setNewItem({ ...newItem, [`pm_t_${s.id}`]: '', [`pm_p_${s.id}`]: '', [`pm_d_${s.id}`]: '' }); } }}><Plus className="w-3 h-3 mr-1" /> Add New Pricing Model</Button>
            </div>
          </SubSection>
        </div>
      )}
    </div>
    <DeleteConfirmDialog
      open={deleteTarget !== null}
      onClose={() => setDeleteTarget(null)}
      onConfirm={confirmDelete}
      entityType={deleteTarget?.entityType || "Item"}
      entityTitle={deleteTarget?.entityTitle || ""}
      childSummary={deleteTarget?.childSummary}
    />
    </>
  );
}

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Phone, Mail, Building, Calendar, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { value: "qualified", label: "Qualified", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { value: "proposal", label: "Proposal Sent", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { value: "closed_won", label: "Closed Won", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { value: "closed_lost", label: "Closed Lost", color: "bg-red-500/10 text-red-400 border-red-500/20" },
];

export default function LeadsManager() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const utils = trpc.useUtils();

  const { data: leads = [], isLoading } = trpc.admin.getConsultationLeads.useQuery();

  const updateStatusMutation = trpc.admin.updateConsultationLeadStatus.useMutation({
    onSuccess: () => {
      toast.success("Lead status updated!");
      utils.admin.getConsultationLeads.invalidate();
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = trpc.admin.deleteConsultationLead.useMutation({
    onSuccess: () => {
      toast.success("Lead deleted!");
      utils.admin.getConsultationLeads.invalidate();
    },
    onError: () => toast.error("Failed to delete lead"),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    return <Badge className={`${opt.color} border font-semibold text-xs`}>{opt.label}</Badge>;
  };

  return (
    <Card className={`${isLight ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "bg-[#0d1225]/80 border-white/[0.06] text-white"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-cyan-400" />
          B2B Consultation Leads
        </CardTitle>
        <CardDescription className="text-slate-500">
          Track and manage incoming enterprise consultation requests. {leads.length} total leads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/[0.06] rounded-lg">
            <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">No consultation leads yet. They will appear here when submitted from the homepage form.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead: any) => (
              <div
                key={lead.id}
                className={`p-5 rounded-xl border transition-all ${isLight ? "border-slate-200 bg-white hover:bg-slate-50 shadow-sm" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        {lead.name}
                      </h3>
                      {getStatusBadge(lead.status)}
                    </div>

                    <div className="text-sm text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                      {lead.company && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-500" /> {lead.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" /> {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-500" /> {lead.phone}
                        </span>
                      )}
                    </div>

                    {lead.industryPainPoint && (
                      <div className={`mt-2 text-sm p-3 rounded-md border-l-4 italic ${isLight ? "text-slate-600 bg-slate-50 border-cyan-400" : "text-slate-400 bg-white/[0.02] border-cyan-500/30"}`}>
                        "{lead.industryPainPoint}"
                      </div>
                    )}

                    {lead.serviceInterest && (
                      <p className="text-xs text-cyan-400 mt-1">Service Interest: {lead.serviceInterest}</p>
                    )}

                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: lead.id, status: e.target.value })}
                      className={`text-xs px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-cyan-500/30 ${isLight ? "bg-white border-slate-200 text-slate-700" : "bg-white/[0.04] border-white/[0.08] text-white"}`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => deleteMutation.mutate({ id: lead.id })}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

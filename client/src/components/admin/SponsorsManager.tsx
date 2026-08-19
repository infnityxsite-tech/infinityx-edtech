import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Building, ImageIcon, Link as LinkIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function SponsorsManager() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        logoUrl: "",
        url: "",
        isActive: true,
    });

    const utils = trpc.useUtils();
    const { data: sponsors = [], isLoading } = trpc.admin.getSponsors.useQuery();

    const createMutation = trpc.admin.createSponsor.useMutation({
        onSuccess: (data) => {
            toast.success(`Sponsor added: ${data.name}`);
            setIsOpen(false);
            setFormData({
                name: "",
                logoUrl: "",
                url: "",
                isActive: true,
            });
            utils.admin.getSponsors.invalidate();
        },
        onError: (error) => {
            toast.error(`Failed to add sponsor: ${error.message}`);
        }
    });

    const updateMutation = trpc.admin.updateSponsor.useMutation({
        onSuccess: () => {
            toast.success("Sponsor updated");
            utils.admin.getSponsors.invalidate();
        },
    });

    const deleteMutation = trpc.admin.deleteSponsor.useMutation({
        onSuccess: () => {
            toast.success("Sponsor deleted");
            utils.admin.getSponsors.invalidate();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const handleToggleActive = (id: string | number, currentStatus: boolean) => {
        updateMutation.mutate({ id: String(id), isActive: !currentStatus });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading sponsors...</div>;
    }

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
                <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Building className="w-6 h-6 text-blue-600" />
                        Sponsors & Partners
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                        Manage partner logos displayed on the homepage.
                    </CardDescription>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Sponsor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Add New Sponsor</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Sponsor Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Acme Network"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logoUrl">Logo Image URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="logoUrl"
                                        value={formData.logoUrl}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                        placeholder="/uploads/logo.webp"
                                        required
                                    />
                                    {formData.logoUrl && (
                                        <div className="w-10 h-10 border border-slate-200 rounded shrink-0 bg-slate-50 flex items-center justify-center overflow-hidden">
                                            <img src={formData.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">Must be an absolute URL or path starting with /</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">Website URL (Optional)</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="isActive">Active (Display on site)</Label>
                            </div>
                            <Button type="submit" className="w-full mt-6" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Adding..." : "Add Sponsor"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="p-0">
                {sponsors.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No Sponsors Found</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                            You haven't added any sponsors yet. Click the button above to add your first partner.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {sponsors.map((sponsor: any) => (
                            <div key={sponsor.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 p-2 overflow-hidden shadow-sm">
                                        {sponsor.logoUrl ? (
                                            <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-slate-300" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                            {sponsor.name}
                                            {!sponsor.isActive && <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">Inactive</span>}
                                        </h4>
                                        {sponsor.url && (
                                            <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-1">
                                                <LinkIcon className="w-3 h-3" /> {sponsor.url.replace(/^https?:\/\//, '')}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 self-end sm:self-auto w-full sm:w-auto mt-2 sm:mt-0">
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor={`active-${sponsor.id}`} className="text-xs text-slate-500">Show</Label>
                                        <Switch
                                            id={`active-${sponsor.id}`}
                                            checked={sponsor.isActive}
                                            onCheckedChange={() => handleToggleActive(sponsor.id, sponsor.isActive)}
                                        />
                                    </div>
                                    <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete ${sponsor.name}?`)) {
                                                deleteMutation.mutate({ id: sponsor.id });
                                            }
                                        }}
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

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function MessagesManager() {
  const utils = trpc.useUtils();
  const { data: messages = [], isLoading } = trpc.admin.getMessages.useQuery();
  const deleteMutation = trpc.admin.deleteMessage.useMutation({
    onSuccess: () => {
      toast.success("✅ Message deleted successfully");
      utils.admin.getMessages.invalidate();
    },
    onError: () => toast.error("❌ Failed to delete message"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Contact Messages
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Messages from users via the contact form
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            No messages or applications yet.
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: any) => (
              <div
                key={msg.id}
                className="border border-slate-200 rounded-lg p-4 flex justify-between items-start hover:bg-slate-50 transition"
              >
                <div>
                  <h3 className="font-semibold text-blue-700">{msg.name}</h3>
                  <p className="text-sm text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {msg.email}
                  </p>
                  {msg.phone && (
                    <p className="text-sm text-slate-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {msg.phone}
                    </p>
                  )}
                  <p className="text-sm text-slate-600 mt-2">
                    <strong>Subject:</strong> {msg.subject}
                  </p>
                  <p className="text-slate-700 mt-1">{msg.message}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate({ id: msg.id })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

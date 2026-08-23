import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityType: string;
  entityTitle: string;
  childSummary?: string;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  entityType,
  entityTitle,
  childSummary,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" /> Delete {entityType}?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              Are you sure you want to delete <strong className="text-slate-800">{entityTitle || `this ${entityType.toLowerCase()}`}</strong>?
            </span>
            {childSummary && (
              <span className="block text-red-600 font-medium text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
                ⚠️ {childSummary}
              </span>
            )}
            <span className="block text-xs text-slate-500 mt-2">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Delete {entityType}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

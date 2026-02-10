import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-4">
          <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-[hsl(var(--destructive-muted))] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-[hsl(var(--destructive))]" />
          </div>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-2">{description}</DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90 transition-opacity"
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

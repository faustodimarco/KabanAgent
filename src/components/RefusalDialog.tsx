import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

interface RefusalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    title?: string;
    description?: string;
}

export function RefusalDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Refuse Task',
    description = 'Please provide a reason for refusing this task.',
}: RefusalDialogProps) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        onConfirm(reason);
        setReason('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="gap-4">
                    <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-[hsl(var(--destructive-muted))] flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-[hsl(var(--destructive))]" />
                    </div>
                    <div>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription className="mt-2">{description}</DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
                        Reason
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Add a note..."
                        className="w-full min-h-[100px] px-3 py-2 rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Refuse Task
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

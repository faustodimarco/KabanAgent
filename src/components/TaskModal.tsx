import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Bot, User, Calendar, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

export type QueuedPrompt = { id: string; text: string; executed: boolean };

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (task: Partial<Task>) => void;
  mode: 'view' | 'create' | 'edit';
}



const assignees = [
  { value: 'agent', label: 'Kimi (Agent)', icon: Bot },
  { value: 'human', label: 'You (Human)', icon: User },
] as const;

export function TaskModal({ isOpen, onClose, task, onSave, mode }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState<'agent' | 'human'>('human');
  const [frequency, setFrequency] = useState<'one-time' | 'recurring'>('one-time');
  const [schedule, setSchedule] = useState('');
  const [promptQueue, setPromptQueue] = useState<QueuedPrompt[]>([]);
  const [newPromptText, setNewPromptText] = useState('');
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editingPromptText, setEditingPromptText] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignee(task.assignee);
      setFrequency(task.frequency || 'one-time');
      setSchedule(task.schedule || '');
      setPromptQueue(task.promptQueue ?? []);
    } else {
      setTitle('');
      setDescription('');
      setAssignee('human');
      setFrequency('one-time');
      setSchedule('');
      setPromptQueue([]);
    }
    setNewPromptText('');
    setEditingPromptId(null);
    setEditingPromptText('');
  }, [task, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      assignee,
      frequency,
      schedule: schedule || undefined,
      status: task?.status || 'todo',
    });
    onClose();
  };

  const persistPromptQueue = (queue: QueuedPrompt[]) => {
    setPromptQueue(queue);
    if (task?.id) {
      onSave({ id: task.id, promptQueue: queue });
    }
  };

  const handleAddPrompt = () => {
    const text = newPromptText.trim();
    if (!text || !task?.id) return;
    const next: QueuedPrompt = {
      id: crypto.randomUUID(),
      text,
      executed: false,
    };
    persistPromptQueue([...promptQueue, next]);
    setNewPromptText('');
  };

  const handleDeletePrompt = (id: string) => {
    persistPromptQueue(promptQueue.filter((p) => p.id !== id));
    if (editingPromptId === id) {
      setEditingPromptId(null);
      setEditingPromptText('');
    }
  };

  const handleStartEditPrompt = (p: QueuedPrompt) => {
    if (p.executed) return;
    setEditingPromptId(p.id);
    setEditingPromptText(p.text);
  };

  const handleSaveEditPrompt = () => {
    if (editingPromptId == null || !editingPromptText.trim()) return;
    const next = promptQueue.map((p) =>
      p.id === editingPromptId ? { ...p, text: editingPromptText.trim() } : p
    );
    persistPromptQueue(next);
    setEditingPromptId(null);
    setEditingPromptText('');
  };

  const handleCancelEditPrompt = () => {
    setEditingPromptId(null);
    setEditingPromptText('');
  };

  const isEditing = mode === 'edit' || mode === 'create';
  const isCreate = mode === 'create';
  const showPromptQueue = task?.status === 'in-progress';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? 'Create New Task' : mode === 'edit' ? 'Edit Task' : task?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">
              Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            ) : (
              <p className="text-[hsl(var(--foreground))]">{task?.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
              />
            ) : (
              <p className="text-[hsl(var(--muted-foreground))]">{task?.description}</p>
            )}
          </div>

          {/* Assignee Row */}
          <div>
            <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">
              Assignee
            </label>
            {isEditing ? (
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value as 'agent' | 'human')}
                className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              >
                {assignees.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium',
                  task?.assignee === 'agent'
                    ? 'bg-[hsl(var(--agent-muted))] text-[hsl(var(--agent))]'
                    : 'bg-[hsl(var(--human-muted))] text-[hsl(var(--human))]'
                )}
              >
                {task?.assignee === 'agent' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {task?.assigneeName}
              </div>
            )}
          </div>

          {/* Frequency */}
          <div>
            <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">
              Frequency
            </label>
            {isEditing ? (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="frequency"
                    value="one-time"
                    checked={frequency === 'one-time'}
                    onChange={() => setFrequency('one-time')}
                    className="accent-[hsl(var(--primary))]"
                  />
                  <span className="text-sm text-[hsl(var(--foreground))]">One-time</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="frequency"
                    value="recurring"
                    checked={frequency === 'recurring'}
                    onChange={() => setFrequency('recurring')}
                    className="accent-[hsl(var(--primary))]"
                  />
                  <span className="text-sm text-[hsl(var(--foreground))]">Recurring</span>
                </label>
              </div>
            ) : (
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded inline-block",
                task?.frequency === 'recurring'
                  ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              )}>
                {task?.frequency === 'recurring' ? 'Recurring' : 'One-time'}
              </span>
            )}
          </div>

          {/* Schedule / Start Date */}
          <div>
            <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">
              {frequency === 'recurring' ? 'Schedule' : 'Start Date / Time'}
            </label>
            {isEditing ? (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--subtle))]" />
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder={frequency === 'recurring' ? "e.g., Every Monday at 9AM" : "e.g., Feb 5 at 5:00 PM"}
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                />
              </div>
            ) : task?.schedule ? (
              <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                <Calendar className="w-4 h-4" />
                {task.schedule}
              </div>
            ) : (
              <p className="text-sm text-[hsl(var(--subtle))]">No schedule set</p>
            )}
          </div>

          {/* Prompt queue (in-progress only) */}
          {showPromptQueue && (
            <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
              <label className="text-sm font-medium text-[hsl(var(--foreground))] block">
                Prompt queue
              </label>
              <div className="flex gap-2">
                <textarea
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="Enter a prompt..."
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddPrompt}
                  disabled={!newPromptText.trim()}
                  className="shrink-0 px-3 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add prompt to the queue
                </button>
              </div>
              {promptQueue.length > 0 && (
                <ul className="space-y-2">
                  {promptQueue.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))]"
                    >
                      {editingPromptId === p.id ? (
                        <>
                          <textarea
                            value={editingPromptText}
                            onChange={(e) => setEditingPromptText(e.target.value)}
                            rows={2}
                            className="flex-1 px-2 py-1.5 rounded text-sm bg-[hsl(var(--input))] border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
                            autoFocus
                          />
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              onClick={handleSaveEditPrompt}
                              disabled={!editingPromptText.trim()}
                              className="p-1.5 rounded text-[hsl(var(--success))] hover:bg-[hsl(var(--muted))] disabled:opacity-50"
                              aria-label="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditPrompt}
                              className="p-1.5 rounded text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                              aria-label="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="flex-1 text-sm text-[hsl(var(--foreground))] min-w-0 break-words">
                            {p.text}
                          </p>
                          <div className="flex shrink-0 items-center gap-1">
                            {p.executed ? (
                              <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]">
                                Executed
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditPrompt(p)}
                                  className="p-1.5 rounded text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                                  aria-label="Edit prompt"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePrompt(p.id)}
                                  className="p-1.5 rounded text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10"
                                  aria-label="Delete prompt"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {mode === 'view' ? (
            <button
              onClick={() => onClose()}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreate ? 'Create Task' : 'Save Changes'}
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

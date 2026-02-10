import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bot, User, GripVertical, Trash2, Check, X, PauseCircle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface KanbanTaskProps {
  task: Task;
  isOverlay?: boolean;
  onView?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onApprove?: (taskId: string) => void;
  onRefuse?: (taskId: string) => void;
  onPauseRequest?: (taskId: string, isCurrentlyPaused: boolean) => void;
}

export function KanbanTask({ task, isOverlay = false, onView, onDelete, onApprove, onRefuse, onPauseRequest }: KanbanTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.delete-btn') || (e.target as HTMLElement).closest('.pause-play-btn')) {
      return;
    }
    onView?.(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(task.id);
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30"
      >
        <TaskContent task={task} isOverlay={isOverlay} onDelete={handleDelete} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        'cursor-grab active:cursor-grabbing',
        isOverlay && 'cursor-grabbing rotate-2'
      )}
    >
      <TaskContent task={task} isOverlay={isOverlay} onDelete={handleDelete} onApprove={onApprove} onRefuse={onRefuse} onPauseRequest={onPauseRequest} />
    </div>
  );
}

interface TaskContentProps {
  task: Task;
  isOverlay?: boolean;
  onDelete: (e: React.MouseEvent) => void;
  onApprove?: (taskId: string) => void;
  onRefuse?: (taskId: string) => void;
  onPauseRequest?: (taskId: string, isCurrentlyPaused: boolean) => void;
}

function TaskContent({ task, isOverlay, onDelete, onApprove, onRefuse, onPauseRequest }: TaskContentProps) {
  const isPaused = task.status === 'in-progress' && task.isPaused;

  const handlePauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPauseRequest?.(task.id, !!task.isPaused);
  };

  return (
    <div
      className={cn(
        'relative bg-[hsl(var(--card))] border border-[hsl(var(--card-border))] rounded-lg p-4',
        'hover:border-[hsl(var(--primary))] transition-colors group',
        isOverlay && 'shadow-xl ring-1 ring-[hsl(var(--primary))]'
      )}
    >
      {/* Card content: dimmed when paused (play/pause stays full opacity via footer) */}
      <div className={cn(isPaused && 'opacity-65 transition-opacity')}>
        {/* Drag Handle & Header */}
        <div className="flex items-start gap-2 mb-2">
          <GripVertical className="w-4 h-4 text-[hsl(var(--subtle))] mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[hsl(var(--foreground))] text-sm leading-tight">
              {task.title}
            </h4>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3 line-clamp-2 pl-6">
          {task.description}
        </p>

        {/* Frequency & Schedule */}
        <div className="pl-6 mb-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
              task.frequency === 'recurring'
                ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
            )}>
              {task.frequency}
            </span>
            {task.schedule && (
              <span className="text-xs text-[hsl(var(--foreground))] font-medium">
                {task.schedule}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: assignee + buttons; play/pause not dimmed when paused */}
      <div className="flex items-center justify-between pl-6 mt-2 pt-2 border-t border-[hsl(var(--border))]">
        <div className={cn('flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]', isPaused && 'opacity-65 transition-opacity')}>
          {task.assignee === 'agent' ? (
            <Bot className="w-3.5 h-3.5" />
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
          <span className="truncate max-w-[80px]">{task.assigneeName}</span>
        </div>

        <div className="flex items-center gap-2">
          {task.status === 'pending-approval' ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRefuse?.(task.id);
                }}
                className="p-1.5 rounded-md text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive-muted))] transition-colors"
                title="Refuse"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove?.(task.id);
                }}
                className="p-1.5 rounded-md text-[hsl(var(--success))] hover:bg-[hsl(var(--success))/10] transition-colors"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
            </>
          ) : task.status === 'in-progress' ? (
            <>
              <button
                onClick={handlePauseClick}
                className="pause-play-btn p-1.5 rounded-md text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning))/10] transition-colors"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <PlayCircle className="w-4 h-4" />
                ) : (
                  <PauseCircle className="w-4 h-4" />
                )}
              </button>
              <div className={cn(isPaused && 'opacity-65 transition-opacity')}>
                <button
                  onClick={onDelete}
                  className="delete-btn p-1.5 rounded-md hover:bg-[hsl(var(--destructive-muted))] hover:text-[hsl(var(--destructive))] text-[hsl(var(--subtle))] transition-all"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onDelete}
              className="delete-btn p-1.5 rounded-md hover:bg-[hsl(var(--destructive-muted))] hover:text-[hsl(var(--destructive))] text-[hsl(var(--subtle))] transition-all"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

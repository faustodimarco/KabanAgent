import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { KanbanTask } from './KanbanTask';
import type { Task, Column } from '@/types';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask?: () => void;
  onViewTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onApproveTask?: (taskId: string) => void;
  onRefuseTask?: (taskId: string) => void;
  onPauseRequest?: (taskId: string, isCurrentlyPaused: boolean) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onViewTask,
  onDeleteTask,
  onApproveTask,
  onRefuseTask,
  onPauseRequest,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[300px] flex flex-col h-full bg-[hsl(var(--surface))] rounded-lg border border-[hsl(var(--border))] ${isOver ? 'ring-2 ring-[hsl(var(--primary))]' : ''
        }`}
    >
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[hsl(var(--foreground))]">
            {column.title}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="p-1.5 rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
            title="Add new task"
          >
            <Plus className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
        )}
      </div>

      {/* Tasks */}
      <div className="flex-1 p-3 space-y-3 min-h-[200px] overflow-y-auto scrollbar-thin">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanTask
              key={task.id}
              task={task}
              onView={onViewTask}
              onDelete={onDeleteTask}
              onApprove={onApproveTask}
              onRefuse={onRefuseTask}
              onPauseRequest={onPauseRequest}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-[hsl(var(--border))] rounded-lg opacity-50">
            <p className="text-sm text-[hsl(var(--subtle))]">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}

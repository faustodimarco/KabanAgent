import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type DropAnimation,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
} from '@dnd-kit/sortable';
import { mockTasks, columns } from '@/data/mockData';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTask } from './KanbanTask';
import { TaskModal } from '@/components/TaskModal';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { RefusalDialog } from '@/components/RefusalDialog';
import type { Task, TaskStatus } from '@/types';

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState<'view' | 'create' | 'edit'>('view');

  // Confirmation dialog state
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToRefuse, setTaskToRefuse] = useState<string | null>(null);
  const [taskToPause, setTaskToPause] = useState<{ taskId: string; isCurrentlyPaused: boolean } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask) return;

    // If dragging over a column (not a task)
    const overColumn = columns.find((c) => c.id === over.id);
    if (overColumn && activeTask.status !== overColumn.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overColumn.id } : t
        )
      );
      return;
    }

    // If dragging over another task in a different column
    if (overTask && activeTask.status !== overTask.status) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // If dropped on another task in the same column, reorder
    if (overTask && activeTask.status === overTask.status && activeId !== over.id) {
      const columnTasks = tasks.filter((t) => t.status === activeTask.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);

      const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

      // Merge reordered tasks with other columns
      const otherTasks = tasks.filter((t) => t.status !== activeTask.status);
      setTasks([...otherTasks, ...reorderedColumnTasks]);
    }

    setActiveId(null);
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  // Task handlers
  const handleAddTask = () => {
    setSelectedTask(null);
    setTaskModalMode('create');
    setIsTaskModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalMode(task.status === 'todo' ? 'edit' : 'view');
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Edit existing task (merge partial updates e.g. promptQueue-only)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
                assigneeName:
                  taskData.assignee !== undefined
                    ? taskData.assignee === 'agent'
                      ? 'Kimi'
                      : 'You'
                    : t.assigneeName,
              }
            : t
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: `t${Date.now()}`,
        title: taskData.title || '',
        description: taskData.description || '',
        status: 'todo',
        assignee: taskData.assignee || 'human',
        assigneeName: taskData.assignee === 'agent' ? 'Kimi' : 'You',
        createdAt: new Date().toISOString(),
        frequency: taskData.frequency || 'one-time',
        schedule: taskData.schedule,
      };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      setTaskToDelete(null);
    }
  };

  const handleApproveTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: 'completed' } : t
      )
    );
  };

  const handleRefuseTask = (taskId: string) => {
    setTaskToRefuse(taskId);
  };

  const handlePauseRequest = (taskId: string, isCurrentlyPaused: boolean) => {
    setTaskToPause({ taskId, isCurrentlyPaused });
  };

  const confirmPauseResume = () => {
    if (taskToPause) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskToPause.taskId ? { ...t, isPaused: !t.isPaused } : t
        )
      );
      setTaskToPause(null);
    }
  };

  const confirmRefuse = (reason: string) => {
    if (taskToRefuse) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskToRefuse
            ? {
              ...t,
              status: 'in-progress',
              description: `${t.description}\n\n[Refusal Note]: ${reason}`,
            }
            : t
        )
      );
      setTaskToRefuse(null);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-full overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onAddTask={column.id === 'todo' ? handleAddTask : undefined}
              onViewTask={handleViewTask}
              onDeleteTask={handleDeleteTask}
              onApproveTask={handleApproveTask}
              onRefuseTask={handleRefuseTask}
              onPauseRequest={handlePauseRequest}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <KanbanTask task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
        mode={taskModalMode}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Task?"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Refusal Dialog */}
      <RefusalDialog
        isOpen={!!taskToRefuse}
        onClose={() => setTaskToRefuse(null)}
        onConfirm={confirmRefuse}
        title="Refuse Task"
        description="Please provide a reason for refusing this task. It will be moved back to In Progress."
      />

      {/* Pause/Resume Confirmation */}
      <ConfirmationDialog
        isOpen={!!taskToPause}
        onClose={() => setTaskToPause(null)}
        onConfirm={confirmPauseResume}
        title={taskToPause?.isCurrentlyPaused ? 'Resume this task?' : 'Pause this task?'}
        description="Are you sure?"
        confirmText={taskToPause?.isCurrentlyPaused ? 'Resume' : 'Pause'}
        cancelText="Cancel"
      />
    </>
  );
}

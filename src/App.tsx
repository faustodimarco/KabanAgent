import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Sidebar } from '@/sections/Sidebar';
import { Header } from '@/sections/Header';
import { DashboardContent } from '@/sections/DashboardContent';
import { ActivityFeed } from '@/sections/ActivityFeed';
// import { KanbanBoard } from '@/sections/KanbanBoard';
import { CheckSquare, Activity } from 'lucide-react';
import { mockActivities, mockTasks } from '@/data/mockData';

import { TaskModal } from '@/components/TaskModal';
import type { Task } from '@/types';

// Activity View
function ActivityView() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-[hsl(var(--info))]" />
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Activity Log
        </h2>
      </div>
      <ActivityFeed activities={mockActivities} />
    </div>
  );
}

// Done, Pending Approval View - List
function CompletedTasksView() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const completedTasks = mockTasks.filter((t) => t.status === 'pending-approval');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckSquare className="w-6 h-6 text-[hsl(var(--success))]" />
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Done, Pending Approval
        </h2>
      </div>
      <div className="space-y-3">
        {completedTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleTaskClick(task)}
            className="group cursor-pointer p-4 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-between hover:border-[hsl(var(--primary)/50)] transition-all"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-[hsl(var(--foreground))]">
                  {task.title}
                </h3>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                  task.frequency === 'recurring'
                    ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                    : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                )}>
                  {task.frequency}
                </span>
                {task.schedule && (
                  <span className="text-xs text-[hsl(var(--muted-foreground))] font-medium">
                    • {task.schedule}
                  </span>
                )}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {task.description}
              </p>
            </div>
            <div className="flex items-center gap-6 pl-4">
              <div className="text-right">
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Completed by
                </p>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {task.assigneeName}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask || undefined}
        mode="view"
        onSave={() => { }}
      />
    </div >
  );
}

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const getHeaderTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Manage your tasks' };
      case 'completed-tasks':
        return { title: 'Done, Pending Approval', subtitle: 'View finished items' };
      case 'activity':
        return { title: 'Activity', subtitle: 'Recent updates' };
      default:
        return { title: 'Dashboard', subtitle: 'Manage your tasks' };
    }
  };

  const headerInfo = getHeaderTitle();

  return (
    <div className="flex h-screen bg-[hsl(var(--background))]">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={headerInfo.title} subtitle={headerInfo.subtitle} />

        <div className="flex-1 overflow-auto scrollbar-thin">
          {activeSection === 'dashboard' && <DashboardContent />}
          {activeSection === 'completed-tasks' && <CompletedTasksView />}
          {activeSection === 'activity' && <ActivityView />}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

import { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'completed-tasks', label: 'Done, Pending Approval', icon: CheckSquare },
  { id: 'activity', label: 'Activity', icon: Activity },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'h-screen bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]',
        'flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-[hsl(var(--primary-foreground))]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[hsl(var(--sidebar-foreground))]">
                AgentHub
              </span>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                Collaboration
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'w-full flex items-center justify-start gap-3 px-2.5 py-2.5 h-[47px] rounded-[8px] text-sm font-medium transition-all',
                'hover:bg-[hsl(var(--muted))]',
                isActive
                  ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]'
                  : 'text-[hsl(var(--sidebar-foreground))]'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Agent Status */}
      {!collapsed && (
        <div className="px-4 py-3 mx-4 mb-4 rounded-lg bg-[hsl(var(--agent-muted))] border border-[hsl(var(--agent))]/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[hsl(var(--agent))]" />
            <span className="text-xs font-medium text-[hsl(var(--agent))]">
              Agent Online
            </span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Ready to collaborate on your tasks
          </p>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-[hsl(var(--sidebar-border))]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          )}
        </button>
      </div>
    </aside>
  );
}

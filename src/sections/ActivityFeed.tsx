import { Bot, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Activity } from '@/types';

interface ActivityFeedProps {
  activities: Activity[];
}

const typeConfig: Record<string, { icon: typeof Bot; bg: string; text: string }> = {
  agent: {
    icon: Bot,
    bg: 'bg-[hsl(var(--agent-muted))]',
    text: 'text-[hsl(var(--agent))]',
  },
  human: {
    icon: User,
    bg: 'bg-[hsl(var(--human-muted))]',
    text: 'text-[hsl(var(--human))]',
  },
  system: {
    icon: Settings,
    bg: 'bg-[hsl(var(--muted))]',
    text: 'text-[hsl(var(--muted-foreground))]',
  },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Recent Activity
        </h2>

      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--card-border))] rounded-lg overflow-hidden">
        <div className="divide-y divide-[hsl(var(--border))]">
          {activities.map((activity) => {
            const Icon = typeConfig[activity.type].icon;
            const config = typeConfig[activity.type];

            return (
              <div
                key={activity.id}
                className="p-4 hover:bg-[hsl(var(--surface))] transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      config.bg
                    )}
                  >
                    <Icon className={cn('w-4 h-4', config.text)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-[hsl(var(--foreground))]">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-[hsl(var(--subtle))] flex-shrink-0">
                        {activity.timestamp}
                      </span>
                    </div>

                    {/* Task Tag */}
                    {activity.taskTitle && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))]">
                          {activity.taskTitle}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

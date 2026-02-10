import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Bot, User, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'agent' | 'human' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'agent',
    title: 'Task completed',
    message: 'Kimi finished "Security audit"',
    timestamp: '10 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'human',
    title: 'Task assigned',
    message: 'Sarah assigned you "Review design"',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Due date reminder',
    message: '"Homepage design" is due tomorrow',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'agent',
    title: 'Code generated',
    message: 'Kimi created authentication middleware',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'human',
    title: 'Comment added',
    message: 'Mike left feedback on API docs',
    timestamp: '5 hours ago',
    read: true,
  },
];

const typeConfig = {
  agent: { icon: Bot, bg: 'bg-[hsl(var(--agent-muted))]', text: 'text-[hsl(var(--agent))]' },
  human: { icon: User, bg: 'bg-[hsl(var(--human-muted))]', text: 'text-[hsl(var(--human))]' },
  system: { icon: Settings, bg: 'bg-[hsl(var(--muted))]', text: 'text-[hsl(var(--muted-foreground))]' },
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center transition-all relative',
          'bg-[hsl(var(--input))] border border-[hsl(var(--border))]',
          'hover:bg-[hsl(var(--muted))]',
          isOpen && 'ring-2 ring-[hsl(var(--primary))]'
        )}
      >
        <Bell className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] text-[10px] font-medium flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
            <h3 className="font-semibold text-[hsl(var(--foreground))]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-[hsl(var(--subtle))] mx-auto mb-2" />
                <p className="text-sm text-[hsl(var(--muted-foreground))]">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = typeConfig[notification.type].icon;
                const config = typeConfig[notification.type];

                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      'p-4 border-b border-[hsl(var(--border))] last:border-b-0 cursor-pointer hover:bg-[hsl(var(--surface))] transition-colors group relative',
                      !notification.read && 'bg-[hsl(var(--surface))]/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                          config.bg
                        )}
                      >
                        <Icon className={cn('w-4 h-4', config.text)} />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm text-[hsl(var(--foreground))]">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />
                          )}
                        </div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[hsl(var(--subtle))] mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => dismissNotification(notification.id, e)}
                      className="absolute right-2 top-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[hsl(var(--muted))] transition-all"
                    >
                      <X className="w-3 h-3 text-[hsl(var(--subtle))]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

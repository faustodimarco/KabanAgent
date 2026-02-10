import { Sun, Moon, Search, Command } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-[hsl(var(--surface-elevated))] border-b border-[hsl(var(--border))] px-6 flex items-center justify-between">
      {/* Left: Title */}
      <div>
        <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{subtitle}</p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))]">
          <Search className="w-4 h-4 text-[hsl(var(--subtle))]" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-[hsl(var(--subtle))]"
          />
          <div className="flex items-center gap-1 text-[hsl(var(--subtle))]">
            <Command className="w-3 h-3" />
            <span className="text-xs">K</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
            'bg-[hsl(var(--input))] border border-[hsl(var(--border))]',
            'hover:bg-[hsl(var(--muted))] hover:border-[hsl(var(--ring))]'
          )}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          ) : (
            <Sun className="w-4 h-4 text-[hsl(var(--warning))]" />
          )}
        </button>

        {/* Notifications */}
        <NotificationDropdown />


      </div>
    </header>
  );
}

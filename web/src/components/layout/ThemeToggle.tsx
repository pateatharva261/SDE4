'use client';

import * as React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { useHasMounted } from '@/hooks/useHasMounted';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

  if (!mounted) {
    return <div className="w-9 h-9 rounded-md bg-bg-elev2 border border-border/40 animate-pulse" />;
  }

  const isDark = theme === 'dark';

  const toggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-bg-elev/80 border border-transparent hover:border-border/60 text-text-dim hover:text-text transition-all duration-150 focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-bg cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-[18px] h-[18px] transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}

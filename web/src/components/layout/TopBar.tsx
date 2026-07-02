'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useUiStore } from '@/stores/ui-store';
import { useProgress } from '@/hooks/useProgress';
import { buildFlatList } from '@/lib/curriculum';
import { ThemeToggle } from './ThemeToggle';
import { Menu, BookOpen, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { toast } from 'sonner';

export function TopBar() {
  const pathname = usePathname() || '';
  const { setSidebarOpen, activeFlashcards, setFlashcardsOpen } = useUiStore();
  const { completed, toggle } = useProgress();
  const shouldReduceMotion = useReducedMotion();

  const flatList = React.useMemo(() => buildFlatList(), []);
  const currentItem = flatList.find((i) => i.url === pathname);

  const isLesson = currentItem?.kind === 'lesson';
  const isDone = currentItem && completed[currentItem.id];

  // Derive crumb label
  const crumbLabel = React.useMemo(() => {
    if (currentItem) {
      if (currentItem.kind === 'lesson') {
        return `Part ${currentItem.part} · Lesson ${currentItem.id}`;
      } else if (currentItem.kind === 'doc') {
        return `Getting Started · ${currentItem.title}`;
      } else {
        return `Reference · ${currentItem.title}`;
      }
    }

    // Fallbacks for main routes
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/learn') return 'Curriculum Overview';
    if (pathname === '/docs') return 'Getting Started';
    if (pathname === '/reference') return 'Reference Sheets';
    if (pathname === '/flashcards') return 'Flashcard Review';
    if (pathname === '/labs') return 'Interactive Labs';
    if (pathname.startsWith('/labs/')) return 'Lab Workspace';
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/search') return 'Search';
    if (pathname === '/about') return 'About';
    return 'System Design Mastery';
  }, [currentItem, pathname]);

  const handleToggleComplete = () => {
    if (currentItem) {
      toggle(currentItem.id);
      const isNowDone = !completed[currentItem.id];
      if (isNowDone) {
        toast.success('Lesson marked complete!');
      } else {
        toast.info('Lesson marked incomplete');
      }
    }
  };

  const openFlashcards = () => {
    setFlashcardsOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 md:h-[56px] w-full items-center justify-between border-b border-border/40 bg-bg/70 px-4 backdrop-blur-md select-none">
      {/* Left side: Hamburger (mobile) & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-text-dim hover:text-text hover:bg-bg-elev/80 border border-transparent hover:border-border/40 transition-colors md:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Cross-fading breadcrumbs */}
        <div className="text-[13px] font-medium tracking-tight text-text font-mono truncate">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={pathname}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="inline-block"
            >
              {crumbLabel}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Right side: Action items & Theme Toggle */}
      <div className="flex items-center gap-2">
        {/* Flashcards review button (visible only if lesson has cards) */}
        {isLesson && activeFlashcards.length > 0 && (
          <button
            onClick={openFlashcards}
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded bg-accent/10 border border-accent/20 hover:border-accent/40 text-accent font-medium text-xs transition-colors hover:bg-accent/15 cursor-pointer focus-visible:ring-2 ring-accent"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Review cards ({activeFlashcards.length})
          </button>
        )}

        {/* Mark complete button (visible only on lesson pages) */}
        {isLesson && currentItem && (
          <button
            onClick={handleToggleComplete}
            className={`flex items-center gap-1.5 h-8 px-3 rounded text-xs font-semibold border transition-all duration-150 cursor-pointer focus-visible:ring-2 ${
              isDone
                ? 'bg-done/15 border-done/35 text-done hover:bg-done/20'
                : 'bg-bg-elev border-border/60 hover:border-border text-text-dim hover:text-text'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isDone ? '✓ Completed' : 'Mark complete'}</span>
          </button>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}

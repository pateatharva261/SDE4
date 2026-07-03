'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useUiStore } from '@/stores/ui-store';
import { useProgress } from '@/hooks/useProgress';
import { buildFlatList } from '@/lib/curriculum';
import { ThemeToggle } from './ThemeToggle';
import {
  Menu,
  BookOpen,
  CheckCircle,
  Keyboard,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHasMounted } from '@/hooks/useHasMounted';
import { toast } from 'sonner';

export function TopBar() {
  const pathname = usePathname() || '';
  const {
    setSidebarOpen,
    activeFlashcards,
    setFlashcardsOpen,
    setShortcutsOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
  } = useUiStore();
  const { completed, toggle } = useProgress();
  const shouldReduceMotion = useReducedMotion();
  const mounted = useHasMounted();

  const flatList = React.useMemo(() => buildFlatList(), []);
  const currentItem = flatList.find((i) => i.url === pathname);

  const isLesson = currentItem?.kind === 'lesson';
  const isDone = mounted && currentItem && completed[currentItem.id];

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
      toast[isNowDone ? 'success' : 'info'](
        isNowDone ? 'Lesson marked complete!' : 'Lesson marked incomplete'
      );
    }
  };

  /** Shared icon-button class */
  const iconBtn = (extra = '') =>
    `flex h-8 w-8 items-center justify-center rounded-md border border-transparent
     hover:border-border/40 transition-colors cursor-pointer focus-visible:ring-2
     ring-accent ${extra}`;

  return (
    <header
      className="sticky top-0 z-30 flex h-14 md:h-[56px] w-full items-center justify-between border-b border-border/40 bg-bg/70 px-4 backdrop-blur-md select-none"
      style={{ transition: 'padding 240ms cubic-bezier(0.25, 1, 0.5, 1)' }}
    >
      {/* Left side */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={iconBtn('text-text-dim hover:text-text hover:bg-bg-elev/80 md:hidden')}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar collapse toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className={iconBtn('hidden md:flex text-text-dim hover:text-text hover:bg-bg-elev/80')}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar  [' : 'Collapse sidebar  ['}
        >
          {sidebarCollapsed
            ? <PanelLeftOpen className="w-4.5 h-4.5" />
            : <PanelLeftClose className="w-4.5 h-4.5" />
          }
        </button>

        {/* Breadcrumb */}
        <div className="text-[13px] font-medium tracking-tight text-text font-mono truncate ml-1">
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

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Flashcard review button — icon only */}
        {isLesson && activeFlashcards.length > 0 && (
          <button
            onClick={() => setFlashcardsOpen(true)}
            className={iconBtn('hidden sm:flex text-accent bg-accent/10 hover:bg-accent/20 border-accent/20 hover:border-accent/40')}
            aria-label={`Review ${activeFlashcards.length} flashcards`}
            title={`Review cards (${activeFlashcards.length})`}
          >
            <BookOpen className="w-4 h-4" />
          </button>
        )}

        {/* Mark complete button — icon only */}
        {isLesson && currentItem && (
          <button
            onClick={handleToggleComplete}
            className={iconBtn(
              isDone
                ? 'text-done bg-done/15 border-done/35 hover:bg-done/25'
                : 'text-text-dim hover:text-text bg-bg-elev hover:bg-bg-elev2'
            )}
            aria-label={isDone ? 'Mark lesson incomplete' : 'Mark lesson complete'}
            title={isDone ? 'Mark incomplete  (c)' : 'Mark complete  (c)'}
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}

        {/* Keyboard shortcuts help button */}
        <button
          onClick={() => setShortcutsOpen(true)}
          className={iconBtn('text-text-dim hover:text-text hover:bg-bg-elev/80')}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts  (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}

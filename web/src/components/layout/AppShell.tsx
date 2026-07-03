'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileDrawer } from './MobileDrawer';
import { FlashcardDialog } from '@/components/flashcards/FlashcardDialog';
import { ShortcutsModal } from '@/components/shared/ShortcutsModal';
import { DiagramModal } from '@/components/shared/DiagramModal';
import { buildFlatList } from '@/lib/curriculum';
import { useTheme } from '@/hooks/useTheme';
import { useUiStore } from '@/stores/ui-store';
import { useProgress } from '@/hooks/useProgress';
import { toast } from 'sonner';

interface AppShellProps {
  children: React.ReactNode;
}

/** True when scrolled within `threshold` px of the bottom */
function isAtBottom(el: HTMLElement, threshold = 80): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
}

/** True when keyboard event originates from a text input */
function isTyping(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement;
  return t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const { setTheme } = useTheme();
  const {
    setShortcutsOpen,
    shortcutsOpen,
    setFlashcardsOpen,
    toggleSidebarCollapsed,
  } = useUiStore();
  const { toggle: toggleComplete } = useProgress();
  const flatList = React.useMemo(() => buildFlatList(), []);
  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Always allow Escape to close the shortcuts modal
      if (e.key === 'Escape') {
        if (shortcutsOpen) {
          setShortcutsOpen(false);
        }
        return;
      }

      // Block all other shortcuts while modal is open or user is typing
      if (shortcutsOpen) return;
      if (isTyping(e)) return;

      const idx = flatList.findIndex((i) => i.url === pathname);
      const main = mainRef.current;

      switch (e.key) {
        // ── Navigation: anywhere ──────────────────────────────────────────
        case 'j':
          if (idx !== -1 && flatList[idx + 1]) router.push(flatList[idx + 1].url);
          break;

        case 'k':
          if (idx !== -1 && flatList[idx - 1]) router.push(flatList[idx - 1].url);
          break;

        // ── Navigation: end-of-page only (Arrow keys) ─────────────────────
        case 'ArrowRight':
          if (!main || !isAtBottom(main)) break;
          if (idx !== -1 && flatList[idx + 1]) {
            e.preventDefault();
            router.push(flatList[idx + 1].url);
          }
          break;

        case 'ArrowLeft':
          if (!main || !isAtBottom(main)) break;
          if (idx !== -1 && flatList[idx - 1]) {
            e.preventDefault();
            router.push(flatList[idx - 1].url);
          }
          break;

        // ── Scroll ────────────────────────────────────────────────────────
        case ' ':
          if (!main) break;
          e.preventDefault();
          main.scrollBy({
            top: e.shiftKey ? -(main.clientHeight * 0.8) : main.clientHeight * 0.8,
            behavior: e.repeat ? 'instant' : 'smooth',
          });
          break;

        // ── Lesson actions ────────────────────────────────────────────────
        case 'c': {
          const item = flatList.find((i) => i.url === pathname);
          if (item?.kind === 'lesson') {
            toggleComplete(item.id);
            toast.success('Lesson completion toggled');
          }
          break;
        }

        case 'f':
          setFlashcardsOpen(true);
          break;

        // ── Appearance ────────────────────────────────────────────────────
        case 'l':
          setTheme('light');
          break;

        case 'n':
          setTheme('dark');
          break;

        case '[':
          toggleSidebarCollapsed();
          break;

        // ── General ───────────────────────────────────────────────────────
        case '?':
          setShortcutsOpen(true);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    pathname,
    flatList,
    router,
    setTheme,
    shortcutsOpen,
    setShortcutsOpen,
    setFlashcardsOpen,
    toggleSidebarCollapsed,
    toggleComplete,
  ]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text font-sans">
      <Sidebar />
      <MobileDrawer />
      <FlashcardDialog />
      <ShortcutsModal />
      <DiagramModal />

      {/*
       * flex-1 + transition so the main area smoothly expands when the sidebar
       * width animates to 0. The transition duration matches Sidebar's 240ms.
       */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
        style={{ transition: 'flex 240ms cubic-bezier(0.25, 1, 0.5, 1)' }}
      >
        <TopBar />
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto scroll-smooth [scrollbar-gutter:stable] bg-bg"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileDrawer } from './MobileDrawer';
import { FlashcardDialog } from '@/components/flashcards/FlashcardDialog';
import { useHotkeys } from '@/hooks/useHotkeys';
import { buildFlatList } from '@/lib/curriculum';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const flatList = React.useMemo(() => buildFlatList(), []);

  // Keyboard shortcut 'j' -> Next sequential document/lesson
  useHotkeys('j', () => {
    const idx = flatList.findIndex((i) => i.url === pathname);
    if (idx !== -1 && flatList[idx + 1]) {
      router.push(flatList[idx + 1].url);
    }
  }, {}, [pathname, flatList, router]);

  // Keyboard shortcut 'k' -> Previous sequential document/lesson
  useHotkeys('k', () => {
    const idx = flatList.findIndex((i) => i.url === pathname);
    if (idx !== -1 && flatList[idx - 1]) {
      router.push(flatList[idx - 1].url);
    }
  }, {}, [pathname, flatList, router]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text font-sans">
      {/* Desktop Sidebar Layout */}
      <Sidebar />

      {/* Mobile Drawer Menu */}
      <MobileDrawer />

      {/* Global Flashcard Review Overlay */}
      <FlashcardDialog />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto scroll-smooth [scrollbar-gutter:stable] bg-bg">
          {children}
        </main>
      </div>
    </div>
  );
}

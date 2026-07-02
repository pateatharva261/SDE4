'use client';

import * as React from 'react';
import { useUiStore } from '@/stores/ui-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { X } from 'lucide-react';
import { NavTree } from './NavTree';
import { SidebarHeader } from './SidebarHeader';
import { ProgressWidget } from './ProgressWidget';
import { SearchInput } from './SearchInput';

export function MobileDrawer() {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const slideTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 380, damping: 35 };

  const fadeTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.15 };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs md:hidden"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={slideTransition}
            className="fixed inset-y-0 left-0 z-50 w-[300px] bg-bg-elev/95 backdrop-blur-md border-r border-border/40 flex flex-col md:hidden shadow-lg"
          >
            {/* Header / Brand */}
            <div className="p-4 flex items-center justify-between border-b border-border/30">
              <SidebarHeader closeDrawer={() => setSidebarOpen(false)} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-md text-text-dim hover:text-text hover:bg-bg-elev2/80 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Scrollable Nav Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <ProgressWidget />
              <SearchInput />
              <NavTree onItemClick={() => setSidebarOpen(false)} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

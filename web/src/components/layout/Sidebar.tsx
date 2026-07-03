'use client';

import * as React from 'react';
import { SidebarHeader } from './SidebarHeader';
import { ProgressWidget } from './ProgressWidget';
import { SearchInput } from './SearchInput';
import { NavTree } from './NavTree';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerParent, staggerChild } from '@/lib/motion';
import { useUiStore } from '@/stores/ui-store';

export function Sidebar() {
  const { sidebarCollapsed } = useUiStore();

  return (
    /*
     * The sidebar stays in the flex flow at all times — we animate its width
     * from var(--sidebar-w) to 0 rather than unmounting it. This lets the
     * flex-1 main area grow/shrink smoothly without a layout jump.
     *
     * overflow-hidden is critical: it clips the content as the width shrinks
     * so nothing bleeds out during the transition.
     */
    <aside
      className="hidden md:flex flex-col shrink-0 h-full bg-bg-elev/75 backdrop-blur-md border-r border-border/40 select-none overflow-hidden"
      style={{
        width: sidebarCollapsed ? 0 : 'var(--sidebar-w)',
        minWidth: 0,
        transition: 'width 240ms cubic-bezier(0.25, 1, 0.5, 1)',
        borderRightWidth: sidebarCollapsed ? 0 : undefined,
      }}
    >
      {/*
       * Inner wrapper is fixed at --sidebar-w so content never reflows or
       * wraps during the width animation — it just gets clipped by the outer.
       */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerParent}
        className="flex flex-col h-full"
        style={{ width: 'var(--sidebar-w)', minWidth: 'var(--sidebar-w)' }}
      >
        {/* 1. Header */}
        <motion.div variants={staggerChild} className="p-4 border-b border-border/30 shrink-0">
          <SidebarHeader />
        </motion.div>

        {/* 2. Progress & Search */}
        <div className="p-4 space-y-3.5 border-b border-border/20 shrink-0">
          <motion.div variants={staggerChild}>
            <ProgressWidget />
          </motion.div>
          <motion.div variants={staggerChild}>
            <SearchInput />
          </motion.div>
        </div>

        {/* 3. Nav Tree */}
        <motion.div
          variants={staggerChild}
          className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth [scrollbar-gutter:stable] hover:[scrollbar-color:rgba(255,255,255,0.06)_transparent]"
        >
          <NavTree />
        </motion.div>
      </motion.div>
    </aside>
  );
}

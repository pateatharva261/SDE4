'use client';

import * as React from 'react';
import { SidebarHeader } from './SidebarHeader';
import { ProgressWidget } from './ProgressWidget';
import { SearchInput } from './SearchInput';
import { NavTree } from './NavTree';
import { motion } from 'framer-motion';
import { staggerParent, staggerChild } from '@/lib/motion';

export function Sidebar() {
  return (
    <motion.aside
      initial="initial"
      animate="animate"
      variants={staggerParent}
      className="hidden md:flex flex-col w-[var(--sidebar-w)] shrink-0 h-full bg-bg-elev/75 backdrop-blur-md border-r border-border/40 select-none overflow-hidden"
    >
      {/* 1. Header Section */}
      <motion.div variants={staggerChild} className="p-4 border-b border-border/30">
        <SidebarHeader />
      </motion.div>

      {/* 2. Interactive widgets (progress & search) */}
      <div className="p-4 space-y-3.5 border-b border-border/20">
        <motion.div variants={staggerChild}>
          <ProgressWidget />
        </motion.div>
        <motion.div variants={staggerChild}>
          <SearchInput />
        </motion.div>
      </div>

      {/* 3. Navigation Tree */}
      <motion.div
        variants={staggerChild}
        className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth [scrollbar-gutter:stable] hover:[scrollbar-color:rgba(255,255,255,0.06)_transparent]"
      >
        <NavTree />
      </motion.div>
    </motion.aside>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';

interface SidebarHeaderProps {
  closeDrawer?: () => void;
}

export function SidebarHeader({ closeDrawer }: SidebarHeaderProps) {
  return (
    <Link
      href="/"
      onClick={closeDrawer}
      className="flex items-center gap-3 group select-none"
    >
      {/* Animated logo mark with subtle 4s hue shift glow */}
      <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-accent-2 p-[1px] flex items-center justify-center shrink-0 shadow-glow">
        <div className="w-full h-full rounded-[7px] bg-bg flex items-center justify-center font-mono font-extrabold text-[15px] text-accent group-hover:text-accent-2 transition-colors duration-200">
          S
        </div>
        {/* Hue shifting glow overlay */}
        <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-tr from-accent to-accent-2 opacity-50 blur-[6px] group-hover:opacity-85 transition-opacity duration-300 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="font-bold text-[15px] tracking-tight text-text group-hover:text-accent transition-colors duration-200">
          System Design Mastery
        </span>
        <span className="text-[11px] text-text-dim font-medium tracking-wide">
          SDE4 Learning Platform
        </span>
      </div>
    </Link>
  );
}

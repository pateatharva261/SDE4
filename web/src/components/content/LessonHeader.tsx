'use client';

import * as React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { buildFlatList } from '@/lib/curriculum';

interface LessonHeaderProps {
  difficulty: 'foundational' | 'intermediate' | 'advanced' | 'staff';
  readingTime: number;
  prerequisites: string[];
  unlocks: string[];
}

export function LessonHeader({ difficulty, readingTime, prerequisites, unlocks }: LessonHeaderProps) {
  const flatList = React.useMemo(() => buildFlatList(), []);

  // Match lesson ID to its route URL
  const getLessonUrl = React.useCallback((id: string) => {
    const item = flatList.find((i) => i.id === id);
    return item ? item.url : null;
  }, [flatList]);

  const diffConfig = {
    foundational: { text: 'Foundational', className: 'bg-done/10 text-done border-done/20' },
    intermediate: { text: 'Intermediate', className: 'bg-accent/10 text-accent border-accent/20' },
    advanced: { text: 'Advanced', className: 'bg-warn/10 text-warn border-warn/20' },
    staff: { text: 'Staff/Principal', className: 'bg-planned/10 text-text border-border/40' },
  }[difficulty] || { text: difficulty.toUpperCase(), className: 'bg-planned/10 text-text-dim border-border/40' };

  return (
    <div className="space-y-4 border-b border-border/20 pb-6 mb-8 select-none">
      {/* Badges and details */}
      <div className="flex flex-wrap items-center gap-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${diffConfig.className}`}>
          {diffConfig.text}
        </span>

        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-mono text-text-dim">
          <Clock className="w-4 h-4 text-accent" />
          {readingTime} min read
        </span>
      </div>

      {/* Prerequisites & Unlocks tags */}
      {(prerequisites.length > 0 || unlocks.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {prerequisites.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-wider text-text-dim/60 uppercase">
                Prerequisites
              </span>
              <div className="flex flex-wrap gap-1.5">
                {prerequisites.map((p) => {
                  const url = getLessonUrl(p);
                  return url ? (
                    <Link
                      key={p}
                      href={url}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-bg-elev2 border border-border/40 hover:border-accent/40 text-text-dim hover:text-accent font-mono text-[11px] transition-colors cursor-pointer"
                    >
                      {p}
                      <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
                    </Link>
                  ) : (
                    <span key={p} className="px-2 py-0.5 rounded bg-bg-elev2 border border-border/20 text-text-dim/60 font-mono text-[11px]">
                      {p}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {unlocks.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-wider text-text-dim/60 uppercase">
                Unlocks
              </span>
              <div className="flex flex-wrap gap-1.5">
                {unlocks.map((u) => {
                  const url = getLessonUrl(u);
                  return url ? (
                    <Link
                      key={u}
                      href={url}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-bg-elev2 border border-border/40 hover:border-accent/40 text-text-dim hover:text-accent font-mono text-[11px] transition-colors cursor-pointer"
                    >
                      {u}
                      <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
                    </Link>
                  ) : (
                    <span key={u} className="px-2 py-0.5 rounded bg-bg-elev2 border border-border/20 text-text-dim/60 font-mono text-[11px]">
                      {u}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

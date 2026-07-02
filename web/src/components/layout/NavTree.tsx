'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COURSE } from '@/data/manifest';
import { useUiStore } from '@/stores/ui-store';
import { useProgress } from '@/hooks/useProgress';
import { useHasMounted } from '@/hooks/useHasMounted';
import { PartBadge } from '@/components/shared/PartBadge';
import { ChevronDown, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface NavTreeProps {
  onItemClick?: () => void;
}

export function NavTree({ onItemClick }: NavTreeProps) {
  const pathname = usePathname() || '';
  const { collapsedParts, togglePart, searchQuery } = useUiStore();
  const { completed } = useProgress();
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();

  const filter = searchQuery.trim().toLowerCase();
  const isMatch = React.useCallback((title: string, id?: string) => {
    if (!filter) return true;
    return title.toLowerCase().includes(filter) || (id || '').toLowerCase().includes(filter);
  }, [filter]);

  // Expand animation options
  const expandTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.22, ease: [0.25, 1, 0.5, 1] as const };

  // Render a document row (backbone or reference)
  const renderDocRow = (d: { id: string; title: string; path: string; }, type: 'doc' | 'ref') => {
    // e.g. path: "00-START-HERE.md" -> url: "/docs/00-START-HERE"
    // path: "reference/tradeoff-worksheet.md" -> url: "/reference/tradeoff-worksheet"
    const slug = d.path.replace(/^(reference|lessons)\//, '').replace(/\.md$/, '');
    const url = type === 'doc' ? `/docs/${slug}` : `/reference/${slug}`;
    const isActive = pathname === url;

    return (
      <Link
        key={d.id}
        href={url}
        onClick={onItemClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-[13px] transition-all duration-150 select-none group cursor-pointer ${
          isActive
            ? 'bg-accent/10 border-accent/25 text-accent font-medium'
            : 'text-text-dim hover:text-text hover:bg-bg-elev/40 border border-transparent'
        }`}
      >
        <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-accent' : 'text-text-dim group-hover:text-text'}`} />
        <span className="truncate">{d.title}</span>
      </Link>
    );
  };

  // Render a lesson row
  const renderLessonRow = (l: { id: string; title: string; path: string; }) => {
    // path: "lessons/part-01-.../1.1.1-....md" -> url: "/learn/part-01-.../1.1.1-..."
    const slug = l.path.replace(/^lessons\//, '').replace(/\.md$/, '');
    const url = `/learn/${slug}`;
    const isActive = pathname === url;
    const isDone = mounted && completed[l.id];

    return (
      <Link
        key={l.id}
        href={url}
        onClick={onItemClick}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12.5px] transition-all duration-150 select-none group border border-transparent cursor-pointer ${
          isActive
            ? 'bg-accent/10 border-accent/25 text-accent font-medium'
            : 'text-text-dim hover:text-text hover:bg-bg-elev/40'
        }`}
      >
        {/* Completion check checkbox */}
        <div className={`w-4.5 h-4.5 flex items-center justify-center rounded border transition-colors shrink-0 ${
          isDone
            ? 'bg-done border-done text-white'
            : 'border-border/60 group-hover:border-border'
        }`}>
          {isDone && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
        </div>

        {/* Lesson ID badge */}
        <span className={`font-mono text-[11px] shrink-0 font-semibold tracking-tight min-w-[32px] ${
          isActive ? 'text-accent' : 'text-text-dim/80 group-hover:text-text'
        }`}>
          {l.id}
        </span>

        <span className="truncate">{l.title}</span>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Getting Started Section */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono tracking-wider font-bold text-text-dim/50 uppercase px-2">
          Getting Started
        </div>
        <div className="space-y-0.5">
          {COURSE.backbone.map((d) => {
            if (!isMatch(d.title, d.id)) return null;
            return renderDocRow(d, 'doc');
          })}
        </div>
      </div>

      {/* 2. Curriculum Section */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono tracking-wider font-bold text-text-dim/50 uppercase px-2">
          Curriculum
        </div>
        <div className="space-y-1.5">
          {COURSE.parts.map((p) => {
            // Check if any lesson within this part matches filter
            const hasMatchingLessons = p.modules.some((m) =>
              m.lessons.some((l) => isMatch(l.title, l.id))
            );
            const partTitleMatch = isMatch(p.title, 'part ' + p.num);
            const showPart = filter ? (hasMatchingLessons || partTitleMatch) : true;

            if (!showPart) return null;

            // In search mode, force parts expanded. In normal mode, use ui-store state (default is expanded).
            // A part is collapsed if it's explicitly in collapsedParts.
            const isCollapsed = filter ? false : !!collapsedParts[p.id];

            return (
              <div key={p.id} className="border border-border/20 rounded-md overflow-hidden bg-bg-elev/15">
                {/* Part Header (clickable accordion trigger) */}
                <button
                  onClick={() => !filter && togglePart(p.id)}
                  disabled={!!filter}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-bg-elev/40 border-b border-border/10 text-left transition-colors select-none group cursor-pointer disabled:pointer-events-none"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-accent tracking-wide uppercase shrink-0">
                        Part {p.num}
                      </span>
                      <PartBadge status={p.status} />
                    </div>
                    <span className="text-[12.5px] font-medium text-text leading-tight group-hover:text-accent transition-colors truncate">
                      {p.title}
                    </span>
                  </div>
                  {!filter && (
                    <ChevronDown className={`w-4 h-4 text-text-dim/60 transition-transform duration-200 shrink-0 ${
                      isCollapsed ? '' : 'rotate-180'
                    }`} />
                  )}
                </button>

                {/* Part Body */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={expandTransition}
                      className="overflow-hidden bg-bg/5"
                    >
                      <div className="p-1.5 space-y-3">
                        {p.modules.length === 0 ? (
                          <div className="px-3 py-2 text-[11.5px] italic text-text-dim bg-bg-elev/10 rounded">
                            {p.status === 'in-progress'
                              ? 'Lessons being written...'
                              : 'Coming soon — see Curriculum Map for details.'}
                          </div>
                        ) : (
                          p.modules.map((m, mIdx) => {
                            const lessons = m.lessons.filter((l) => isMatch(l.title, l.id));
                            if (lessons.length === 0) return null;

                            return (
                              <div key={mIdx} className="space-y-1">
                                <div className="text-[10px] font-mono font-semibold tracking-wide text-accent-2/80 px-3 py-0.5 uppercase">
                                  {m.title}
                                </div>
                                <div className="space-y-0.5">
                                  {lessons.map((l) => renderLessonRow(l))}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Reference Section */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono tracking-wider font-bold text-text-dim/50 uppercase px-2">
          Reference
        </div>
        <div className="space-y-0.5">
          {COURSE.reference.map((d) => {
            if (!isMatch(d.title, d.id)) return null;
            return renderDocRow(d, 'ref');
          })}
        </div>
      </div>
    </div>
  );
}

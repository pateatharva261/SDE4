'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle, Circle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useHasMounted } from '@/hooks/useHasMounted';
import { buildFlatList } from '@/lib/curriculum';
import { toast } from 'sonner';

/**
 * Self-contained — derives the lesson ID from the current URL using the same
 * buildFlatList() lookup that AppShell and TopBar use. This guarantees all three
 * always read and write the exact same progress key.
 */
export function MarkCompleteButton() {
  const pathname = usePathname() || '';
  const { completed, toggle } = useProgress();
  const mounted = useHasMounted();

  const flatList = React.useMemo(() => buildFlatList(), []);
  const currentItem = React.useMemo(
    () => flatList.find((i) => i.url === pathname && i.kind === 'lesson'),
    [flatList, pathname]
  );

  // Not on a lesson page — render nothing
  if (!currentItem) return null;

  const isDone = mounted && !!completed[currentItem.id];

  const handleClick = () => {
    const wasComplete = !!completed[currentItem.id];
    toggle(currentItem.id);
    if (!wasComplete) {
      toast.success('Lesson marked complete!');
    } else {
      toast.info('Lesson marked incomplete');
    }
  };

  return (
    <div className="flex justify-center mt-10 mb-2">
      <button
        onClick={handleClick}
        className={`
          group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-[14px]
          border-2 transition-all duration-200 cursor-pointer
          focus-visible:ring-2 ring-offset-2 ring-offset-bg ring-accent
          ${isDone
            ? 'bg-done/10 border-done/40 text-done hover:bg-done/20 hover:border-done/60'
            : 'bg-bg-elev border-border/60 text-text-dim hover:border-accent/50 hover:text-text hover:bg-accent/5'
          }
        `}
        aria-label={isDone ? 'Mark lesson incomplete' : 'Mark lesson complete'}
        title={isDone ? 'Mark incomplete  (c)' : 'Mark complete  (c)'}
      >
        {isDone ? (
          <CheckCircle className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <Circle className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        )}
        <span>{isDone ? '✓ Completed — click to undo' : 'Mark lesson complete'}</span>
        <kbd className="hidden sm:inline-flex items-center justify-center bg-bg-elev2 border border-border/50 rounded text-[10px] font-mono px-1.5 h-5 text-text-dim/60 ml-1">
          c
        </kbd>
      </button>
    </div>
  );
}

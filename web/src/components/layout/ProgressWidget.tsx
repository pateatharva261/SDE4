'use client';

import * as React from 'react';
import { useProgress } from '@/hooks/useProgress';
import { buildFlatList } from '@/lib/curriculum';
import { useHasMounted } from '@/hooks/useHasMounted';
import { CheckCircle2 } from 'lucide-react';

export function ProgressWidget() {
  const { completed } = useProgress();
  const mounted = useHasMounted();

  const lessons = React.useMemo(() => {
    return buildFlatList().filter(i => i.kind === 'lesson');
  }, []);

  const total = lessons.length;
  const done = mounted ? lessons.filter(l => completed[l.id]).length : 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-bg-elev2/60 border border-border/40 rounded-lg p-3.5 space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between text-[12px] font-mono">
        <span className="text-text-dim flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
          Progress
        </span>
        <span className="text-text font-semibold">
          {done} / {total} lessons ({pct}%)
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative h-[6px] w-full bg-bg-elev rounded-full overflow-hidden border border-border/25">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { buildFlatList } from '@/lib/curriculum';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pager() {
  const pathname = usePathname() || '';
  const flatList = React.useMemo(() => buildFlatList(), []);
  const idx = flatList.findIndex((i) => i.url === pathname);

  if (idx === -1) return null;

  const prev = flatList[idx - 1];
  const next = flatList[idx + 1];

  return (
    <div className="flex items-center justify-between border-t border-border/30 pt-6 mt-10">
      {prev ? (
        <Link
          href={prev.url}
          className="inline-flex items-center gap-2 h-9 px-4 rounded bg-bg-elev2 border border-border/50 hover:border-border/80 text-text-dim hover:text-text text-[13px] font-semibold transition-all max-w-[48%] truncate cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="truncate">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={next.url}
          className="inline-flex items-center gap-2 h-9 px-4 rounded bg-accent text-bg font-bold text-[13px] hover:bg-accent-2 transition-all max-w-[48%] truncate shadow-md shadow-accent/10 hover:shadow-accent-2/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <span className="truncate">{next.title}</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

import * as React from 'react';
import { PartStatus } from '@/data/manifest';

interface PartBadgeProps {
  status: PartStatus;
}

export function PartBadge({ status }: PartBadgeProps) {
  const config = {
    'done': { text: 'DONE', className: 'bg-done/10 text-done border-done/20' },
    'in-progress': { text: 'SOON', className: 'bg-warn/10 text-warn border-warn/20' },
    'soon': { text: 'SOON', className: 'bg-warn/10 text-warn border-warn/20' },
    'planned': { text: 'PLANNED', className: 'bg-planned/10 text-text-dim border-border/40' },
  }[status] || { text: status.toUpperCase(), className: 'bg-planned/10 text-text-dim border-border/40' };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono tracking-wider font-semibold border rounded-sm ${config.className}`}>
      {config.text}
    </span>
  );
}

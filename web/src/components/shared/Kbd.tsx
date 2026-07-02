import * as React from 'react';

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className = '' }: KbdProps) {
  return (
    <kbd className={`inline-flex items-center justify-center bg-bg-elev2 border border-border rounded-sm px-1.5 py-0.5 text-[11px] font-mono text-text-dim shadow-sm leading-none h-[18px] min-w-[18px] ${className}`}>
      {children}
    </kbd>
  );
}

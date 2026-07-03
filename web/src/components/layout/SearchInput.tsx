'use client';

import * as React from 'react';
import { useUiStore } from '@/stores/ui-store';
import { Search } from 'lucide-react';
import { Kbd } from '@/components/shared/Kbd';

export function SearchInput() {
  const { searchQuery, setSearchQuery } = useUiStore();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus the input when "/" is pressed (only when not already typing in a field)
  React.useEffect(() => {
    const handleSlash = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTypeable =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isTypeable) return;
      if (e.key !== '/') return;

      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };

    document.addEventListener('keydown', handleSlash);
    return () => document.removeEventListener('keydown', handleSlash);
  }, []);

  // Blur on Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-dim">
        <Search className="w-4 h-4" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={onChange}
        placeholder="Search lessons... (press /)"
        className="w-full bg-bg-elev2 border border-border/40 hover:border-border/80 focus:border-accent/80 rounded-md py-2 pl-9 pr-12 text-[13px] outline-none text-text placeholder-text-dim transition-colors shadow-sm focus:ring-1 focus:ring-accent/40"
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <Kbd className="h-[16px] text-[9px] px-1 font-bold">/</Kbd>
      </div>
    </div>
  );
}

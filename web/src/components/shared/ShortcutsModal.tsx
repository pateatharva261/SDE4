'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { SHORTCUT_REGISTRY } from '@/lib/shortcuts-registry';

/**
 * Renders a single key as a styled keyboard badge.
 * Special tokens like "Space", "Shift", "Esc", "→", etc. get wider padding.
 */
function KeyBadge({ label }: { label: string }) {
  const isSpecial = label.length > 1;
  return (
    <kbd
      className={`inline-flex items-center justify-center bg-bg-elev2 border border-border/70 rounded text-[11px] font-mono font-semibold text-text shadow-sm leading-none select-none
        ${isSpecial ? 'px-2 h-[22px]' : 'w-[22px] h-[22px]'}
      `}
    >
      {label}
    </kbd>
  );
}

/** Renders a shortcut definition row */
function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border/10 last:border-0">
      <span className="text-[13px] text-text-dim">{description}</span>
      <div className="flex items-center gap-1 shrink-0">
        {keys.map((k, i) => (
          <React.Fragment key={i}>
            <KeyBadge label={k} />
            {i < keys.length - 1 && (
              <span className="text-[11px] text-text-dim/40 font-mono">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function ShortcutsModal() {
  const { shortcutsOpen, setShortcutsOpen } = useUiStore();

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && shortcutsOpen) {
        setShortcutsOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [shortcutsOpen, setShortcutsOpen]);

  // Prevent body scroll while open
  React.useEffect(() => {
    if (shortcutsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [shortcutsOpen]);

  return (
    <AnimatePresence>
      {shortcutsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShortcutsOpen(false)}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="pointer-events-auto relative w-full max-w-lg mx-4 bg-bg-elev border border-border/60 rounded-xl shadow-2xl flex flex-col max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
                <div className="flex items-center gap-2.5">
                  <Keyboard className="w-4.5 h-4.5 text-accent" />
                  <span className="font-bold text-[15px] text-text tracking-tight">
                    Keyboard Shortcuts
                  </span>
                </div>
                <button
                  onClick={() => setShortcutsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-text-dim hover:text-text hover:bg-bg-elev2 border border-transparent hover:border-border/40 transition-colors cursor-pointer"
                  aria-label="Close shortcuts modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6 scroll-smooth">
                {SHORTCUT_REGISTRY.map((section) => (
                  <div key={section.title}>
                    {/* Section heading */}
                    <div className="text-[11px] font-mono font-bold tracking-widest uppercase text-accent/80 mb-2">
                      {section.title}
                    </div>
                    {/* Shortcut rows */}
                    <div className="bg-bg/40 rounded-lg px-3 py-1">
                      {section.shortcuts.map((s, i) => (
                        <ShortcutRow key={i} keys={s.keys} description={s.description} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-border/20 shrink-0 text-center">
                <span className="text-[11px] text-text-dim/50">
                  Press <KeyBadge label="?" /> or <KeyBadge label="Esc" /> to close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

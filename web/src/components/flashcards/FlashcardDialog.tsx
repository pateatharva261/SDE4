'use client';

import * as React from 'react';
import { useUiStore } from '@/stores/ui-store';
import { useHotkeys } from '@/hooks/useHotkeys';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

export function FlashcardDialog() {
  const { flashcardsOpen, setFlashcardsOpen, activeFlashcards } = useUiStore();
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);

  // Reset index and flipped state when the overlay opens
  React.useEffect(() => {
    if (flashcardsOpen) {
      setIndex(0);
      setFlipped(false);
    }
  }, [flashcardsOpen]);

  const total = activeFlashcards.length;
  const currentCard = activeFlashcards[index];

  const handleNext = React.useCallback(() => {
    if (total === 0) return;
    setIndex((prev) => (prev + 1) % total);
    setFlipped(false);
  }, [total]);

  const handlePrev = React.useCallback(() => {
    if (total === 0) return;
    setIndex((prev) => (prev - 1 + total) % total);
    setFlipped(false);
  }, [total]);

  const handleFlip = React.useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  const handleClose = React.useCallback(() => {
    setFlashcardsOpen(false);
  }, [setFlashcardsOpen]);

  // Scoped hotkeys inside the dialog
  useHotkeys('space', (e) => {
    e.preventDefault();
    if (flashcardsOpen) handleFlip();
  }, {}, [flashcardsOpen, handleFlip]);

  useHotkeys('arrowright', (e) => {
    e.preventDefault();
    if (flashcardsOpen) handleNext();
  }, {}, [flashcardsOpen, handleNext]);

  useHotkeys('arrowleft', (e) => {
    e.preventDefault();
    if (flashcardsOpen) handlePrev();
  }, {}, [flashcardsOpen, handlePrev]);

  useHotkeys('escape', (e) => {
    e.preventDefault();
    if (flashcardsOpen) handleClose();
  }, {}, [flashcardsOpen, handleClose]);

  if (!flashcardsOpen || total === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Modal Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="relative w-full max-w-[560px] bg-bg-elev border border-border/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-6 min-h-[350px]"
        >
          {/* Top Info bar */}
          <div className="flex items-center justify-between text-[12px] font-mono text-text-dim border-b border-border/20 pb-3">
            <span className="flex items-center gap-1 font-medium">
              🃏 Card {index + 1} of {total}
            </span>
            <button
              onClick={handleClose}
              className="flex items-center gap-1 hover:text-text cursor-pointer transition-colors font-semibold"
            >
              <span>close [esc]</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Flashcard container (3D Flip perspective setup) */}
          <div
            className="flex-1 flex flex-col justify-center items-center cursor-pointer min-h-[200px] w-full"
            onClick={handleFlip}
            style={{ perspective: '1000px' }}
          >
            {/* Card Rotator */}
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.4, ease: 'easeInOut' }}
              className="relative w-full h-full flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* FRONT: Question */}
              <div
                className="w-full text-center px-4 py-6 flex flex-col items-center justify-center gap-5 backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-[16px] font-bold tracking-tight text-text leading-relaxed max-w-md">
                  {currentCard.q}
                </div>
                <span className="text-[10px] font-mono text-text-dim bg-bg-elev2 px-2 py-0.5 rounded border border-border/30 font-semibold tracking-wide">
                  press [space] or click to reveal answer
                </span>
              </div>

              {/* BACK: Answer */}
              <div
                className="absolute inset-0 w-full h-full text-center px-4 py-6 flex flex-col items-center justify-center gap-2 backface-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="text-[15px] font-semibold text-accent-2 leading-relaxed max-w-md">
                  {currentCard.a}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-border/25 pt-4 mt-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-bg-elev2 text-xs font-semibold text-text-dim hover:text-text cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              prev [←]
            </button>

            <button
              onClick={handleFlip}
              className="flex items-center gap-1.5 h-8 px-4 rounded bg-bg-elev2 border border-border/40 hover:border-border text-xs font-bold text-text hover:text-accent cursor-pointer transition-colors shadow-sm"
            >
              <RotateCw className="w-3.5 h-3.5 text-accent" />
              Flip
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-bg-elev2 text-xs font-semibold text-text-dim hover:text-text cursor-pointer transition-colors"
            >
              next [→]
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

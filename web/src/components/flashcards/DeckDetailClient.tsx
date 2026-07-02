'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { AutoStartFlashcards } from './AutoStartFlashcards';
import { Flashcard } from '@/stores/ui-store';

interface DeckDetailClientProps {
  lessonId: string;
  title: string;
  flashcards: Flashcard[];
}

export function DeckDetailClient({ lessonId, title, flashcards }: DeckDetailClientProps) {
  const cardCount = flashcards.length;

  const handleReview = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 md:py-20 space-y-8 select-none">
      {/* Auto Trigger overlay review session on mount */}
      <AutoStartFlashcards flashcards={flashcards} />

      {/* Back link */}
      <Link
        href="/flashcards"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-dim hover:text-text transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        back to decks
      </Link>

      {/* Deck detail summary */}
      <div className="border border-border/30 rounded-2xl p-6 md:p-8 bg-bg-elev/15 backdrop-blur-md space-y-6 text-center shadow-lg">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border bg-accent/10 border-accent/20 text-accent">
            Lesson {lessonId}
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-text tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs text-text-dim font-medium">
            This deck contains <span className="font-semibold text-text">{cardCount}</span> flashcard questions.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={handleReview}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-accent text-bg font-extrabold text-[13.5px] hover:bg-accent-2 transition-all shadow-md shadow-accent/15 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 fill-current" />
            Review this deck
          </button>
        </div>
      </div>
    </div>
  );
}

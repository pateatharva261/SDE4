'use client';

import * as React from 'react';
import { useUiStore, Flashcard } from '@/stores/ui-store';

interface AutoStartFlashcardsProps {
  flashcards: Flashcard[];
}

export function AutoStartFlashcards({ flashcards }: AutoStartFlashcardsProps) {
  const { setActiveFlashcards, setFlashcardsOpen } = useUiStore();

  React.useEffect(() => {
    setActiveFlashcards(flashcards);
    setFlashcardsOpen(true);
    return () => {
      setActiveFlashcards([]);
      setFlashcardsOpen(false);
    };
  }, [flashcards, setActiveFlashcards, setFlashcardsOpen]);

  return null;
}

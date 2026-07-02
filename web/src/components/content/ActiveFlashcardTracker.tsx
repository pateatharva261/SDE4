'use client';

import * as React from 'react';
import { useUiStore, Flashcard } from '@/stores/ui-store';

interface ActiveFlashcardTrackerProps {
  flashcards: Flashcard[];
}

export function ActiveFlashcardTracker({ flashcards }: ActiveFlashcardTrackerProps) {
  const { setActiveFlashcards } = useUiStore();

  React.useEffect(() => {
    setActiveFlashcards(flashcards);
    return () => {
      setActiveFlashcards([]);
    };
  }, [flashcards, setActiveFlashcards]);

  return null;
}

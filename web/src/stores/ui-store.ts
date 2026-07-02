import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Flashcard {
  q: string;
  a: string;
}

interface UiState {
  collapsedParts: Record<string, true>;
  sidebarOpen: boolean;
  fontScale: 'sm' | 'base' | 'lg';
  searchQuery: string;
  activeFlashcards: Flashcard[];
  flashcardsOpen: boolean;
  togglePart(partId: string): void;
  setSidebarOpen(open: boolean): void;
  setFontScale(scale: 'sm' | 'base' | 'lg'): void;
  setSearchQuery(query: string): void;
  setActiveFlashcards(cards: Flashcard[]): void;
  setFlashcardsOpen(open: boolean): void;
}

const customUiStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(name);
    if (!value) return null;
    try {
      return JSON.stringify({
        state: {
          collapsedParts: JSON.parse(value),
          sidebarOpen: false,
          fontScale: 'base',
          searchQuery: '',
          activeFlashcards: [],
          flashcardsOpen: false,
        },
        version: 0,
      });
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      const parsed = JSON.parse(value);
      localStorage.setItem(name, JSON.stringify(parsed.state.collapsedParts));
    } catch (e) {
      console.error('Error saving collapse state', e);
    }
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  }
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      collapsedParts: {},
      sidebarOpen: false,
      fontScale: 'base',
      searchQuery: '',
      activeFlashcards: [],
      flashcardsOpen: false,
      togglePart: (partId) =>
        set((state) => {
          const collapsedParts = { ...state.collapsedParts };
          if (collapsedParts[partId]) {
            delete collapsedParts[partId];
          } else {
            collapsedParts[partId] = true;
          }
          return { collapsedParts };
        }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setFontScale: (fontScale) => set({ fontScale }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveFlashcards: (activeFlashcards) => set({ activeFlashcards }),
      setFlashcardsOpen: (flashcardsOpen) => set({ flashcardsOpen }),
    }),
    {
      name: 'sdm-collapse-v1',
      storage: createJSONStorage(() => customUiStorage),
    }
  )
);

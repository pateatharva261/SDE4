import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProgressState {
  completed: Record<string, true>;
  toggle(lessonId: string): void;
  reset(): void;
  countComplete(): number;
}

const customStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(name);
    if (!value) return null;
    try {
      return JSON.stringify({ state: { completed: JSON.parse(value) }, version: 0 });
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      const parsed = JSON.parse(value);
      localStorage.setItem(name, JSON.stringify(parsed.state.completed));
    } catch (e) {
      console.error('Error saving progress', e);
    }
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  }
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      toggle: (lessonId) =>
        set((state) => {
          const completed = { ...state.completed };
          if (completed[lessonId]) {
            delete completed[lessonId];
          } else {
            completed[lessonId] = true;
          }
          return { completed };
        }),
      reset: () => set({ completed: {} }),
      countComplete: () => Object.keys(get().completed).length,
    }),
    {
      name: 'sdm-progress-v1',
      storage: createJSONStorage(() => customStorage),
    }
  )
);

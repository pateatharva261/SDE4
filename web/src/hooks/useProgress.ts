import { useProgressStore } from '@/stores/progress-store';

export function useProgress() {
  return useProgressStore();
}

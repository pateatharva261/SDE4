/**
 * Central shortcut registry — single source of truth.
 * The ShortcutsModal reads this file directly, so adding a shortcut here
 * automatically surfaces it in the help modal. No hardcoding needed.
 */

export interface ShortcutDef {
  /** Keys to display as Kbd badges, e.g. ["ArrowRight"] or ["Shift", "."] */
  keys: string[];
  /** Human-readable description */
  description: string;
}

export interface ShortcutSection {
  title: string;
  shortcuts: ShortcutDef[];
}

export const SHORTCUT_REGISTRY: ShortcutSection[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['j'], description: 'Go to next lesson (anywhere on page)' },
      { keys: ['k'], description: 'Go to previous lesson (anywhere on page)' },
      { keys: ['→'], description: 'Next lesson (only when at bottom of page)' },
      { keys: ['←'], description: 'Previous lesson (only when at bottom of page)' },
      { keys: ['/'], description: 'Focus search box' },
      { keys: ['Esc'], description: 'Close search / modal' },
    ],
  },
  {
    title: 'Reading',
    shortcuts: [
      { keys: ['Space'], description: 'Scroll down 80% of the viewport' },
      { keys: ['Shift', 'Space'], description: 'Scroll up 80% of the viewport' },
    ],
  },
  {
    title: 'Lesson Actions',
    shortcuts: [
      { keys: ['c'], description: 'Toggle mark lesson complete / incomplete' },
      { keys: ['f'], description: 'Open flashcard review for current lesson' },
    ],
  },
  {
    title: 'Appearance',
    shortcuts: [
      { keys: ['l'], description: 'Switch to light mode' },
      { keys: ['n'], description: 'Switch to night (dark) mode' },
      { keys: ['['], description: 'Collapse / expand sidebar' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Open this keyboard shortcuts help modal' },
    ],
  },
];

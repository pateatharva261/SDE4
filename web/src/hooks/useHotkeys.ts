import { useHotkeys as useOriginalHotkeys } from 'react-hotkeys-hook';

export function useHotkeys(
  keys: string,
  callback: (event: KeyboardEvent) => void,
  options: any = {},
  deps: any[] = []
) {
  useOriginalHotkeys(
    keys,
    (event) => {
      // Prevent shortcut trigger when typing inside text inputs, textareas, etc.
      const target = event.target as HTMLElement;
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (isInput && event.key !== 'Escape') {
        return;
      }
      callback(event);
    },
    {
      enableOnFormTags: true, // We handle filtering manually above to allow Escape
      ...options,
    },
    deps
  );
}

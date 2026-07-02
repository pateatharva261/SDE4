export const springFast   = { type: 'spring', stiffness: 400, damping: 30 } as const;
export const springSoft   = { type: 'spring', stiffness: 260, damping: 24 } as const;
export const easeOutQuart = { duration: 0.32, ease: [0.25, 1, 0.5, 1] } as const;

export const fade  = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export const slide = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
} as const;

export const pop   = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
} as const;

export const staggerParent = {
  animate: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
} as const;

export const staggerChild = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: springFast },
} as const;

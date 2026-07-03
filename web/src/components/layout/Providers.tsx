'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
      <Toaster
        theme="dark"
        position="bottom-center"
        closeButton
        richColors
        offset={24}
      />
    </ThemeProvider>
  );
}

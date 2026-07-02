'use client';

import * as React from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const handleScroll = () => {
      const scrollHeight = mainElement.scrollHeight - mainElement.clientHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const scrollPercent = (mainElement.scrollTop / scrollHeight) * 100;
      setProgress(scrollPercent);
    };

    mainElement.addEventListener('scroll', handleScroll);
    // Initial check on mount
    handleScroll();

    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-14 md:top-[56px] left-0 md:left-[var(--sidebar-w)] right-0 z-30 h-[2.5px] bg-transparent pointer-events-none select-none">
      <div
        className="h-full bg-accent transition-all duration-75 ease-out rounded-r-full shadow-[0_0_8px_rgba(88,166,255,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

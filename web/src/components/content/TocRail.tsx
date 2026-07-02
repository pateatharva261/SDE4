'use client';

import * as React from 'react';

export function TocRail() {
  const [headings, setHeadings] = React.useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    // Find all headings within the prose-lesson wrapper
    const container = document.querySelector('.prose-lesson');
    if (!container) return;

    const headingElements = container.querySelectorAll('h2, h3');
    const items = Array.from(headingElements).map((el, index) => {
      // Ensure element has an ID for direct link anchoring
      if (!el.id) {
        // Fallback id generation based on text slugification or index
        const text = el.textContent || '';
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        el.id = slug || `section-${index}`;
      }
      return {
        id: el.id,
        text: el.textContent || '',
        level: el.tagName.toLowerCase() === 'h3' ? 3 : 2,
      };
    });

    setHeadings(items);

    // Track active headers during page scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-56px 0px -70% 0px', // TopBar offset margin
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="w-56 shrink-0 hidden xl:block sticky top-20 self-start max-h-[calc(100vh-100px)] overflow-y-auto pl-6 border-l border-border/20 text-[12.5px] select-none [scrollbar-width:thin] [scrollbar-gutter:stable]">
      <div className="text-[10px] font-mono tracking-wider font-bold text-text-dim/40 uppercase mb-3.5">
        On this page
      </div>
      <ul className="space-y-3">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li
              key={h.id}
              style={{ paddingLeft: h.level === 3 ? '12px' : '0px' }}
              className="relative"
            >
              {isActive && (
                <div className="absolute top-[3px] -left-[25px] w-[2px] h-[14px] bg-accent rounded-full" />
              )}
              <a
                href={`#${h.id}`}
                className={`block transition-colors leading-relaxed hover:text-text cursor-pointer ${
                  isActive ? 'text-accent font-semibold' : 'text-text-dim font-medium'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

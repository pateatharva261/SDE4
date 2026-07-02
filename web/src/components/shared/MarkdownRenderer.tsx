'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { buildFlatList } from '@/lib/curriculum';
import { toast } from 'sonner';

interface MarkdownRendererProps {
  html: string;
}

export function MarkdownRenderer({ html }: MarkdownRendererProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const flatList = React.useMemo(() => buildFlatList(), []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Process and wrap Mermaid diagrams
    const codeBlocks = container.querySelectorAll('code.language-mermaid');
    const mermaidNodes: HTMLDivElement[] = [];

    codeBlocks.forEach((codeEl) => {
      const pre = codeEl.closest('pre');
      if (!pre) return;

      const rawCode = codeEl.textContent || '';

      // Create container wrapper matching §7.2 specifications
      const wrapper = document.createElement('div');
      wrapper.className = 'my-6 border border-border/30 rounded-lg overflow-hidden bg-bg-elev/40 shadow-sm';

      // Header bar
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between px-4 py-2 border-b border-border/20 bg-bg-elev2/60 text-[11px] font-mono select-none';
      header.innerHTML = `
        <span class="text-text-dim font-semibold">SYSTEM DIAGRAM</span>
        <button class="toggle-btn text-accent hover:text-accent-2 font-bold transition-colors cursor-pointer">View Source</button>
      `;

      // Whiteboard container for clear diagram visibility
      const diagramContainer = document.createElement('div');
      diagramContainer.className = 'diagram-panel p-6 bg-white flex justify-center overflow-x-auto select-all';

      const diagramInner = document.createElement('div');
      diagramInner.className = 'mermaid w-full flex justify-center';
      diagramInner.textContent = rawCode;
      diagramContainer.appendChild(diagramInner);

      // Raw script source panel
      const sourceContainer = document.createElement('pre');
      sourceContainer.className = 'source-panel p-4 overflow-x-auto text-[13px] font-mono bg-bg-elev hidden';
      sourceContainer.textContent = rawCode;

      wrapper.appendChild(header);
      wrapper.appendChild(diagramContainer);
      wrapper.appendChild(sourceContainer);

      pre.replaceWith(wrapper);

      // Hook up toggle handler
      const toggleBtn = header.querySelector('.toggle-btn') as HTMLButtonElement;
      toggleBtn.addEventListener('click', () => {
        const isShowingSource = sourceContainer.classList.contains('hidden');
        if (isShowingSource) {
          sourceContainer.classList.remove('hidden');
          diagramContainer.classList.add('hidden');
          toggleBtn.textContent = 'View Diagram';
        } else {
          sourceContainer.classList.add('hidden');
          diagramContainer.classList.remove('hidden');
          toggleBtn.textContent = 'View Source';
        }
      });

      mermaidNodes.push(diagramInner);
    });

    // Lazy load and run Mermaid rendering client-side
    if (mermaidNodes.length > 0) {
      import('mermaid').then((m) => {
        m.default.initialize({
          startOnLoad: false,
          theme: 'default', // Using default/light theme variables to render clearly on white panels
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });
        m.default.run({ nodes: mermaidNodes }).catch((err) => {
          console.error('Mermaid render failure', err);
        });
      });
    }

    // 2. Add copy button to standard preformatted code blocks
    const preElements = container.querySelectorAll('pre');
    preElements.forEach((pre) => {
      // Skip if it contains a mermaid block wrapper
      if (
        pre.querySelector('.mermaid') ||
        pre.classList.contains('mermaid') ||
        pre.classList.contains('source-panel')
      ) {
        return;
      }

      if (pre.style.position !== 'relative') {
        pre.style.position = 'relative';
      }

      if (pre.querySelector('.copy-btn')) return;

      const button = document.createElement('button');
      button.className = 'copy-btn absolute top-2.5 right-2.5 p-1.5 rounded-md bg-bg border border-border/50 hover:border-border text-text-dim hover:text-text opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 cursor-pointer flex items-center justify-center shadow-sm';
      button.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      `;
      button.setAttribute('aria-label', 'Copy code snippet');

      pre.classList.add('group');

      button.addEventListener('click', () => {
        const codeElement = pre.querySelector('code');
        const codeText = codeElement ? codeElement.textContent : pre.textContent;
        const textToCopy = codeText || '';

        navigator.clipboard.writeText(textToCopy).then(() => {
          button.innerHTML = `
            <svg class="w-3.5 h-3.5 text-done" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          `;
          toast.success('Code copied to clipboard');
          setTimeout(() => {
            button.innerHTML = `
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            `;
          }, 2000);
        });
      });

      pre.appendChild(button);
    });

    // 3. Intercept relative markdown links and route via Next.js Router
    const links = container.querySelectorAll('a[href]');
    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (href && (href.endsWith('.md') || href.includes('.md#'))) {
        const [pathPart, anchorPart] = href.split('#');
        const fname = pathPart.split('/').pop() || '';

        // Match against flat manifest items
        const target = flatList.find((item) => item.path.endsWith(fname));
        if (target) {
          const targetUrl = anchorPart ? `${target.url}#${anchorPart}` : target.url;

          a.addEventListener('click', (e) => {
            e.preventDefault();
            router.push(targetUrl);
          });
        }
      }
    });
  }, [html, router, flatList]);

  return (
    <div
      ref={containerRef}
      className="prose-lesson w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

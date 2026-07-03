'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';

export function DiagramModal() {
  const { diagramSvg, setDiagramSvg } = useUiStore();
  const isOpen = diagramSvg !== null;

  const [scale, setScale] = React.useState(1);
  const [isDragging, setIsDragging] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Clean the SVG markup by removing the hardcoded width attribute on the main <svg> tag.
  const cleanedSvg = React.useMemo(() => {
    if (!diagramSvg) return '';
    // Strip the width attribute from the first <svg ...> tag
    return diagramSvg.replace(/(<svg[^>]*?)\bwidth=(?:"[^"]*"|'[^']*'|\S+)\s?/i, '$1');
  }, [diagramSvg]);

  const close = React.useCallback(() => {
    setDiagramSvg(null);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [setDiagramSvg]);

  // Reset zoom/pan when a new diagram opens
  React.useEffect(() => {
    if (isOpen) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [diagramSvg, isOpen]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, close]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.min(4, Math.max(0.3, s + delta)));
  };

  // Pan by dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const zoomIn  = () => setScale((s) => Math.min(4, +(s + 0.25).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(0.3, +(s - 0.25).toFixed(2)));
  const resetZoom = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — same as ShortcutsModal */}
          <motion.div
            key="diagram-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal panel */}
          <motion.div
            key="diagram-modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 md:p-8"
          >
            <div
              className="pointer-events-auto relative w-full max-w-[95vw] max-h-[92vh] bg-bg-elev border border-border/60 rounded-xl shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header — matches ShortcutsModal header exactly */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 shrink-0 bg-bg-elev2/60">
                <span className="text-[11px] font-mono font-semibold text-text-dim tracking-wider uppercase">
                  System Diagram
                </span>

                {/* Zoom controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={zoomOut}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-text-dim hover:text-text hover:bg-bg-elev border border-transparent hover:border-border/40 transition-colors cursor-pointer"
                    aria-label="Zoom out"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={resetZoom}
                    className="h-7 px-2 flex items-center justify-center rounded-md text-text-dim hover:text-text hover:bg-bg-elev border border-transparent hover:border-border/40 transition-colors cursor-pointer text-[11px] font-mono min-w-[44px]"
                    aria-label="Reset zoom"
                    title="Reset zoom"
                  >
                    {Math.round(scale * 100)}%
                  </button>
                  <button
                    onClick={zoomIn}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-text-dim hover:text-text hover:bg-bg-elev border border-transparent hover:border-border/40 transition-colors cursor-pointer"
                    aria-label="Zoom in"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={resetZoom}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-text-dim hover:text-text hover:bg-bg-elev border border-transparent hover:border-border/40 transition-colors cursor-pointer ml-1"
                    aria-label="Reset pan and zoom"
                    title="Reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-px h-5 bg-border/40 mx-1" />

                  {/* Close — matches ShortcutsModal close button */}
                  <button
                    onClick={close}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-text-dim hover:text-text hover:bg-bg-elev2 border border-transparent hover:border-border/40 transition-colors cursor-pointer"
                    aria-label="Close diagram preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Diagram viewport — overflow hidden, pan/zoom inside */}
              <div
                className="flex-1 overflow-hidden bg-white flex items-center justify-center"
                style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.15s ease',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                  dangerouslySetInnerHTML={{ __html: cleanedSvg }}
                  className="diagram-panel flex items-center justify-center p-4 [&_svg]:max-w-full [&_svg]:h-auto"
                />
              </div>

              {/* Footer hint */}
              <div className="px-5 py-2 border-t border-border/20 shrink-0 flex items-center justify-between">
                <span className="text-[11px] text-text-dim/40 font-mono">
                  Scroll to zoom · Drag to pan when zoomed
                </span>
                <span className="text-[11px] text-text-dim/40 font-mono">
                  Esc to close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

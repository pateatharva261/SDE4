'use client';

import * as React from 'react';
import { useUiStore, Flashcard } from '@/stores/ui-store';
import { useProgress } from '@/hooks/useProgress';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Search, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerParent, staggerChild } from '@/lib/motion';

interface LessonData {
  id: string;
  title: string;
  slug: string;
  partNum: number;
  cardCount: number;
  flashcards: Flashcard[];
}

interface DeckPickerProps {
  lessons: LessonData[];
}

interface FlashSeenData {
  seenCount: number;
  lastReviewed: string;
}

export function DeckPicker({ lessons }: DeckPickerProps) {
  const { setFlashcardsOpen, setActiveFlashcards } = useUiStore();
  const { completed } = useProgress();
  const mounted = useHasMounted();

  // Local storage for tracking reviewed card stats
  const [flashSeen] = useLocalStorage<Record<string, FlashSeenData>>('sdm-flashseen-v1', {});

  // Search and filter states
  const [search, setSearch] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'unseen' | 'completed'>('all');
  const [partRange, setPartRange] = React.useState<string>('all');

  // Filter lessons
  const filteredLessons = React.useMemo(() => {
    return lessons.filter((l) => {
      // 1. Text filter (Title or ID)
      const textMatch =
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.id.toLowerCase().includes(search.toLowerCase());
      if (!textMatch) return false;

      // 2. Custom status filters
      if (filterType === 'unseen') {
        const seen = flashSeen[l.id];
        if (seen && seen.seenCount > 0) return false;
      } else if (filterType === 'completed') {
        if (!completed[l.id]) return false;
      }

      // 3. Part chapter range filter
      if (partRange !== 'all') {
        const [start, end] = partRange.split('-').map(Number);
        if (l.partNum < start || l.partNum > end) return false;
      }

      return true;
    });
  }, [lessons, search, filterType, partRange, flashSeen, completed]);

  // Review all cards action
  const handleReviewAll = () => {
    // Collect all flashcards from filtered decks
    const allCards: Flashcard[] = [];
    filteredLessons.forEach((l) => {
      allCards.push(...l.flashcards);
    });

    if (allCards.length === 0) {
      return;
    }

    // Shuffle the cards
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);

    setActiveFlashcards(shuffled);
    setFlashcardsOpen(true);
  };

  const handleStartDeck = (deck: LessonData) => {
    setActiveFlashcards(deck.flashcards);
    setFlashcardsOpen(true);

    // Save seen state in local storage
    if (typeof window !== 'undefined') {
      const now = new Date().toISOString();
      const currentSeen = flashSeen[deck.id] || { seenCount: 0, lastReviewed: '' };
      const updated = {
        ...flashSeen,
        [deck.id]: {
          seenCount: currentSeen.seenCount + 1,
          lastReviewed: now,
        },
      };
      // Dispatch storage event to sync other tabs
      window.localStorage.setItem('sdm-flashseen-v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Never';
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerParent}
      className="space-y-8"
    >
      {/* Search and Action Bar */}
      <motion.div
        variants={staggerChild}
        className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-bg-elev/30 border border-border/40 p-4 rounded-xl backdrop-blur-md"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-dim" />
          <input
            type="text"
            placeholder="Search decks by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-elev2 border border-border/40 hover:border-border/80 focus:border-accent/80 rounded-md py-2 pl-9 pr-4 text-[13px] outline-none text-text placeholder-text-dim transition-colors"
          />
        </div>

        <button
          onClick={handleReviewAll}
          disabled={filteredLessons.length === 0}
          className="flex items-center justify-center gap-2 h-9.5 px-4.5 rounded-lg bg-accent text-bg font-bold text-[13px] hover:bg-accent-2 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-accent/15 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          Review all filtered ({filteredLessons.reduce((acc, l) => acc + l.cardCount, 0)} cards)
        </button>
      </motion.div>

      {/* Filter Options */}
      <motion.div variants={staggerChild} className="flex flex-wrap gap-6 items-center border-b border-border/20 pb-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-text-dim uppercase tracking-wider font-bold">Status:</span>
          <div className="flex rounded-md border border-border/30 bg-bg-elev/40 p-0.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-sm cursor-pointer transition-colors ${
                filterType === 'all' ? 'bg-bg-elev2 text-accent font-semibold' : 'text-text-dim hover:text-text'
              }`}
            >
              All Decks
            </button>
            <button
              onClick={() => setFilterType('unseen')}
              className={`px-3 py-1 rounded-sm cursor-pointer transition-colors ${
                filterType === 'unseen' ? 'bg-bg-elev2 text-accent font-semibold' : 'text-text-dim hover:text-text'
              }`}
            >
              Unseen
            </button>
            <button
              onClick={() => setFilterType('completed')}
              className={`px-3 py-1 rounded-sm cursor-pointer transition-colors ${
                filterType === 'completed' ? 'bg-bg-elev2 text-accent font-semibold' : 'text-text-dim hover:text-text'
              }`}
            >
              Completed Lessons
            </button>
          </div>
        </div>

        {/* Part Filter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-text-dim uppercase tracking-wider font-bold">Chapters:</span>
          <div className="flex rounded-md border border-border/30 bg-bg-elev/40 p-0.5">
            {[
              { label: 'All', val: 'all' },
              { label: 'Part 1-5', val: '1-5' },
              { label: 'Part 6-10', val: '6-10' },
              { label: 'Part 11-20', val: '11-20' },
            ].map((chip) => (
              <button
                key={chip.val}
                onClick={() => setPartRange(chip.val)}
                className={`px-3 py-1 rounded-sm cursor-pointer transition-colors ${
                  partRange === chip.val ? 'bg-bg-elev2 text-accent font-semibold' : 'text-text-dim hover:text-text'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Grid of Decks */}
      <motion.div
        variants={staggerChild}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredLessons.map((l) => {
          const stats = mounted ? flashSeen[l.id] : null;
          const isDone = mounted && completed[l.id];

          return (
            <motion.div
              key={l.id}
              onClick={() => handleStartDeck(l)}
              whileHover={{ y: -2 }}
              className="group border border-border/30 rounded-xl p-4 bg-bg-elev/15 hover:bg-bg-elev/45 hover:border-border/80 transition-all cursor-pointer shadow-xs flex flex-col justify-between select-none"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-accent uppercase">
                    Lesson {l.id}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-done font-bold bg-done/10 border border-done/20 px-1.5 py-0.5 rounded-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      DONE
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-[13.5px] text-text leading-tight group-hover:text-accent transition-colors duration-150">
                    {l.title}
                  </h3>
                  <p className="text-[11.5px] text-text-dim">
                    Part {l.partNum} · {l.cardCount} cards
                  </p>
                </div>
              </div>

              {/* Session review status */}
              <div className="mt-5 pt-3 border-t border-border/10 flex items-center justify-between text-[11px] font-mono text-text-dim">
                <span>Reviewed: {stats ? stats.seenCount : 0} times</span>
                <span>{stats ? formatDate(stats.lastReviewed) : 'Never'}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <motion.div
          variants={staggerChild}
          className="flex flex-col items-center justify-center py-16 text-center space-y-3"
        >
          <Layers className="w-8 h-8 text-text-dim/40 animate-pulse" />
          <h3 className="font-bold text-[14px] text-text">No matching flashcard decks</h3>
          <p className="text-xs text-text-dim max-w-xs">
            Try adjusting your search criteria or review parameters to locate decks.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

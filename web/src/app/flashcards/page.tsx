import { allLessons } from 'contentlayer/generated';
import { DeckPicker } from '@/components/flashcards/DeckPicker';

export const metadata = {
  title: 'Flashcard Review | System Design Mastery',
  description: 'Review system design revision notes and questions using active spaced repetition decks.',
};

export default function FlashcardsCatalogPage() {
  // Extract and format all lessons containing flashcard questions
  const lessonsWithDecks = allLessons
    .filter((l) => l.flashcards && (l.flashcards as any[]).length > 0)
    .map((l) => {
      const meta = l.metadata as any;
      return {
        id: meta.lessonId || l.slug.split('/').pop() || '',
        title: l.title,
        slug: l.slug,
        partNum: meta.partNum || 0,
        cardCount: (l.flashcards as any[]).length,
        flashcards: l.flashcards as any[],
      };
    })
    // Sort logically by lesson ID ordering
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-14 space-y-8">
      {/* Header */}
      <header className="border-b border-border/20 pb-5 space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text">
          Flashcard Review
        </h1>
        <p className="text-sm text-text-dim leading-relaxed font-medium">
          Retain core system design terminology, patterns, and quality attribute trade-offs using spaced-repetition active recall.
        </p>
      </header>

      {/* Deck Picker Grid */}
      <DeckPicker lessons={lessonsWithDecks} />
    </div>
  );
}

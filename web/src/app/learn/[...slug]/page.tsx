import { allLessons } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { LessonHeader } from '@/components/content/LessonHeader';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { Pager } from '@/components/layout/Pager';
import { TocRail } from '@/components/content/TocRail';
import { ReadingProgressBar } from '@/components/content/ReadingProgressBar';
import { ActiveFlashcardTracker } from '@/components/content/ActiveFlashcardTracker';
import { MarkCompleteButton } from '@/components/content/MarkCompleteButton';

export function generateStaticParams() {
  return allLessons.map((lesson) => ({
    slug: lesson.slug.split('/'),
  }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugString = resolvedParams.slug.join('/');
  const lesson = allLessons.find((l) => l.slug === slugString);

  if (!lesson) {
    notFound();
  }

  const { difficulty, prerequisites, unlocks } = lesson.metadata as any;

  return (
    <>
      {/* Scroll tracking indicator */}
      <ReadingProgressBar />

      {/* Sync active flashcards to client state */}
      <ActiveFlashcardTracker flashcards={lesson.flashcards as any[]} />

      {/*
       * Layout strategy:
       * - px-8 gives a consistent left gutter at all sidebar states
       * - xl:pr-56 reserves space so content never slides under the fixed TOC
       * - max-w-[var(--max-read)] on the article keeps reading width stable
       * - mx-auto recenters within the available space as sidebar expands/collapses
       * - No transition needed here — the parent flex container handles the animation
       */}
      <div className="w-full px-8 py-10 md:py-14 xl:pr-56">
        <article className="w-full max-w-[var(--max-read)] mx-auto">
          {/* Header */}
          <header className="mb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
              {lesson.title}
            </h1>
          </header>

          {/* Lesson Metadata details */}
          <LessonHeader
            difficulty={difficulty}
            readingTime={lesson.readingTime}
            prerequisites={prerequisites || []}
            unlocks={unlocks || []}
          />

          {/* Markdown Content rendering */}
          <MarkdownRenderer html={lesson.body.html} />

          {/* Mark complete at bottom of lesson */}
          <MarkCompleteButton />

          {/* Bottom Pager */}
          <Pager />
        </article>
      </div>

      {/* TOC Rail — fixed to viewport right edge, never shifts with layout */}
      <TocRail />
    </>
  );
}

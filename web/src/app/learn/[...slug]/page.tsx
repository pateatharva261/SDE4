import { allLessons } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { LessonHeader } from '@/components/content/LessonHeader';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { Pager } from '@/components/layout/Pager';
import { TocRail } from '@/components/content/TocRail';
import { ReadingProgressBar } from '@/components/content/ReadingProgressBar';
import { ActiveFlashcardTracker } from '@/components/content/ActiveFlashcardTracker';

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

      {/* Primary Layout Container */}
      <div className="flex w-full items-start gap-10 max-w-7xl mx-auto px-6 py-10 md:py-14">
        {/* Main lesson content panel */}
        <article className="flex-1 min-w-0 max-w-[var(--max-read)]">
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

          {/* Bottom Pager */}
          <Pager />
        </article>

        {/* Right Rail Table of Contents */}
        <TocRail />
      </div>
    </>
  );
}

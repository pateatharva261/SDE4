import { allLessons } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { DeckDetailClient } from '@/components/flashcards/DeckDetailClient';

export function generateStaticParams() {
  return allLessons
    .filter((l) => l.flashcards && (l.flashcards as any[]).length > 0)
    .map((l) => ({
      lessonId: (l.metadata as any).lessonId || l.slug.split('/').pop() || '',
    }));
}

export default async function DeckDetailPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = await params;
  const { lessonId } = resolvedParams;

  const lesson = allLessons.find(
    (l) =>
      (l.metadata as any).lessonId === lessonId ||
      l.slug.split('/').pop() === lessonId
  );

  if (!lesson || !lesson.flashcards || (lesson.flashcards as any[]).length === 0) {
    notFound();
  }

  return (
    <DeckDetailClient
      lessonId={lessonId}
      title={lesson.title}
      flashcards={lesson.flashcards as any[]}
    />
  );
}

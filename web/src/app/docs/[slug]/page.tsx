import { allBackbones } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { Pager } from '@/components/layout/Pager';

export function generateStaticParams() {
  return allBackbones.map((doc) => ({
    slug: doc.slug,
  }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const doc = allBackbones.find((d) => d.slug === resolvedParams.slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-14">
      {/* Document Header */}
      <header className="mb-8 border-b border-border/20 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
          {doc.title}
        </h1>
        {doc.description && (
          <p className="text-base text-text-dim leading-relaxed font-medium">
            {doc.description}
          </p>
        )}
      </header>

      {/* Document body rendered via custom Markdown renderer */}
      <MarkdownRenderer html={doc.body.html} />

      {/* Bottom Pager */}
      <Pager />
    </div>
  );
}

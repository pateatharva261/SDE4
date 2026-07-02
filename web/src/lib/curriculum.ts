import { COURSE } from '@/data/manifest';

export interface FlatItem {
  id: string;
  title: string;
  path: string;
  kind: 'doc' | 'lesson' | 'ref';
  url: string;
  part?: number;
}

export function buildFlatList(): FlatItem[] {
  const flat: FlatItem[] = [];

  // 1. Backbone docs (Getting Started)
  COURSE.backbone.forEach((d) => {
    const slug = d.path.replace(/\.md$/, '');
    flat.push({
      id: d.id,
      title: d.title,
      path: d.path,
      kind: 'doc',
      url: `/docs/${slug}`,
    });
  });

  // 2. Lessons (Curriculum)
  COURSE.parts.forEach((p) => {
    p.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        const slug = l.path.replace(/^lessons\//, '').replace(/\.md$/, '');
        flat.push({
          id: l.id,
          title: l.title,
          path: l.path,
          kind: 'lesson',
          url: `/learn/${slug}`,
          part: p.num,
        });
      });
    });
  });

  // 3. Reference docs (Cheatsheets)
  COURSE.reference.forEach((d) => {
    const slug = d.path.replace(/^reference\//, '').replace(/\.md$/, '');
    flat.push({
      id: d.id,
      title: d.title,
      path: d.path,
      kind: 'ref',
      url: `/reference/${slug}`,
    });
  });

  return flat;
}

export function getFirstIncompleteLesson(completed: Record<string, true>): FlatItem {
  const flat = buildFlatList();
  const lessons = flat.filter((i) => i.kind === 'lesson');
  const firstIncomplete = lessons.find((l) => !completed[l.id]);
  return firstIncomplete || lessons[0];
}

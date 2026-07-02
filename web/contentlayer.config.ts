import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { COURSE } from './src/data/manifest';

// Helper to look up titles and descriptions from the authorative manifest
function getDocMetadata(sourceFilePath: string, rawContent: string) {
  // Clean path to match manifest formats:
  // "backbone/00-START-HERE.md" -> "00-START-HERE.md"
  // "lessons/..." -> "lessons/..."
  // "reference/..." -> "reference/..."
  const cleanPath = sourceFilePath.replace(/^backbone\//, '');

  // 1. Search in backbone
  const backboneItem = COURSE.backbone.find((b) => b.path === cleanPath);
  if (backboneItem) {
    return { title: backboneItem.title, description: '' };
  }

  // 2. Search in reference
  const referenceItem = COURSE.reference.find((r) => r.path === cleanPath);
  if (referenceItem) {
    return { title: referenceItem.title, description: '' };
  }

  // 3. Search in lessons
  for (const part of COURSE.parts) {
    for (const mod of part.modules) {
      const lessonItem = mod.lessons.find((l) => l.path === cleanPath);
      if (lessonItem) {
        // Parse description from the Section 1 metadata block
        const desc = new RegExp(`\\*\\*Description:\\*\\*\\s*(.+)`, 'i').exec(rawContent.slice(0, 2000))?.[1]?.trim() || '';
        return { title: lessonItem.title, description: desc };
      }
    }
  }

  // Fallback: parse first `# heading` from raw content
  const firstHeading = /^#\s+(.+)$/m.exec(rawContent)?.[1]?.trim() || 'Untitled';
  return { title: firstHeading, description: '' };
}

// Regex-based helpers for extracting metadata from Section 1 headers (no front-matter)
function normalizeDifficulty(val?: string): 'foundational' | 'intermediate' | 'advanced' | 'staff' | undefined {
  if (!val) return undefined;
  const low = val.toLowerCase().trim();
  if (low.includes('foundational')) return 'foundational';
  if (low.includes('intermediate')) return 'intermediate';
  if (low.includes('advanced')) return 'advanced';
  if (low.includes('staff')) return 'staff';
  return undefined;
}

function splitList(val?: string): string[] {
  if (!val) return [];
  const cleaned = val.trim();
  if (cleaned.toLowerCase() === 'none' || cleaned === '-') return [];
  return cleaned.split(',').map((s) => s.trim()).filter(Boolean);
}

export function parseLessonHeader(raw: string) {
  const head = raw.slice(0, 2000);
  const grab = (label: string) =>
    new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, 'i').exec(head)?.[1]?.trim();
  
  return {
    partNum: Number(grab('Part')?.match(/\d+/)?.[0]) || 0,
    lessonId: grab('Lesson') || grab('ID') || '',
    difficulty: normalizeDifficulty(grab('Difficulty')) || 'foundational',
    prerequisites: splitList(grab('Prerequisites')),
    unlocks: splitList(grab('Unlocks')),
  };
}

// Flashcard extraction regex from §6.1
const SECTION = /##\s*16\.\s*Revision\s+Notes\b([\s\S]*?)(?=\n##\s|$)/i;
const CARD    = /\*\*Q:\*\*\s*(.+?)\s*\*\*A:\*\*\s*(.+)/g;

export interface Flashcard { q: string; a: string; }

export function extractFlashcards(md: string): Flashcard[] {
  const section = SECTION.exec(md)?.[1] ?? '';
  const out: Flashcard[] = [];
  for (const m of section.matchAll(CARD)) {
    out.push({ q: m[1].trim(), a: m[2].trim() });
  }
  return out;
}

export const Lesson = defineDocumentType(() => ({
  name: 'Lesson',
  filePathPattern: `lessons/**/*.md`,
  fields: {}, // No front-matter fields required
  computedFields: {
    title: { type: 'string', resolve: (d) => getDocMetadata(d._raw.sourceFilePath, d.body.raw).title },
    description: { type: 'string', resolve: (d) => getDocMetadata(d._raw.sourceFilePath, d.body.raw).description },
    slug: { type: 'string', resolve: (d) => d._raw.flattenedPath.replace(/^lessons\//, '') },
    url:  { type: 'string', resolve: (d) => `/learn/${d._raw.flattenedPath.replace(/^lessons\//, '')}` },
    readingTime: { type: 'number', resolve: (d) => Math.max(3, Math.round(d.body.raw.split(/\s+/).length / 220)) },
    flashcards: {
      type: 'json',
      resolve: (d) => extractFlashcards(d.body.raw),
    },
    metadata: {
      type: 'json',
      resolve: (d) => parseLessonHeader(d.body.raw),
    }
  },
}));

export const ReferenceDoc = defineDocumentType(() => ({
  name: 'ReferenceDoc',
  filePathPattern: `reference/*.md`,
  fields: {}, // No front-matter fields required
  computedFields: {
    title: { type: 'string', resolve: (d) => getDocMetadata(d._raw.sourceFilePath, d.body.raw).title },
    description: { type: 'string', resolve: (d) => getDocMetadata(d._raw.sourceFilePath, d.body.raw).description },
    slug: { type: 'string', resolve: (d) => d._raw.sourceFileName.replace(/\.md$/, '') },
    url:  { type: 'string', resolve: (d) => `/reference/${d._raw.sourceFileName.replace(/\.md$/, '')}` },
  },
}));

export const Backbone = defineDocumentType(() => ({
  name: 'Backbone',
  filePathPattern: `backbone/*.md`,
  fields: {}, // No front-matter fields required
  computedFields: {
    title: { type: 'string', resolve: (d) => getDocMetadata(d._raw.sourceFilePath, d.body.raw).title },
    description: { type: 'string', resolve: (d) => getDocMetadata(d._raw.sourceFilePath, d.body.raw).description },
    slug: { type: 'string', resolve: (d) => d._raw.sourceFileName.replace(/\.md$/, '') },
    url:  { type: 'string', resolve: (d) => `/docs/${d._raw.sourceFileName.replace(/\.md$/, '')}` },
  },
}));

const preMermaidPlugin = () => (tree: any) => {
  const visit = (node: any) => {
    if (
      node.tagName === 'pre' &&
      node.children?.[0]?.tagName === 'code' &&
      node.children[0].properties?.className?.includes('language-mermaid')
    ) {
      node.tagName = 'pre-mermaid';
      node.children[0].tagName = 'code-mermaid';
    }
    if (node.children) {
      node.children.forEach(visit);
    }
  };
  visit(tree);
};

const postMermaidPlugin = () => (tree: any) => {
  const visit = (node: any) => {
    if (node.tagName === 'pre-mermaid') {
      node.tagName = 'pre';
      if (node.children?.[0]?.tagName === 'code-mermaid') {
        node.children[0].tagName = 'code';
      }
    }
    if (node.children) {
      node.children.forEach(visit);
    }
  };
  visit(tree);
};

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Lesson, ReferenceDoc, Backbone],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      preMermaidPlugin,
      [rehypePrettyCode, { theme: { dark: 'github-dark-dimmed', light: 'github-light' }, keepBackground: false }],
      postMermaidPlugin,
    ],
  },
});

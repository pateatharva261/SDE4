// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
function normalizeDifficulty(val) {
  if (!val) return void 0;
  const low = val.toLowerCase().trim();
  if (low.includes("foundational")) return "foundational";
  if (low.includes("intermediate")) return "intermediate";
  if (low.includes("advanced")) return "advanced";
  if (low.includes("staff")) return "staff";
  return void 0;
}
function splitList(val) {
  if (!val) return [];
  const cleaned = val.trim();
  if (cleaned.toLowerCase() === "none" || cleaned === "-") return [];
  return cleaned.split(",").map((s) => s.trim()).filter(Boolean);
}
function parseLessonHeader(raw) {
  const head = raw.slice(0, 2e3);
  const grab = (label) => new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, "i").exec(head)?.[1]?.trim();
  return {
    partNum: Number(grab("Part")?.match(/\d+/)?.[0]) || 0,
    lessonId: grab("Lesson") || grab("ID") || "",
    difficulty: normalizeDifficulty(grab("Difficulty")) || "foundational",
    prerequisites: splitList(grab("Prerequisites")),
    unlocks: splitList(grab("Unlocks"))
  };
}
var SECTION = /##\s*16\.\s*Revision\s+Notes\b([\s\S]*?)(?=\n##\s|$)/i;
var CARD = /\*\*Q:\*\*\s*(.+?)\s*\*\*A:\*\*\s*(.+)/g;
function extractFlashcards(md) {
  const section = SECTION.exec(md)?.[1] ?? "";
  const out = [];
  for (const m of section.matchAll(CARD)) {
    out.push({ q: m[1].trim(), a: m[2].trim() });
  }
  return out;
}
var commonFields = {
  title: { type: "string", required: true },
  description: { type: "string" }
};
var Lesson = defineDocumentType(() => ({
  name: "Lesson",
  filePathPattern: `lessons/**/*.md`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string" }
  },
  computedFields: {
    slug: { type: "string", resolve: (d) => d._raw.flattenedPath.replace(/^lessons\//, "") },
    url: { type: "string", resolve: (d) => `/learn/${d._raw.flattenedPath.replace(/^lessons\//, "")}` },
    readingTime: { type: "number", resolve: (d) => Math.max(3, Math.round(d.body.raw.split(/\s+/).length / 220)) },
    flashcards: {
      type: "json",
      resolve: (d) => extractFlashcards(d.body.raw)
    },
    metadata: {
      type: "json",
      resolve: (d) => parseLessonHeader(d.body.raw)
    }
  }
}));
var ReferenceDoc = defineDocumentType(() => ({
  name: "ReferenceDoc",
  filePathPattern: `reference/*.md`,
  fields: commonFields,
  computedFields: {
    slug: { type: "string", resolve: (d) => d._raw.sourceFileName.replace(/\.md$/, "") },
    url: { type: "string", resolve: (d) => `/reference/${d._raw.sourceFileName.replace(/\.md$/, "")}` }
  }
}));
var Backbone = defineDocumentType(() => ({
  name: "Backbone",
  filePathPattern: `backbone/*.md`,
  fields: commonFields,
  computedFields: {
    slug: { type: "string", resolve: (d) => d._raw.sourceFileName.replace(/\.md$/, "") },
    url: { type: "string", resolve: (d) => `/docs/${d._raw.sourceFileName.replace(/\.md$/, "")}` }
  }
}));
var Lab = defineDocumentType(() => ({
  name: "Lab",
  filePathPattern: `labs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string" },
    partNum: { type: "number", required: true },
    difficulty: { type: "enum", options: ["easy", "medium", "hard"], required: true },
    estimatedMinutes: { type: "number", required: true },
    kind: { type: "enum", options: ["visualizer", "sandpack", "walkthrough"], required: true },
    linkedLessons: { type: "list", of: { type: "string" } }
  },
  computedFields: {
    slug: { type: "string", resolve: (d) => d._raw.flattenedPath.replace(/^labs\//, "") },
    url: { type: "string", resolve: (d) => `/labs/${d._raw.flattenedPath.replace(/^labs\//, "")}` }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Lesson, ReferenceDoc, Backbone, Lab],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, { theme: { dark: "github-dark", light: "github-light" }, keepBackground: false }]
    ]
  }
});
export {
  Backbone,
  Lab,
  Lesson,
  ReferenceDoc,
  contentlayer_config_default as default,
  extractFlashcards,
  parseLessonHeader
};
//# sourceMappingURL=compiled-contentlayer-config-YCZORA3O.mjs.map

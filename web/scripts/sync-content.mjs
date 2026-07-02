import { rmSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = join(process.cwd(), '..');
const src  = join(root, 'platform');
const dst  = join(process.cwd(), 'content');

const jobs = [
  { from: 'lessons',   to: 'lessons' },
  { from: 'reference', to: 'reference' },
];
const backboneFiles = [
  '00-START-HERE.md','01-CURRICULUM-MAP.md','02-LEARNING-ROADMAP.md',
  '03-CONCEPT-DEPENDENCY-GRAPH.md','04-STUDY-SCHEDULES.md',
];

rmSync(join(dst,'lessons'),  { recursive:true, force:true });
rmSync(join(dst,'reference'),{ recursive:true, force:true });
rmSync(join(dst,'backbone'), { recursive:true, force:true });
mkdirSync(join(dst,'backbone'), { recursive:true });

for (const j of jobs) cpSync(join(src, j.from), join(dst, j.to), { recursive: true });
for (const f of backboneFiles) if (existsSync(join(src, f))) cpSync(join(src, f), join(dst,'backbone', f));

console.log('✓ Content synced from platform/ → web/content/');

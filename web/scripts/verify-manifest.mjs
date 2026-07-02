import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const manifestPath = join(process.cwd(), 'src/data/manifest.ts');
const manifestContent = readFileSync(manifestPath, 'utf8');

// Find all occurrences of paths pointing to .md files
const pathRegex = /path:\s*["']([^"']+\.md)["']/g;
let match;
const paths = [];
while ((match = pathRegex.exec(manifestContent)) !== null) {
  paths.push(match[1]);
}

console.log(`Found ${paths.length} file paths in manifest.ts`);

let missingCount = 0;
for (const p of paths) {
  // The paths in manifest are relative to platform root:
  // e.g. "00-START-HERE.md" (mapped to content/backbone/00-START-HERE.md)
  // or "reference/tradeoff-worksheet.md" (mapped to content/reference/tradeoff-worksheet.md)
  // or "lessons/part-01-.../1.1.1-...md" (mapped to content/lessons/part-01-.../1.1.1-...md)
  let contentPath;
  if (p.startsWith('lessons/')) {
    contentPath = join(process.cwd(), 'content', p);
  } else if (p.startsWith('reference/')) {
    contentPath = join(process.cwd(), 'content', p);
  } else {
    // Backbone files are copied to backbone/ subdirectory under content/
    contentPath = join(process.cwd(), 'content', 'backbone', p);
  }

  if (!existsSync(contentPath)) {
    console.error(`❌ Manifest path does not exist: ${contentPath} (manifest path: ${p})`);
    missingCount++;
  }
}

if (missingCount > 0) {
  console.error(`❌ Manifest verification failed: ${missingCount} files are missing in content/`);
  process.exit(1);
} else {
  console.log('✓ Manifest verification passed successfully!');
}

import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = realpathSync.native(fileURLToPath(new URL('../', import.meta.url)));
process.chdir(root);
const entry = join(root, 'node_modules', 'vitest', 'vitest.mjs');
process.argv[1] = entry;
await import(pathToFileURL(entry).href);

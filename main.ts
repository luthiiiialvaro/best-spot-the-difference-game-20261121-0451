// Cari Bedanya! — the entry program (Node 22, standard library only).
//
// What it does, in order:
//   1. Takes the game folder (game/) and the screenshots folder (screenshots/)
//      from beside this file and copies them into the output directory.
//   2. Writes dossier.json there with buildDossier from the kit's vendored
//      library, so the judge can read the game from one file.
//   3. Prints a short summary of what landed, and fails loudly when a
//      required piece is missing instead of handing in a half entry.
//
// The grader runs it twice into two fresh directories and expects the same
// bytes both times, so nothing here depends on the clock, randomness or the
// environment beyond MAKEFUN_OUTPUT_DIR (which stands in for /output when
// the program is run outside the grader):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The scorer's caps for this competition: the dossier text cap, at most four
// screenshots of at most 256 KiB each, and the game folder's file/size caps.
// They mirror the gate, so a program that passes them here passes there.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
} as const;

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  throw new Error(`cari-bedanya main.ts: ${message}`);
}

function countFiles(dir: string): number {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    total += entry.isDirectory() ? countFiles(path) : 1;
  }
  return total;
}

// --- 1. Sanity-check the entry before copying anything. ---
const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');
if (!existsSync(join(gameDir, 'index.html'))) fail('game/index.html is missing');
if (!existsSync(shotsDir)) fail('screenshots/ is missing');
const shotNames = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
if (shotNames.length < 3 || shotNames.length > 4) {
  fail(`screenshots/ must hold 3 or 4 images, found ${shotNames.length}`);
}
for (const name of shotNames) {
  const size = statSync(join(shotsDir, name)).size;
  if (size > 262144) fail(`screenshots/${name} is ${size} bytes, over the 256 KiB cap`);
}

// --- 2. Copy the game and its screenshots into the output directory. ---
mkdirSync(outDir, { recursive: true });
cpSync(gameDir, join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

// --- 3. Write the dossier the judge reads. ---
const dossier = buildDossier(outDir, DOSSIER_CAPS);
writeFileSync(join(outDir, 'dossier.json'), dossier);

// --- 4. Say what landed. ---
console.log(
  `cari-bedanya: ${countFiles(join(outDir, 'game'))} game files, ` +
    `${shotNames.length} screenshots (${shotNames.join(', ')}), ` +
    `dossier.json ${Buffer.byteLength(dossier)} bytes -> ${outDir}`,
);

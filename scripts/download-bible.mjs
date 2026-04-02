/**
 * Download Bible content from bolls.life API (5 chapters per batch)
 * Usage: node scripts/download-bible.mjs [VERSION] [BATCH_SIZE]
 * Default version: ARA, default batch: 5
 *
 * Saves progress to scripts/bible-progress-VERSION.json
 * Generates TypeScript files to lib/bible-local/VERSION/<book>.ts
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const VERSION = process.argv[2] || 'ARA';
const BATCH_SIZE = parseInt(process.argv[3] || '5', 10);
const DELAY_MS = 1200; // pause between batches (ms)
const TIMEOUT_MS = 10000;

const PROGRESS_FILE = path.join(__dirname, `bible-progress-${VERSION}.json`);
const OUT_DIR = path.join(ROOT, 'lib', 'bible-local', VERSION);

// ─── All 66 books (bookId, bookNum, chapters) ────────────────────────────────
const BOOKS = [
  { id: 'genesis',          num: 1,  ch: 50 },
  { id: 'exodo',            num: 2,  ch: 40 },
  { id: 'levitico',         num: 3,  ch: 27 },
  { id: 'numeros',          num: 4,  ch: 36 },
  { id: 'deuteronomio',     num: 5,  ch: 34 },
  { id: 'josue',            num: 6,  ch: 24 },
  { id: 'juizes',           num: 7,  ch: 21 },
  { id: 'rute',             num: 8,  ch: 4  },
  { id: '1samuel',          num: 9,  ch: 31 },
  { id: '2samuel',          num: 10, ch: 24 },
  { id: '1reis',            num: 11, ch: 22 },
  { id: '2reis',            num: 12, ch: 25 },
  { id: '1cronicas',        num: 13, ch: 29 },
  { id: '2cronicas',        num: 14, ch: 36 },
  { id: 'esdras',           num: 15, ch: 10 },
  { id: 'neemias',          num: 16, ch: 13 },
  { id: 'ester',            num: 17, ch: 10 },
  { id: 'jo',               num: 18, ch: 42 },
  { id: 'salmos',           num: 19, ch: 150},
  { id: 'proverbios',       num: 20, ch: 31 },
  { id: 'eclesiastes',      num: 21, ch: 12 },
  { id: 'cantares',         num: 22, ch: 8  },
  { id: 'isaias',           num: 23, ch: 66 },
  { id: 'jeremias',         num: 24, ch: 52 },
  { id: 'lamentacoes',      num: 25, ch: 5  },
  { id: 'ezequiel',         num: 26, ch: 48 },
  { id: 'daniel',           num: 27, ch: 12 },
  { id: 'oseias',           num: 28, ch: 14 },
  { id: 'joel',             num: 29, ch: 3  },
  { id: 'amos',             num: 30, ch: 9  },
  { id: 'obadias',          num: 31, ch: 1  },
  { id: 'jonas',            num: 32, ch: 4  },
  { id: 'miqueias',         num: 33, ch: 7  },
  { id: 'naum',             num: 34, ch: 3  },
  { id: 'habacuque',        num: 35, ch: 3  },
  { id: 'sofonias',         num: 36, ch: 3  },
  { id: 'ageu',             num: 37, ch: 2  },
  { id: 'zacarias',         num: 38, ch: 14 },
  { id: 'malaquias',        num: 39, ch: 4  },
  { id: 'mateus',           num: 40, ch: 28 },
  { id: 'marcos',           num: 41, ch: 16 },
  { id: 'lucas',            num: 42, ch: 24 },
  { id: 'joao',             num: 43, ch: 21 },
  { id: 'atos',             num: 44, ch: 28 },
  { id: 'romanos',          num: 45, ch: 16 },
  { id: '1corintios',       num: 46, ch: 16 },
  { id: '2corintios',       num: 47, ch: 13 },
  { id: 'galatas',          num: 48, ch: 6  },
  { id: 'efesios',          num: 49, ch: 6  },
  { id: 'filipenses',       num: 50, ch: 4  },
  { id: 'colossenses',      num: 51, ch: 4  },
  { id: '1tessalonicenses', num: 52, ch: 5  },
  { id: '2tessalonicenses', num: 53, ch: 3  },
  { id: '1timoteo',         num: 54, ch: 6  },
  { id: '2timoteo',         num: 55, ch: 4  },
  { id: 'tito',             num: 56, ch: 3  },
  { id: 'filemom',          num: 57, ch: 1  },
  { id: 'hebreus',          num: 58, ch: 13 },
  { id: 'tiago',            num: 59, ch: 5  },
  { id: '1pedro',           num: 60, ch: 5  },
  { id: '2pedro',           num: 61, ch: 3  },
  { id: '1joao',            num: 62, ch: 5  },
  { id: '2joao',            num: 63, ch: 1  },
  { id: '3joao',            num: 64, ch: 1  },
  { id: 'judas',            num: 65, ch: 1  },
  { id: 'apocalipse',       num: 66, ch: 22 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchChapter(bookNum, chapter, version) {
  return new Promise((resolve) => {
    const url = `https://bolls.life/get-text/${version}/${bookNum}/${chapter}/`;
    const req = https.get(url, { timeout: TIMEOUT_MS }, (res) => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          if (!Array.isArray(json) || json.length === 0) return resolve(null);
          const verses = json
            .sort((a, b) => a.verse - b.verse)
            .map(v => v.text.replace(/<[^>]*>/g, '').trim());
          resolve(verses);
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function loadExistingBookData(bookId) {
  const file = path.join(OUT_DIR, `${bookId}.json`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function saveBookData(bookId, data) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const file = path.join(OUT_DIR, `${bookId}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function outTsFile(bookId) {
  return path.join(OUT_DIR, `${bookId}.ts`);
}

function generateTsFile(bookId, version, data) {
  const chapters = Object.keys(data).sort((a, b) => Number(a) - Number(b));
  const raw = `${bookId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_${version}`;
  const exportName = /^[0-9]/.test(raw) ? `BOOK_${raw}` : raw;
  const lines = [
    `// Auto-generated — ${bookId} (${version})`,
    `// Do NOT edit manually. Re-run scripts/download-bible.mjs to update.`,
    ``,
    `export const ${exportName}: Record<number, string[]> = {`,
  ];
  for (const ch of chapters) {
    const verses = data[ch];
    const versesJson = JSON.stringify(verses);
    lines.push(`  ${ch}: ${versesJson},`);
  }
  lines.push(`};`);
  lines.push(``);
  return lines.join('\n');
}

// ─── Build queue: all chapters not yet downloaded ────────────────────────────
function buildQueue(progress) {
  const queue = [];
  for (const book of BOOKS) {
    const bookProgress = progress[book.id] || {};
    for (let ch = 1; ch <= book.ch; ch++) {
      if (!bookProgress[ch]) {
        queue.push({ bookId: book.id, bookNum: book.num, chapter: ch });
      }
    }
  }
  return queue;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📖 Baixando Bíblia: versão ${VERSION}`);
  console.log(`   Lotes de ${BATCH_SIZE} capítulos | pausa ${DELAY_MS}ms entre lotes\n`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const progress = loadProgress();
  const queue = buildQueue(progress);

  const totalChapters = BOOKS.reduce((s, b) => s + b.ch, 0);
  const done = totalChapters - queue.length;

  console.log(`   Total: ${totalChapters} capítulos | Já baixados: ${done} | Faltam: ${queue.length}\n`);

  if (queue.length === 0) {
    console.log('✅ Todos os capítulos já foram baixados!');
    generateAllTsFiles(progress);
    return;
  }

  let downloaded = 0;
  let failed = 0;

  for (let i = 0; i < queue.length; i += BATCH_SIZE) {
    const batch = queue.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(async ({ bookId, bookNum, chapter }) => {
        const verses = await fetchChapter(bookNum, chapter, VERSION);
        return { bookId, chapter, verses };
      })
    );

    // Save each result
    for (const { bookId, chapter, verses } of results) {
      if (verses) {
        if (!progress[bookId]) progress[bookId] = {};
        progress[bookId][chapter] = verses;
        downloaded++;
        process.stdout.write(`✓ ${bookId} ${chapter}  `);
      } else {
        failed++;
        process.stdout.write(`✗ ${bookId} ${chapter}  `);
      }
    }

    // Persist progress and book JSON after each batch
    saveProgress(progress);
    for (const { bookId } of batch) {
      saveBookData(bookId, progress[bookId] || {});
    }

    const total = done + downloaded + failed;
    const pct = Math.round((total / totalChapters) * 100);
    console.log(`\n   [${total}/${totalChapters}] ${pct}% — ✓${downloaded} ✗${failed}`);

    if (i + BATCH_SIZE < queue.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n\n📦 Gerando arquivos TypeScript...`);
  generateAllTsFiles(progress);

  console.log(`\n✅ Concluído! ${downloaded} baixados, ${failed} falhas.`);
  if (failed > 0) {
    console.log(`   Execute novamente para tentar os ${failed} capítulos com falha.`);
  }
}

function generateAllTsFiles(progress) {
  for (const book of BOOKS) {
    const data = progress[book.id];
    if (!data || Object.keys(data).length === 0) continue;
    const ts = generateTsFile(book.id, VERSION, data);
    const file = path.join(OUT_DIR, `${book.id}.ts`);
    fs.writeFileSync(file, ts, 'utf8');
    process.stdout.write(`  → ${book.id}.ts\n`);
  }
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message);
  process.exit(1);
});

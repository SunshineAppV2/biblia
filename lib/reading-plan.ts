// Plano "Reavivados por Sua Palavra"
// 1 capítulo por dia, ordem canônica
// Dia 1 = 17/04/2025 — Dia 343 = 1 Crônicas 5 (25/03/2026)

export interface PlanChapter {
  bookId: string;
  bookName: string;
  chapter: number;
  dayNumber: number;
}

const PLAN_BOOKS: { bookId: string; name: string; chapters: number }[] = [
  { bookId: "genesis", name: "Gênesis", chapters: 50 },
  { bookId: "exodo", name: "Êxodo", chapters: 40 },
  { bookId: "levitico", name: "Levítico", chapters: 27 },
  { bookId: "numeros", name: "Números", chapters: 36 },
  { bookId: "deuteronomio", name: "Deuteronômio", chapters: 34 },
  { bookId: "josue", name: "Josué", chapters: 24 },
  { bookId: "juizes", name: "Juízes", chapters: 21 },
  { bookId: "rute", name: "Rute", chapters: 4 },
  { bookId: "1samuel", name: "1 Samuel", chapters: 31 },
  { bookId: "2samuel", name: "2 Samuel", chapters: 24 },
  { bookId: "1reis", name: "1 Reis", chapters: 22 },
  { bookId: "2reis", name: "2 Reis", chapters: 25 },
  { bookId: "1cronicas", name: "1 Crônicas", chapters: 29 },
  { bookId: "2cronicas", name: "2 Crônicas", chapters: 36 },
  { bookId: "esdras", name: "Esdras", chapters: 10 },
  { bookId: "neemias", name: "Neemias", chapters: 13 },
  { bookId: "ester", name: "Ester", chapters: 10 },
  { bookId: "jo", name: "Jó", chapters: 42 },
  { bookId: "salmos", name: "Salmos", chapters: 150 },
  { bookId: "proverbios", name: "Provérbios", chapters: 31 },
  { bookId: "eclesiastes", name: "Eclesiastes", chapters: 12 },
  { bookId: "cantares", name: "Cantares", chapters: 8 },
  { bookId: "isaias", name: "Isaías", chapters: 66 },
  { bookId: "jeremias", name: "Jeremias", chapters: 52 },
  { bookId: "lamentacoes", name: "Lamentações", chapters: 5 },
  { bookId: "ezequiel", name: "Ezequiel", chapters: 48 },
  { bookId: "daniel", name: "Daniel", chapters: 12 },
  { bookId: "oseias", name: "Oséias", chapters: 14 },
  { bookId: "joel", name: "Joel", chapters: 3 },
  { bookId: "amos", name: "Amós", chapters: 9 },
  { bookId: "abadias", name: "Abdias", chapters: 1 },
  { bookId: "jonas", name: "Jonas", chapters: 4 },
  { bookId: "miqueias", name: "Miquéias", chapters: 7 },
  { bookId: "naum", name: "Naum", chapters: 3 },
  { bookId: "habacuque", name: "Habacuque", chapters: 3 },
  { bookId: "sofonias", name: "Sofonias", chapters: 3 },
  { bookId: "ageu", name: "Ageu", chapters: 2 },
  { bookId: "zacarias", name: "Zacarias", chapters: 14 },
  { bookId: "malaquias", name: "Malaquias", chapters: 4 },
  { bookId: "mateus", name: "Mateus", chapters: 28 },
  { bookId: "marcos", name: "Marcos", chapters: 16 },
  { bookId: "lucas", name: "Lucas", chapters: 24 },
  { bookId: "joao", name: "João", chapters: 21 },
  { bookId: "atos", name: "Atos", chapters: 28 },
  { bookId: "romanos", name: "Romanos", chapters: 16 },
  { bookId: "1corintios", name: "1 Coríntios", chapters: 16 },
  { bookId: "2corintios", name: "2 Coríntios", chapters: 13 },
  { bookId: "galatas", name: "Gálatas", chapters: 6 },
  { bookId: "efesios", name: "Efésios", chapters: 6 },
  { bookId: "filipenses", name: "Filipenses", chapters: 4 },
  { bookId: "colossenses", name: "Colossenses", chapters: 4 },
  { bookId: "1tessalonicenses", name: "1 Tessalonicenses", chapters: 5 },
  { bookId: "2tessalonicenses", name: "2 Tessalonicenses", chapters: 3 },
  { bookId: "1timoteo", name: "1 Timóteo", chapters: 6 },
  { bookId: "2timoteo", name: "2 Timóteo", chapters: 4 },
  { bookId: "tito", name: "Tito", chapters: 3 },
  { bookId: "filemom", name: "Filemom", chapters: 1 },
  { bookId: "hebreus", name: "Hebreus", chapters: 13 },
  { bookId: "tiago", name: "Tiago", chapters: 5 },
  { bookId: "1pedro", name: "1 Pedro", chapters: 5 },
  { bookId: "2pedro", name: "2 Pedro", chapters: 3 },
  { bookId: "1joao", name: "1 João", chapters: 5 },
  { bookId: "2joao", name: "2 João", chapters: 1 },
  { bookId: "3joao", name: "3 João", chapters: 1 },
  { bookId: "judas", name: "Judas", chapters: 1 },
  { bookId: "apocalipse", name: "Apocalipse", chapters: 22 },
];

export const PLAN_CHAPTERS: PlanChapter[] = [];
let dayNum = 1;
for (const book of PLAN_BOOKS) {
  for (let ch = 1; ch <= book.chapters; ch++) {
    PLAN_CHAPTERS.push({ bookId: book.bookId, bookName: book.name, chapter: ch, dayNumber: dayNum++ });
  }
}

// Dia 1 = 17/04/2025
const PLAN_START = new Date(2025, 3, 17);

export function getPlanDayForDate(date: Date): number {
  const start = new Date(PLAN_START);
  start.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
  if (diff <= 0) return 1;
  return ((diff - 1) % PLAN_CHAPTERS.length) + 1;
}

export function getTodaysPlanChapter(): PlanChapter {
  const idx = getPlanDayForDate(new Date()) - 1;
  return PLAN_CHAPTERS[Math.max(0, Math.min(idx, PLAN_CHAPTERS.length - 1))];
}

export function getPlanProgress(): { dayNumber: number; totalDays: number; percent: number } {
  const dayNumber = getPlanDayForDate(new Date());
  const totalDays = PLAN_CHAPTERS.length;
  return { dayNumber, totalDays, percent: Math.round((dayNumber / totalDays) * 100) };
}

export function getUpcomingChapters(count = 4): PlanChapter[] {
  const todayDay = getPlanDayForDate(new Date());
  return Array.from({ length: count }, (_, i) => {
    const idx = (todayDay - 1 + i) % PLAN_CHAPTERS.length;
    return PLAN_CHAPTERS[idx];
  });
}

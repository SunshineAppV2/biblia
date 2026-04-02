export interface PlanChapter {
  bookId: string;
  bookName: string;
  chapter: number;
  dayNumber: number;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  type: "global" | "personal";
  books: string[]; // bookIds in this plan
  durationDays: number;
}

const ALL_BOOKS: { bookId: string; name: string; chapters: number }[] = [
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
  { bookId: "obadias", name: "Obadias", chapters: 1 },
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

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "rpsp",
    name: "RPSP",
    description: "Reavivados por Sua Palavra — Plano mundial adventista.",
    type: "global",
    books: ALL_BOOKS.map(b => b.bookId),
    durationDays: 1189,
  },
  {
    id: "nt3m",
    name: "NT em 3 Meses",
    description: "Todo o Novo Testamento em 90 dias.",
    type: "personal",
    books: ALL_BOOKS.slice(39).map(b => b.bookId),
    durationDays: 90,
  },
  {
    id: "sal30",
    name: "Salmos em 30 Dias",
    description: "Todos os Salmos em um mês.",
    type: "personal",
    books: ["salmos"],
    durationDays: 30,
  },
  {
    id: "pen60",
    name: "Pentateuco em 60 Dias",
    description: "Do Gênesis ao Deuteronômio em dois meses.",
    type: "personal",
    books: ["genesis", "exodo", "levitico", "numeros", "deuteronomio"],
    durationDays: 60,
  },
  {
    id: "bib1y",
    name: "Bíblia em 1 Ano",
    description: "Toda a Bíblia em 365 dias.",
    type: "personal",
    books: ALL_BOOKS.map(b => b.bookId),
    durationDays: 365,
  },
];

// Helper to get total chapters in a plan
export function getPlanSequence(planId: string): PlanChapter[] {
  const plan = READING_PLANS.find(p => p.id === planId) || READING_PLANS[0];
  const chapters: PlanChapter[] = [];
  
  const planBooks = ALL_BOOKS.filter(b => plan.books.includes(b.bookId));
  const totalChapters = planBooks.reduce((sum, b) => sum + b.chapters, 0);
  const capsPerDay = totalChapters / plan.durationDays;

  let currentCapInDay = 0;
  for (const book of planBooks) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      chapters.push({ 
        bookId: book.bookId, 
        bookName: book.name, 
        chapter: ch, 
        dayNumber: Math.floor(currentCapInDay / capsPerDay) + 1 
      });
      currentCapInDay++;
    }
  }
  return chapters;
}

// Global start for RPSP
const RPSP_START = new Date(2025, 3, 17);

export function getPlanChapter(planId: string, startDate?: Date): PlanChapter {
  const plan = READING_PLANS.find(p => p.id === planId) || READING_PLANS[0];
  const sequence = getPlanSequence(planId);

  let currentDay = 1;
  if (plan.type === "global") {
    const start = new Date(RPSP_START);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
    currentDay = ((diff - 1) % sequence.length) + 1;
  } else {
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    currentDay = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  }

  // Find the first chapter that matches this day or the last one if exceeded
  const chaptersForDay = sequence.filter(c => c.dayNumber === currentDay);
  if (chaptersForDay.length > 0) return chaptersForDay[0];
  
  return sequence[sequence.length - 1]; // Fallback to last
}

export function getPlanProgress(planId: string, startDate?: Date) {
  const plan = READING_PLANS.find(p => p.id === planId) || READING_PLANS[0];
  const sequence = getPlanSequence(planId);
  const chapter = getPlanChapter(planId, startDate);
  
  const dayNumber = chapter.dayNumber;
  const totalDays = plan.durationDays;
  return { dayNumber, totalDays, percent: Math.round((dayNumber / totalDays) * 100) };
}

export function getUpcomingChapters(planId: string, startDate?: Date, count = 4): PlanChapter[] {
  const sequence = getPlanSequence(planId);
  const currentChapter = getPlanChapter(planId, startDate);
  const currentIdx = sequence.findIndex(c => c.bookId === currentChapter.bookId && c.chapter === currentChapter.chapter);
  
  return sequence.slice(currentIdx, currentIdx + count);
}

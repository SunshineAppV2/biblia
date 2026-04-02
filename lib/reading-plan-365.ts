import { BIBLE_BOOKS } from "./bible-books";

export interface Plan365Chapter {
    bookId: string;
    bookName: string;
    chapter: number;
}

export interface Plan365Day {
    dayIndex: number;   // 0-364
    dateMMDD: string;   // "DD/MM"
    chapters: Plan365Chapter[];
}

export type Plan365Mode = "calendar" | "offset";

export interface Plan365Config {
    mode: Plan365Mode;
    startDate: string; // YYYY-MM-DD (the date that maps to Day 0 = "01/01" for offset mode)
}

// ─── Book name → bookId map ───────────────────────────────────────────────────
const BOOK_NAME_MAP: Record<string, string> = {
    "Gênesis": "genesis", "Êxodo": "exodo", "Levítico": "levitico",
    "Números": "numeros", "Deuteronômio": "deuteronomio", "Josué": "josue",
    "Juízes": "juizes", "Rute": "rute",
    "1 Samuel": "1samuel", "2 Samuel": "2samuel",
    "1 Reis": "1reis", "2 Reis": "2reis",
    "1 Crônicas": "1cronicas", "2 Crônicas": "2cronicas",
    "Esdras": "esdras", "Neemias": "neemias", "Ester": "ester",
    "Jó": "jo", "Salmos": "salmos", "Provérbios": "proverbios",
    "Eclesiastes": "eclesiastes", "Cantares": "cantares",
    "Isaías": "isaias", "Jeremias": "jeremias", "Lamentações": "lamentacoes",
    "Ezequiel": "ezequiel", "Daniel": "daniel", "Oseias": "oseias",
    "Joel": "joel", "Amós": "amos", "Obadias": "obadias",
    "Jonas": "jonas", "Miqueias": "miqueias", "Naum": "naum",
    "Habacuque": "habacuque", "Sofonias": "sofonias", "Ageu": "ageu",
    "Zacarias": "zacarias", "Malaquias": "malaquias",
    "Mateus": "mateus", "Marcos": "marcos", "Lucas": "lucas",
    "João": "joao", "Atos": "atos", "Romanos": "romanos",
    "1 Coríntios": "1corintios", "2 Coríntios": "2corintios",
    "Gálatas": "galatas", "Efésios": "efesios", "Filipenses": "filipenses",
    "Colossenses": "colossenses",
    "1 Tessalonicenses": "1tessalonicenses", "2 Tessalonicenses": "2tessalonicenses",
    "1 Timóteo": "1timoteo", "2 Timóteo": "2timoteo",
    "Tito": "tito", "Filemom": "filemom", "Hebreus": "hebreus",
    "Tiago": "tiago", "1 Pedro": "1pedro", "2 Pedro": "2pedro",
    "1 João": "1joao", "2 João": "2joao", "3 João": "3joao",
    "Judas": "judas", "Apocalipse": "apocalipse",
};

// Build chapter-count lookup from BIBLE_BOOKS
const BOOK_CHAPTERS: Record<string, number> = {};
const BOOK_DISPLAY_NAMES: Record<string, string> = {};
for (const b of BIBLE_BOOKS) {
    BOOK_CHAPTERS[b.id] = b.chapters;
    BOOK_DISPLAY_NAMES[b.id] = b.name;
}

// ─── Raw plan text ────────────────────────────────────────────────────────────
const RAW_PLAN = `01/01 - Gênesis 1-4
02/01 - Gênesis 5-8
03/01 - Gênesis 9-12
04/01 - Gênesis 13-16
05/01 - Gênesis 17-20
06/01 - Gênesis 21-24
07/01 - Gênesis 25-28
08/01 - Gênesis 29-32
09/01 - Gênesis 33-36
10/01 - Gênesis 37-40
11/01 - Gênesis 41-44
12/01 - Gênesis 45-48
13/01 - Gênesis 49 até Êxodo 2
14/01 - Êxodo 3-6
15/01 - Êxodo 7-10
16/01 - Êxodo 11-14
17/01 - Êxodo 15-18
18/01 - Êxodo 19-22
19/01 - Êxodo 23-26
20/01 - Êxodo 27-30
21/01 - Êxodo 31-34
22/01 - Êxodo 35-38
23/01 - Êxodo 39 até Levítico 2
24/01 - Levítico 3-6
25/01 - Levítico 7-10
26/01 - Levítico 11-14
27/01 - Levítico 15-18
28/01 - Levítico 19-22
29/01 - Levítico 23-26
30/01 - Levítico 27 até Números 3
31/01 - Números 4-7
01/02 - Números 8-11
02/02 - Números 12-15
03/02 - Números 16-19
04/02 - Números 20-23
05/02 - Números 24-27
06/02 - Números 28-31
07/02 - Números 32-35
08/02 - Números 36 até Deuteronômio 3
09/02 - Deuteronômio 4-7
10/02 - Deuteronômio 8-11
11/02 - Deuteronômio 12-15
12/02 - Deuteronômio 16-19
13/02 - Deuteronômio 20-23
14/02 - Deuteronômio 24-27
15/02 - Deuteronômio 28-31
16/02 - Deuteronômio 32 até Josué 1
17/02 - Josué 2-5
18/02 - Josué 6-9
19/02 - Josué 10-13
20/02 - Josué 14-17
21/02 - Josué 18-21
22/02 - Josué 22 até Juízes 1
23/02 - Juízes 2-5
24/02 - Juízes 6-9
25/02 - Juízes 10-13
26/02 - Juízes 14-17
27/02 - Juízes 18-21
28/02 - Rute 1-4
01/03 - 1 Samuel 1-4
02/03 - 1 Samuel 5-8
03/03 - 1 Samuel 9-12
04/03 - 1 Samuel 13-16
05/03 - 1 Samuel 17-20
06/03 - 1 Samuel 21-24
07/03 - 1 Samuel 25-28
08/03 - 1 Samuel 29 até 2 Samuel 1
09/03 - 2 Samuel 2-5
10/03 - 2 Samuel 6-9
11/03 - 2 Samuel 10-13
12/03 - 2 Samuel 14-17
13/03 - 2 Samuel 18-21
14/03 - 2 Samuel 22 até 1 Reis 1
15/03 - 1 Reis 2-5
16/03 - 1 Reis 6-9
17/03 - 1 Reis 10-13
18/03 - 1 Reis 14-17
19/03 - 1 Reis 18-21
20/03 - 1 Reis 22 até 2 Reis 3
21/03 - 2 Reis 4-7
22/03 - 2 Reis 8-11
23/03 - 2 Reis 12-15
24/03 - 2 Reis 16-19
25/03 - 2 Reis 20-23
26/03 - 2 Reis 24 até 1 Crônicas 2
27/03 - 1 Crônicas 3-6
28/03 - 1 Crônicas 7-10
29/03 - 1 Crônicas 11-14
30/03 - 1 Crônicas 15-18
31/03 - 1 Crônicas 19-22
01/04 - 1 Crônicas 23-26
02/04 - 1 Crônicas 27 até 2 Crônicas 1
03/04 - 2 Crônicas 2-5
04/04 - 2 Crônicas 6-9
05/04 - 2 Crônicas 10-12
06/04 - 2 Crônicas 13-15
07/04 - 2 Crônicas 16-18
08/04 - 2 Crônicas 19-21
09/04 - 2 Crônicas 22-24
10/04 - 2 Crônicas 25-27
11/04 - 2 Crônicas 28-30
12/04 - 2 Crônicas 31-33
13/04 - 2 Crônicas 34-36
14/04 - Esdras 1-3
15/04 - Esdras 4-6
16/04 - Esdras 7-9
17/04 - Esdras 10 até Neemias 2
18/04 - Neemias 3-5
19/04 - Neemias 6-8
20/04 - Neemias 9-11
21/04 - Neemias 12 até Ester 1
22/04 - Ester 2-4
23/04 - Ester 5-7
24/04 - Ester 8-10
25/04 - Jó 1-3
26/04 - Jó 4-6
27/04 - Jó 7-9
28/04 - Jó 10-12
29/04 - Jó 13-15
30/04 - Jó 16-18
01/05 - Jó 19-21
02/05 - Jó 22-24
03/05 - Jó 25-27
04/05 - Jó 28-30
05/05 - Jó 31-33
06/05 - Jó 34-36
07/05 - Jó 37-39
08/05 - Jó 40-42
09/05 - Salmos 1-3
10/05 - Salmos 4-6
11/05 - Salmos 7-9
12/05 - Salmos 10-12
13/05 - Salmos 13-15
14/05 - Salmos 16-18
15/05 - Salmos 19-21
16/05 - Salmos 22-24
17/05 - Salmos 25-27
18/05 - Salmos 28-30
19/05 - Salmos 31-33
20/05 - Salmos 34-36
21/05 - Salmos 37-39
22/05 - Salmos 40-42
23/05 - Salmos 43-45
24/05 - Salmos 46-48
25/05 - Salmos 49-51
26/05 - Salmos 52-54
27/05 - Salmos 55-57
28/05 - Salmos 58-60
29/05 - Salmos 61-63
30/05 - Salmos 64-66
31/05 - Salmos 67-69
01/06 - Salmos 70-72
02/06 - Salmos 73-75
03/06 - Salmos 76-78
04/06 - Salmos 79-81
05/06 - Salmos 82-84
06/06 - Salmos 85-87
07/06 - Salmos 88-90
08/06 - Salmos 91-93
09/06 - Salmos 94-96
10/06 - Salmos 97-99
11/06 - Salmos 100-102
12/06 - Salmos 103-105
13/06 - Salmos 106-108
14/06 - Salmos 109-111
15/06 - Salmos 112-114
16/06 - Salmos 115-117
17/06 - Salmos 118-120
18/06 - Salmos 121-123
19/06 - Salmos 124-126
20/06 - Salmos 127-129
21/06 - Salmos 130-132
22/06 - Salmos 133-135
23/06 - Salmos 136-138
24/06 - Salmos 139-141
25/06 - Salmos 142-144
26/06 - Salmos 145-147
27/06 - Salmos 148-150
28/06 - Provérbios 1-3
29/06 - Provérbios 4-6
30/06 - Provérbios 7-9
01/07 - Provérbios 10-12
02/07 - Provérbios 13-15
03/07 - Provérbios 16-18
04/07 - Provérbios 19-21
05/07 - Provérbios 22-24
06/07 - Provérbios 25-27
07/07 - Provérbios 28-30
08/07 - Provérbios 31 até Eclesiastes 2
09/07 - Eclesiastes 3-5
10/07 - Eclesiastes 6-8
11/07 - Eclesiastes 9-11
12/07 - Eclesiastes 12 até Cantares 2
13/07 - Cantares 3-5
14/07 - Cantares 6-8
15/07 - Isaías 1-3
16/07 - Isaías 4-6
17/07 - Isaías 7-9
18/07 - Isaías 10-12
19/07 - Isaías 13-15
20/07 - Isaías 16-18
21/07 - Isaías 19-21
22/07 - Isaías 22-24
23/07 - Isaías 25-27
24/07 - Isaías 28-30
25/07 - Isaías 31-33
26/07 - Isaías 34-36
27/07 - Isaías 37-39
28/07 - Isaías 40-42
29/07 - Isaías 43-45
30/07 - Isaías 46-48
31/07 - Isaías 49-51
01/08 - Isaías 52-54
02/08 - Isaías 55-57
03/08 - Isaías 58-60
04/08 - Isaías 61-63
05/08 - Isaías 64-66
06/08 - Jeremias 1-3
07/08 - Jeremias 4-6
08/08 - Jeremias 7-9
09/08 - Jeremias 10-12
10/08 - Jeremias 13-15
11/08 - Jeremias 16-18
12/08 - Jeremias 19-21
13/08 - Jeremias 22-24
14/08 - Jeremias 25-27
15/08 - Jeremias 28-30
16/08 - Jeremias 31-33
17/08 - Jeremias 34-36
18/08 - Jeremias 37-39
19/08 - Jeremias 40-42
20/08 - Jeremias 43-45
21/08 - Jeremias 46-48
22/08 - Jeremias 49-51
23/08 - Jeremias 52 até Lamentações 2
24/08 - Lamentações 3-5
25/08 - Ezequiel 1-3
26/08 - Ezequiel 4-6
27/08 - Ezequiel 7-9
28/08 - Ezequiel 10-12
29/08 - Ezequiel 13-15
30/08 - Ezequiel 16-18
31/08 - Ezequiel 19-21
01/09 - Ezequiel 22-24
02/09 - Ezequiel 25-27
03/09 - Ezequiel 28-30
04/09 - Ezequiel 31-33
05/09 - Ezequiel 34-36
06/09 - Ezequiel 37-39
07/09 - Ezequiel 40-42
08/09 - Ezequiel 43-45
09/09 - Ezequiel 46-48
10/09 - Daniel 1-3
11/09 - Daniel 4-6
12/09 - Daniel 7-9
13/09 - Daniel 10-12
14/09 - Oseias 1-3
15/09 - Oseias 4-6
16/09 - Oseias 7-9
17/09 - Oseias 10-12
18/09 - Oseias 13 até Joel 1
19/09 - Joel 2 até Amós 1
20/09 - Amós 2-4
21/09 - Amós 5-7
22/09 - Amós 8 até Obadias 1
23/09 - Jonas 1-3
24/09 - Jonas 4 até Miqueias 2
25/09 - Miqueias 3-5
26/09 - Miqueias 6 até Naum 1
27/09 - Naum 2 até Habacuque 1
28/09 - Habacuque 2 até Sofonias 1
29/09 - Sofonias 2 até Ageu 1
30/09 - Ageu 2 até Zacarias 2
01/10 - Zacarias 3-5
02/10 - Zacarias 6-8
03/10 - Zacarias 9-11
04/10 - Zacarias 12-14
05/10 - Malaquias 1-3
06/10 - Malaquias 4 até Mateus 2
07/10 - Mateus 3-5
08/10 - Mateus 6-8
09/10 - Mateus 9-11
10/10 - Mateus 12-14
11/10 - Mateus 15-17
12/10 - Mateus 18-20
13/10 - Mateus 21-23
14/10 - Mateus 24-26
15/10 - Mateus 27 até Marcos 1
16/10 - Marcos 2-4
17/10 - Marcos 5-7
18/10 - Marcos 8-10
19/10 - Marcos 11-13
20/10 - Marcos 14-16
21/10 - Lucas 1-3
22/10 - Lucas 4-6
23/10 - Lucas 7-9
24/10 - Lucas 10-12
25/10 - Lucas 13-15
26/10 - Lucas 16-18
27/10 - Lucas 19-21
28/10 - Lucas 22-24
29/10 - João 1-3
30/10 - João 4-6
31/10 - João 7-9
01/11 - João 10-12
02/11 - João 13-15
03/11 - João 16-18
04/11 - João 19-21
05/11 - Atos 1-3
06/11 - Atos 4-6
07/11 - Atos 7-9
08/11 - Atos 10-12
09/11 - Atos 13-15
10/11 - Atos 16-18
11/11 - Atos 19-21
12/11 - Atos 22-24
13/11 - Atos 25-27
14/11 - Atos 28 até Romanos 2
15/11 - Romanos 3-5
16/11 - Romanos 6-8
17/11 - Romanos 9-11
18/11 - Romanos 12-14
19/11 - Romanos 15 até 1 Coríntios 1
20/11 - 1 Coríntios 2-4
21/11 - 1 Coríntios 5-7
22/11 - 1 Coríntios 8-10
23/11 - 1 Coríntios 11-13
24/11 - 1 Coríntios 14-16
25/11 - 2 Coríntios 1-3
26/11 - 2 Coríntios 4-6
27/11 - 2 Coríntios 7-9
28/11 - 2 Coríntios 10-12
29/11 - 2 Coríntios 13 até Gálatas 2
30/11 - Gálatas 3-5
01/12 - Gálatas 6 até Efésios 2
02/12 - Efésios 3-5
03/12 - Efésios 6 até Filipenses 2
04/12 - Filipenses 3 até Colossenses 1
05/12 - Colossenses 2-4
06/12 - 1 Tessalonicenses 1-3
07/12 - 1 Tessalonicenses 4 até 2 Tessalonicenses 1
08/12 - 2 Tessalonicenses 2 até 1 Timóteo 1
09/12 - 1 Timóteo 2-4
10/12 - 1 Timóteo 5 até 2 Timóteo 1
11/12 - 2 Timóteo 2-4
12/12 - Tito 1-3
13/12 - Filemom 1 até Hebreus 2
14/12 - Hebreus 3-5
15/12 - Hebreus 6-8
16/12 - Hebreus 9-11
17/12 - Hebreus 12 até Tiago 1
18/12 - Tiago 2-4
19/12 - Tiago 5 até 1 Pedro 2
20/12 - 1 Pedro 3-5
21/12 - 2 Pedro 1-3
22/12 - 1 João 1-3
23/12 - 1 João 4 até 2 João 1
24/12 - 3 João 1 até Apocalipse 1
25/12 - Apocalipse 2-4
26/12 - Apocalipse 5-7
27/12 - Apocalipse 8-10
28/12 - Apocalipse 11-13
29/12 - Apocalipse 14-16
30/12 - Apocalipse 17-19
31/12 - Apocalipse 20-22`;

// ─── Parser ───────────────────────────────────────────────────────────────────
function parseBookAndChapters(desc: string): Plan365Chapter[] {
    const chapters: Plan365Chapter[] = [];

    if (desc.includes(" até ")) {
        const sepIdx = desc.indexOf(" até ");
        const leftPart = desc.slice(0, sepIdx).trim();
        const rightPart = desc.slice(sepIdx + 5).trim();

        const leftTokens = leftPart.split(" ");
        const leftChStart = parseInt(leftTokens[leftTokens.length - 1]);
        const leftBookName = leftTokens.slice(0, -1).join(" ");

        const rightTokens = rightPart.split(" ");
        const rightChEnd = parseInt(rightTokens[rightTokens.length - 1]);
        const rightBookName = rightTokens.slice(0, -1).join(" ");

        const leftId = BOOK_NAME_MAP[leftBookName];
        const rightId = BOOK_NAME_MAP[rightBookName];
        if (!leftId || !rightId) return chapters;

        const leftTotal = BOOK_CHAPTERS[leftId] ?? leftChStart;
        for (let ch = leftChStart; ch <= leftTotal; ch++) {
            chapters.push({ bookId: leftId, bookName: BOOK_DISPLAY_NAMES[leftId], chapter: ch });
        }
        for (let ch = 1; ch <= rightChEnd; ch++) {
            chapters.push({ bookId: rightId, bookName: BOOK_DISPLAY_NAMES[rightId], chapter: ch });
        }
    } else {
        const tokens = desc.split(" ");
        const rangeToken = tokens[tokens.length - 1];
        const bookName = tokens.slice(0, -1).join(" ");
        const bookId = BOOK_NAME_MAP[bookName];
        if (!bookId) return chapters;

        if (rangeToken.includes("-")) {
            const [from, to] = rangeToken.split("-").map(Number);
            for (let ch = from; ch <= to; ch++) {
                chapters.push({ bookId, bookName: BOOK_DISPLAY_NAMES[bookId], chapter: ch });
            }
        } else {
            chapters.push({ bookId, bookName: BOOK_DISPLAY_NAMES[bookId], chapter: parseInt(rangeToken) });
        }
    }

    return chapters;
}

function parsePlan(): Plan365Day[] {
    const days: Plan365Day[] = [];
    let dayIndex = 0;
    for (const line of RAW_PLAN.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const match = trimmed.match(/^(\d{2}\/\d{2}) - (.+)$/);
        if (!match) continue;
        const dateMMDD = match[1];
        const chapters = parseBookAndChapters(match[2]);
        if (chapters.length > 0) {
            days.push({ dayIndex, dateMMDD, chapters });
            dayIndex++;
        }
    }
    return days;
}

export const PLAN_365: Plan365Day[] = parsePlan();

// ─── Config helpers (localStorage) ───────────────────────────────────────────
const CONFIG_KEY = "biblequest_plan365_config";

export function getPlan365Config(): Plan365Config | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(CONFIG_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setPlan365Config(config: Plan365Config): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearPlan365Config(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CONFIG_KEY);
}

// ─── Day resolution ───────────────────────────────────────────────────────────

/** Returns today as "DD/MM" in local timezone */
function todayDDMM(): string {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
}

/** Returns YYYY-MM-DD in local timezone */
export function todayISO(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/**
 * Returns the plan day that should be read today, given the user's config.
 * - calendar mode: matches today's DD/MM in the plan
 * - offset mode: counts days since startDate, wraps at 365
 */
export function getTodayPlanDay(config: Plan365Config): Plan365Day | null {
    if (config.mode === "calendar") {
        const mmdd = todayDDMM();
        return PLAN_365.find(d => d.dateMMDD === mmdd) ?? null;
    }

    // offset mode
    const start = new Date(config.startDate + "T00:00:00");
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((now.getTime() - start.getTime()) / 86400000);
    if (diffDays < 0) return PLAN_365[0];
    const idx = diffDays % 365;
    return PLAN_365[idx] ?? null;
}

/**
 * Returns all plan days that are "late" (past today, not yet completed).
 * For offset mode, looks at the last 30 days of pending days.
 */
export function getLatePlanDays(config: Plan365Config, completedKeys: Set<string>): Plan365Day[] {
    const today = getTodayPlanDay(config);
    if (!today) return [];

    if (config.mode === "calendar") {
        // Find all days before today that have unread chapters
        const mmdd = todayDDMM();
        const todayIdx = PLAN_365.findIndex(d => d.dateMMDD === mmdd);
        const late: Plan365Day[] = [];
        // Check last 30 days only to avoid huge lists
        const start = Math.max(0, todayIdx - 30);
        for (let i = start; i < todayIdx; i++) {
            const day = PLAN_365[i];
            if (day.chapters.some(ch => !completedKeys.has(`${ch.bookId}_${ch.chapter}`))) {
                late.push(day);
            }
        }
        return late;
    }

    // offset mode: check last 30 days
    const startDate = new Date(config.startDate + "T00:00:00");
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayDiff = Math.floor((now.getTime() - startDate.getTime()) / 86400000);
    const late: Plan365Day[] = [];
    const from = Math.max(0, todayDiff - 30);
    for (let i = from; i < todayDiff; i++) {
        const day = PLAN_365[i % 365];
        if (day?.chapters.some(ch => !completedKeys.has(`${ch.bookId}_${ch.chapter}`))) {
            late.push(day);
        }
    }
    return late;
}

/** Overall progress: how many of the 365 days are fully complete */
export function getPlan365Progress(completedKeys: Set<string>): { done: number; total: number; percent: number } {
    let done = 0;
    for (const day of PLAN_365) {
        if (day.chapters.every(ch => completedKeys.has(`${ch.bookId}_${ch.chapter}`))) {
            done++;
        }
    }
    return { done, total: 365, percent: Math.round((done / 365) * 100) };
}

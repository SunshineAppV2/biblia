/**
 * Levelling System for BibleQuest
 *
 * Formula: Level = floor(cbrt(XP × 2)) + 1   (cúbica)
 * XP for level N = floor((N - 1)³ / 2)
 *
 * Por que cúbica?
 *   - Níveis baixos são alcançados rapidamente (incentiva o início)
 *   - Cada nível alto exige esforço exponencialmente maior
 *   - Só leitura (59.450 XP) ≈ Nível 50 — os últimos 16 níveis exigem quizzes
 *   - Nível 66 exige 137.312 XP — apenas quem domina leitura + quiz o alcança
 *
 * Tabela de referência:
 *  Nv.  1 →       0 XP  (0 caps)
 *  Nv.  5 →      32 XP  (~1 cap)
 *  Nv. 10 →     364 XP  (~7 caps)
 *  Nv. 15 →   1.372 XP  (~27 caps)
 *  Nv. 20 →   3.429 XP  (~69 caps)
 *  Nv. 25 →   6.912 XP  (~138 caps)
 *  Nv. 30 →  12.194 XP  (~244 caps)
 *  Nv. 35 →  19.652 XP  (~393 caps)
 *  Nv. 40 →  29.659 XP  (~593 caps)
 *  Nv. 45 →  42.592 XP  (~852 caps)
 *  Nv. 50 →  58.824 XP  (~1.177 caps) ← Bíblia quase completa (só leitura)!
 *  Nv. 55 →  78.732 XP  (exige quizzes)
 *  Nv. 60 → 102.689 XP  (exige muitos quizzes perfeitos)
 *  Nv. 65 → 131.072 XP  (quase impossível)
 *  Nv. 66 → 137.312 XP  ← Guardião da Palavra (máximo absoluto)
 *
 * XP máximo disponível no jogo (todos os 1.189 caps + quizzes perfeitos):
 *   Leitura: 1.189 × 50 = 59.450 XP
 *   Quiz:    1.189 × 3 × 30 = 107.010 XP
 *   TOTAL:   166.460 XP → suficiente para nível 66 com dedicação total
 */

export interface LevelInfo {
    currentLevel: number;
    xpInCurrentLevel: number;
    xpRequiredForNextLevel: number;
    progressPercentage: number;
    title: string;
}

export interface LevelTier {
    minLevel: number;
    maxLevel: number;
    title: string;
    color: string;
}

export const LEVEL_TIERS: LevelTier[] = [
    { minLevel: 1,  maxLevel: 5,  title: "Iniciante",            color: "#94a3b8" },
    { minLevel: 6,  maxLevel: 10, title: "Curioso",              color: "#60a5fa" },
    { minLevel: 11, maxLevel: 15, title: "Aprendiz",             color: "#34d399" },
    { minLevel: 16, maxLevel: 20, title: "Discípulo",            color: "#a78bfa" },
    { minLevel: 21, maxLevel: 25, title: "Servo",                color: "#f59e0b" },
    { minLevel: 26, maxLevel: 30, title: "Levita",               color: "#fb923c" },
    { minLevel: 31, maxLevel: 35, title: "Guardião",             color: "#f472b6" },
    { minLevel: 36, maxLevel: 40, title: "Profeta",              color: "#c084fc" },
    { minLevel: 41, maxLevel: 45, title: "Sábio",                color: "#38bdf8" },
    { minLevel: 46, maxLevel: 50, title: "Ancião",               color: "#4ade80" },
    { minLevel: 51, maxLevel: 55, title: "Mestre",               color: "#facc15" },
    { minLevel: 56, maxLevel: 60, title: "Apóstolo",             color: "#f87171" },
    { minLevel: 61, maxLevel: 65, title: "Patriarca",            color: "#e879f9" },
    { minLevel: 66, maxLevel: 66, title: "Guardião da Palavra",  color: "#fbbf24" },
];

export function getLevelTitle(level: number): string {
    const tier = LEVEL_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel);
    return tier?.title ?? "Lendário";
}

export function getLevelColor(level: number): string {
    const tier = LEVEL_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel);
    return tier?.color ?? "#fbbf24";
}

/** XP mínimo para estar no nível N (fórmula cúbica). */
export function getXpForLevel(level: number): number {
    return Math.floor(Math.pow(level - 1, 3) / 2);
}

/** Nível atual com base no XP (inverso cúbico com correção de ponto flutuante). */
export function calculateLevel(xp: number): number {
    if (xp <= 0) return 1;
    let level = Math.floor(Math.cbrt(xp * 2)) + 1;
    // Corrige deriva de ponto flutuante nas bordas
    while (level < 66 && getXpForLevel(level + 1) <= xp) level++;
    while (level > 1 && getXpForLevel(level) > xp) level--;
    return Math.min(level, 66);
}

export function getLevelInfo(xp: number): LevelInfo {
    const currentLevel = calculateLevel(xp);
    const xpForCurrentLevel = getXpForLevel(currentLevel);
    const xpForNextLevel = currentLevel >= 66
        ? getXpForLevel(66) + 1 // barra cheia no nível máximo
        : getXpForLevel(currentLevel + 1);

    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercentage = (xpInCurrentLevel / xpRequiredForNextLevel) * 100;

    return {
        currentLevel,
        xpInCurrentLevel,
        xpRequiredForNextLevel,
        progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
        title: getLevelTitle(currentLevel),
    };
}

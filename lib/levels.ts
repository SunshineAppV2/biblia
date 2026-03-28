/**
 * Levelling System for AnoBíblico+
 *
 * Formula: XP(n) = 30 × (n − 1)²    →  Level(xp) = floor(√(xp / 30)) + 1
 *
 * Por que quadrática?
 *   - Os primeiros níveis exigem esforço real (≠ cúbica que era rápida demais)
 *   - 2 capítulos + 2 quizzes perfeitos ≈ 280 XP → Nível 4  (antes chegava a 9!)
 *   - Nível 10 ≈ 49 capítulos lidos (razoável)
 *   - Nível 66 ≈ 126.750 XP — alcançável com leitura completa + quizzes
 *
 * Tabela de referência:
 *  Nv.  1 →         0 XP   (0 caps)
 *  Nv.  5 →       480 XP   (~10 caps)
 *  Nv. 10 →     2.430 XP   (~49 caps)
 *  Nv. 15 →     5.880 XP   (~118 caps)
 *  Nv. 20 →    10.830 XP   (~217 caps)
 *  Nv. 25 →    17.280 XP   (~346 caps)
 *  Nv. 30 →    25.230 XP   (~505 caps)
 *  Nv. 40 →    45.630 XP   (~913 caps)
 *  Nv. 50 →    72.030 XP   (exige quizzes)
 *  Nv. 60 →   104.430 XP   (muitos quizzes perfeitos)
 *  Nv. 66 →   126.750 XP   ← Guardião da Palavra (máximo absoluto)
 *
 * XP máximo disponível:
 *   Leitura: 1.189 × 50  =  59.450 XP
 *   Quiz:    1.189 × 90  = 107.010 XP
 *   TOTAL:  166.460 XP → suficiente para nível 66 com dedicação total
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
    { minLevel: 1,  maxLevel: 5,  title: "Iniciante",           color: "#94a3b8" },
    { minLevel: 6,  maxLevel: 10, title: "Curioso",             color: "#60a5fa" },
    { minLevel: 11, maxLevel: 15, title: "Aprendiz",            color: "#34d399" },
    { minLevel: 16, maxLevel: 20, title: "Discípulo",           color: "#a78bfa" },
    { minLevel: 21, maxLevel: 25, title: "Servo",               color: "#f59e0b" },
    { minLevel: 26, maxLevel: 30, title: "Levita",              color: "#fb923c" },
    { minLevel: 31, maxLevel: 35, title: "Guardião",            color: "#f472b6" },
    { minLevel: 36, maxLevel: 40, title: "Profeta",             color: "#c084fc" },
    { minLevel: 41, maxLevel: 45, title: "Sábio",               color: "#38bdf8" },
    { minLevel: 46, maxLevel: 50, title: "Ancião",              color: "#4ade80" },
    { minLevel: 51, maxLevel: 55, title: "Mestre",              color: "#facc15" },
    { minLevel: 56, maxLevel: 60, title: "Apóstolo",            color: "#f87171" },
    { minLevel: 61, maxLevel: 65, title: "Patriarca",           color: "#e879f9" },
    { minLevel: 66, maxLevel: 66, title: "Guardião da Palavra", color: "#fbbf24" },
];

export function getLevelTitle(level: number): string {
    const tier = LEVEL_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel);
    return tier?.title ?? "Lendário";
}

export function getLevelColor(level: number): string {
    const tier = LEVEL_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel);
    return tier?.color ?? "#fbbf24";
}

/** XP mínimo para estar no nível N — fórmula quadrática. */
export function getXpForLevel(level: number): number {
    return 30 * Math.pow(level - 1, 2);
}

/** Nível atual com base no XP (inverso quadrático). */
export function calculateLevel(xp: number): number {
    if (xp <= 0) return 1;
    const level = Math.floor(Math.sqrt(xp / 30)) + 1;
    return Math.min(level, 66);
}

export function getLevelInfo(xp: number): LevelInfo {
    const currentLevel = calculateLevel(xp);
    const xpForCurrentLevel = getXpForLevel(currentLevel);
    const xpForNextLevel = currentLevel >= 66
        ? getXpForLevel(66) + 1
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

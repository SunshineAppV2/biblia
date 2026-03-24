import { db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpBonus: number;
    category: "leitura" | "streak" | "nivel" | "liga" | "sabedoria";
}

export const ACHIEVEMENTS: Achievement[] = [
    // Leitura
    { id: "first_chapter", title: "Primeira Palavra", description: "Completou seu primeiro capítulo", icon: "📖", xpBonus: 10, category: "leitura" },
    { id: "chapters_10", title: "Dez Capítulos", description: "Completou 10 capítulos", icon: "📚", xpBonus: 30, category: "leitura" },
    { id: "chapters_50", title: "Cinquenta Capítulos", description: "Completou 50 capítulos", icon: "🌟", xpBonus: 100, category: "leitura" },
    { id: "chapters_100", title: "Centenário", description: "Completou 100 capítulos", icon: "💫", xpBonus: 200, category: "leitura" },
    { id: "chapters_500", title: "Meio Milhar", description: "Completou 500 capítulos", icon: "🔥", xpBonus: 500, category: "leitura" },
    { id: "bible_complete", title: "Bíblia Completa", description: "Completou toda a Bíblia!", icon: "👑", xpBonus: 5000, category: "leitura" },
    // Streak
    { id: "streak_3", title: "3 em Sequência", description: "3 dias consecutivos de leitura", icon: "🔥", xpBonus: 20, category: "streak" },
    { id: "streak_7", title: "Semana Fiel", description: "7 dias consecutivos de leitura", icon: "💪", xpBonus: 50, category: "streak" },
    { id: "streak_30", title: "Mês Dedicado", description: "30 dias consecutivos de leitura", icon: "🏆", xpBonus: 200, category: "streak" },
    { id: "streak_100", title: "Inabalável", description: "100 dias consecutivos de leitura", icon: "💎", xpBonus: 500, category: "streak" },
    // Nível
    { id: "level_5", title: "Aprendiz", description: "Atingiu o Nível 5", icon: "⭐", xpBonus: 30, category: "nivel" },
    { id: "level_10", title: "Estudioso", description: "Atingiu o Nível 10", icon: "🌟", xpBonus: 100, category: "nivel" },
    { id: "level_20", title: "Sábio", description: "Atingiu o Nível 20", icon: "🔮", xpBonus: 250, category: "nivel" },
    // Nível (extras)
    { id: "level_66", title: "Guardião da Palavra", description: "Atingiu o nível máximo — 66 livros dominados", icon: "🛡️", xpBonus: 1000, category: "nivel" },
    // Liga
    { id: "league_prata", title: "Prata Polida", description: "Promovido para a Liga Prata", icon: "🥈", xpBonus: 50, category: "liga" },
    { id: "league_ouro", title: "Toque de Ouro", description: "Promovido para a Liga Ouro", icon: "🥇", xpBonus: 100, category: "liga" },
    { id: "league_diamante", title: "Diamante", description: "Chegou à Liga Diamante!", icon: "💎", xpBonus: 500, category: "liga" },
    // Sabedoria (pós nível 66)
    { id: "wisdom_10", title: "Contemplativo", description: "Conquistou 10 Pontos de Sabedoria após o nível máximo", icon: "🕊️", xpBonus: 200, category: "sabedoria" },
    { id: "wisdom_100", title: "Mestre Contemplativo", description: "Conquistou 100 Pontos de Sabedoria", icon: "✨", xpBonus: 1000, category: "sabedoria" },
    { id: "bible_complete_2x", title: "Segunda Aliança", description: "Leu toda a Bíblia pela segunda vez (2.378 capítulos)", icon: "📜", xpBonus: 5000, category: "sabedoria" },
    { id: "streak_365", title: "Um Ano Fiel", description: "365 dias consecutivos de leitura", icon: "🌟", xpBonus: 2000, category: "streak" },
];

const LEAGUES_ABOVE_PRATA = ["PRATA", "OURO", "SAFIRA", "RUBI", "ESMERALDA", "AMETISTA", "PEROLA", "OBSIDIANA", "DIAMANTE"];
const LEAGUES_ABOVE_OURO = ["OURO", "SAFIRA", "RUBI", "ESMERALDA", "AMETISTA", "PEROLA", "OBSIDIANA", "DIAMANTE"];

export interface AchievementStats {
    totalChapters: number;
    streak: number;
    level: number;
    currentLeague: string;
    wisdomPoints?: number;
}

export async function checkAndUnlockAchievements(
    userId: string,
    stats: AchievementStats
): Promise<Achievement[]> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const unlockedIds: string[] = userSnap.data()?.achievements || [];

        const newlyUnlocked: Achievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
            if (unlockedIds.includes(achievement.id)) continue;

            let shouldUnlock = false;
            switch (achievement.id) {
                case "first_chapter": shouldUnlock = stats.totalChapters >= 1; break;
                case "chapters_10": shouldUnlock = stats.totalChapters >= 10; break;
                case "chapters_50": shouldUnlock = stats.totalChapters >= 50; break;
                case "chapters_100": shouldUnlock = stats.totalChapters >= 100; break;
                case "chapters_500": shouldUnlock = stats.totalChapters >= 500; break;
                case "bible_complete": shouldUnlock = stats.totalChapters >= 1189; break;
                case "streak_3": shouldUnlock = stats.streak >= 3; break;
                case "streak_7": shouldUnlock = stats.streak >= 7; break;
                case "streak_30": shouldUnlock = stats.streak >= 30; break;
                case "streak_100": shouldUnlock = stats.streak >= 100; break;
                case "level_5": shouldUnlock = stats.level >= 5; break;
                case "level_10": shouldUnlock = stats.level >= 10; break;
                case "level_20": shouldUnlock = stats.level >= 20; break;
                case "level_66": shouldUnlock = stats.level >= 66; break;
                case "league_prata": shouldUnlock = LEAGUES_ABOVE_PRATA.includes(stats.currentLeague); break;
                case "league_ouro": shouldUnlock = LEAGUES_ABOVE_OURO.includes(stats.currentLeague); break;
                case "league_diamante": shouldUnlock = stats.currentLeague === "DIAMANTE"; break;
                case "wisdom_10": shouldUnlock = (stats.wisdomPoints || 0) >= 10; break;
                case "wisdom_100": shouldUnlock = (stats.wisdomPoints || 0) >= 100; break;
                case "bible_complete_2x": shouldUnlock = stats.totalChapters >= 2378; break;
                case "streak_365": shouldUnlock = stats.streak >= 365; break;
            }

            if (shouldUnlock) newlyUnlocked.push(achievement);
        }

        if (newlyUnlocked.length > 0) {
            const totalBonus = newlyUnlocked.reduce((sum, a) => sum + a.xpBonus, 0);
            await updateDoc(userRef, {
                achievements: arrayUnion(...newlyUnlocked.map(a => a.id)),
                xp: increment(totalBonus),
                weeklyXp: increment(totalBonus),
            });
        }

        return newlyUnlocked;
    } catch (error) {
        console.error("Error checking achievements:", error);
        return [];
    }
}

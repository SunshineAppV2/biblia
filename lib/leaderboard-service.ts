import { db } from "./firebase";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { UserProfile } from "./firestore";

export interface LeaderboardEntry {
    uid: string;
    displayName: string;
    photoURL: string | null;
    value: number;
    xp?: number;
    level?: number;
    totalChapters?: number;
}

/** Rankings por Nível (Global ou por Liga) - Esconde Admins */
export async function getGlobalLevelRanking(league?: string, lastWeek: boolean = false): Promise<LeaderboardEntry[]> {
    const field = lastWeek ? "lastWeekXp" : "weeklyXp";
    let q;
    
    const baseQuery = [
        where("isAdmin", "!=", true),
        orderBy("isAdmin"), // Firestore requirement for != operator
        orderBy(field, "desc"),
        limit(50)
    ];

    if (league) {
        q = query(
            collection(db, "users"),
            where("currentLeague", "==", league),
            ...baseQuery
        );
    } else {
        q = query(
            collection(db, "users"),
            ...baseQuery
        );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data() as UserProfile;
        return {
            uid: data.uid,
            displayName: data.displayName || "Leitor Anônimo",
            photoURL: data.photoURL,
            value: (data as any)[field] || 0,
            xp: data.xp || 0,
            totalChapters: data.totalChapters || 0,
        };
    });
}

/** Rankings da Jornada do Saber (Semanal ou da Semana Passada, filtrado por liga) - Esconde Admins */
export async function getWeeklyEncounterRanking(league?: string, lastWeek: boolean = false): Promise<LeaderboardEntry[]> {
    const field = lastWeek ? "lastWeekEncounterWins" : "weeklyEncounterWins";
    let q;

    const baseQuery = [
        where("isAdmin", "!=", true),
        orderBy("isAdmin"),
        orderBy(field, "desc"),
        limit(50)
    ];

    if (league) {
        q = query(
            collection(db, "users"),
            where("currentLeague", "==", league),
            ...baseQuery
        );
    } else {
        q = query(
            collection(db, "users"),
            ...baseQuery
        );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data() as UserProfile;
        return {
            uid: data.uid,
            displayName: data.displayName || "Leitor Anônimo",
            photoURL: data.photoURL,
            value: (data as any)[field] || 0,
            totalChapters: data.totalChapters || 0,
        };
    });
}

import { db } from "./firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { UserProfile } from "./firestore";

export interface LeaderboardEntry {
    uid: string;
    displayName: string;
    photoURL: string | null;
    value: number;
    level?: number;
}

/** Rankings por Nível (Global) */
export async function getGlobalLevelRanking(): Promise<LeaderboardEntry[]> {
    const q = query(
        collection(db, "users"),
        orderBy("xp", "desc"),
        limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data() as UserProfile;
        return {
            uid: data.uid,
            displayName: data.displayName || "Leitor Anônimo",
            photoURL: data.photoURL,
            value: data.xp,
        };
    });
}

/** Rankings da Jornada do Saber (Semanal) */
export async function getWeeklyEncounterRanking(): Promise<LeaderboardEntry[]> {
    const q = query(
        collection(db, "users"),
        orderBy("weeklyEncounterWins", "desc"),
        limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data() as UserProfile;
        return {
            uid: data.uid,
            displayName: data.displayName || "Leitor Anônimo",
            photoURL: data.photoURL,
            value: data.weeklyEncounterWins || 0,
        };
    });
}

import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, Timestamp } from "firebase/firestore";
import { calculateLevel } from "./levels";
import { UserProfile } from "./firestore"; // Importa a interface UserProfile

function toDate(ts: unknown): Date | null {
    if (!ts) return null;
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts && typeof ts === 'object' && 'toDate' in ts && typeof (ts as any).toDate === 'function') return (ts as any).toDate();
    if (ts instanceof Date) return ts;
    return null;
}

function isYesterday(date: Date): boolean {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
}

function isToday(date: Date): boolean {
    const now = new Date();
    return date.toDateString() === now.toDateString();
}

const MAX_LEVEL = 66;

/**
 * Marks a chapter as completed and awards XP.
 * Returns true if XP was awarded, false if already completed.
 * Post-level-66: also awards a Wisdom Point (Ponto de Sabedoria).
 */
export async function completeChapter(
    userId: string,
    bookId: string,
    chapterId: string,
    xpAmount: number
): Promise<boolean> {
    const progressId = `${bookId}_${chapterId}`;
    const progressRef = doc(db, "users", userId, "reading_progress", progressId);

    try {
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) return false; // Already completed

        await setDoc(progressRef, {
            bookId,
            chapterId,
            completedAt: serverTimestamp(),
            xpAwarded: xpAmount,
        });

        // Read user for streak calculation
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        let newStreak = 1;

        let isPostMaxLevel = false;

        if (userSnap.exists()) {
            const data = userSnap.data();
            const lastActive = toDate(data.lastActive);
            const currentStreak: number = data.streak || 0;
            const currentLevel = calculateLevel(data.xp || 0);
            isPostMaxLevel = currentLevel >= MAX_LEVEL;

            if (lastActive && isToday(lastActive)) {
                newStreak = currentStreak; // Already read today
            } else if (lastActive && isYesterday(lastActive)) {
                newStreak = currentStreak + 1; // Consecutive day
            } else {
                newStreak = 1; // Gap in reading, reset
            }
        }

        const updatePayload: Record<string, unknown> = {
            xp: increment(xpAmount),
            weeklyXp: increment(xpAmount),
            lastActive: serverTimestamp(),
            streak: newStreak,
            totalChapters: increment(1),
        };

        // Post-max-level: award a Wisdom Point in addition to XP
        if (isPostMaxLevel) {
            updatePayload.wisdomPoints = increment(1);
        }

        await updateDoc(userRef, updatePayload);

        return true;
    } catch (error: unknown) {
        const code = (error as { code?: string })?.code;
        if (code === "unavailable" || code === "failed-precondition") {
            console.warn("Firebase offline — chapter progress not saved.");
            return false;
        }
        console.error("Error completing chapter:", error);
        throw error;
    }
}

export async function isChapterCompleted(
    userId: string,
    bookId: string,
    chapterId: string
): Promise<boolean> {
    try {
        const progressId = `${bookId}_${chapterId}`;
        const progressRef = doc(db, "users", userId, "reading_progress", progressId);
        const snap = await getDoc(progressRef);
        return snap.exists();
    } catch {
        return false; // Assume not completed when offline
    }
}

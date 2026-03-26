import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, Timestamp } from "firebase/firestore";
import { calculateLevel } from "./levels";
import { getLocalDateString } from "./utils";

function toDate(ts: unknown): Date | null {
    if (!ts) return null;
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts && typeof ts === 'object' && 'toDate' in ts && typeof (ts as any).toDate === 'function') return (ts as any).toDate();
    if (ts instanceof Date) return ts;
    return null;
}

function isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getLocalDateString(date) === getLocalDateString(yesterday);
}

function isToday(date: Date): boolean {
    return getLocalDateString(date) === getLocalDateString(new Date());
}

function getDaysDifference(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const diff = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
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
        const todayStr = getLocalDateString();

        const updatePayload: Record<string, unknown> = {
            xp: increment(xpAmount),
            weeklyXp: increment(xpAmount),
            lastActive: serverTimestamp(),
            totalChapters: increment(1),
            gems: increment(10), // Ganha 10 gemas por capítulo
        };

        if (userSnap.exists()) {
            const data = userSnap.data();
            const lastActive = toDate(data.lastActive);
            const currentStreak = data.streak || 0;
            const streakFreezes = data.streakFreezes || 0;
            const currentLevel = calculateLevel(data.xp || 0);
            isPostMaxLevel = currentLevel >= MAX_LEVEL;
            
            // Sync readDates in Firestore
            const existingDates = data.readDates || [];
            if (!existingDates.includes(todayStr)) {
                updatePayload.readDates = [...existingDates, todayStr].slice(-30);
            }

            if (lastActive && isToday(lastActive)) {
                newStreak = currentStreak; 
            } else if (lastActive && isYesterday(lastActive)) {
                newStreak = currentStreak + 1;
            } else if (lastActive) {
                // Gap in reading days
                const daysMissed = getDaysDifference(lastActive, new Date()) - 1;
                if (daysMissed > 0 && streakFreezes >= daysMissed) {
                    newStreak = currentStreak + 1; // Preserve and increment
                    updatePayload.streakFreezes = increment(-daysMissed);
                } else {
                    newStreak = 1; // Reset
                }
            } else {
                newStreak = 1; // First reading
            }
        } else {
            // First time ever
            updatePayload.readDates = [todayStr];
        }

        updatePayload.streak = newStreak;

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

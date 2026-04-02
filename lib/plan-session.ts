/**
 * plan-session.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Utility to compute the ordered list of chapters a user should read TODAY
 * across all their active reading plans, and to navigate between them.
 *
 * Supports:
 *   • Bíblia em 1 Ano (365) plan — multi-chapter per day
 *   • Regular plans (RPSP, NT3M, etc.) — up to a few chapters per day
 */

import { getPlan365Config, getTodayPlanDay, Plan365Chapter } from "./reading-plan-365";
import { getPlanSequence, getPlanChapter, READING_PLANS } from "./reading-plan";

export interface SessionChapter {
    bookId: string;
    bookName: string;
    chapter: number;
    /** Which plan this chapter belongs to */
    source: "plan365" | "regular";
}

/**
 * Returns the ordered list of chapters the user should read today.
 * 
 * For the 365 plan: all chapters listed for today's date.
 * For a regular plan: the chapter(s) for today's day number (usually 1 per day).
 *
 * @param activePlanId - The user's active regular plan ID (from Firestore profile)
 * @param planStartDate - The start date for personal (offset) plans
 */
export function getTodaySessionChapters(
    activePlanId?: string | null,
    planStartDate?: Date | null,
): SessionChapter[] {
    const chapters: SessionChapter[] = [];

    // ── 365 plan ──────────────────────────────────────────────────────────────
    const config365 = getPlan365Config();
    if (config365) {
        const day = getTodayPlanDay(config365);
        if (day) {
            for (const ch of day.chapters) {
                chapters.push({ ...ch, source: "plan365" });
            }
        }
    }

    // ── Regular plan ──────────────────────────────────────────────────────────
    if (activePlanId && activePlanId !== "bib1y") {
        const plan = READING_PLANS.find(p => p.id === activePlanId);
        if (plan) {
            const currentChapter = getPlanChapter(activePlanId, planStartDate ?? undefined);
            const sequence = getPlanSequence(activePlanId);

            // All chapters for the same day number as today's current chapter
            const dayChapters = sequence.filter(c => c.dayNumber === currentChapter.dayNumber);
            for (const ch of dayChapters) {
                // Avoid duplicates if 365 plan and regular plan happen to share a chapter
                const alreadyIn = chapters.some(
                    s => s.bookId === ch.bookId && s.chapter === ch.chapter
                );
                if (!alreadyIn) {
                    chapters.push({
                        bookId: ch.bookId,
                        bookName: ch.bookName,
                        chapter: ch.chapter,
                        source: "regular",
                    });
                }
            }
        }
    }

    return chapters;
}

/**
 * Given the current chapter being read and the full session chapter list,
 * returns the NEXT unread chapter in the session.
 *
 * @param current - The chapter just completed
 * @param session - Full ordered list for today
 * @param completedKeys - Set of "bookId_chapter" strings already completed
 * @returns Next chapter, or null if all session chapters are done
 */
export function getNextSessionChapter(
    current: { bookId: string; chapter: number },
    session: SessionChapter[],
    completedKeys: Set<string>,
): SessionChapter | null {
    const currentIdx = session.findIndex(
        c => c.bookId === current.bookId && c.chapter === current.chapter
    );

    // Search forward from current position
    const startFrom = currentIdx === -1 ? 0 : currentIdx + 1;
    for (let i = startFrom; i < session.length; i++) {
        const ch = session[i];
        if (!completedKeys.has(`${ch.bookId}_${ch.chapter}`)) {
            return ch;
        }
    }

    return null; // All done!
}

/**
 * Returns true when all chapters in the session have been completed.
 */
export function isSessionComplete(
    session: SessionChapter[],
    completedKeys: Set<string>,
): boolean {
    if (session.length === 0) return false;
    return session.every(ch => completedKeys.has(`${ch.bookId}_${ch.chapter}`));
}

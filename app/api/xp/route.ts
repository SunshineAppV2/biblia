import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { calculateLevel } from "@/lib/levels";
import { getLocalDateString } from "@/lib/utils";

const CHAPTER_XP = 50;
const QUIZ_XP_PER_CORRECT = 10;
const MAX_QUIZ_XP = 50;
const CHAPTER_GEMS = 10;
const MAX_LEVEL = 66;
const TOTAL_BIBLE_CHAPTERS = 1189;

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
        }

        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const body = await req.json();
        const { type, bookId, chapter, correctCount, bonus, missionId } = body;

        const userRef = adminDb.collection("users").doc(uid);
        const userSnap = await userRef.get();
        const userData = userSnap.data() || {};
        
        const todayStr = getLocalDateString();
        const lastXpDate = userData.lastXpDate || "";
        const dailyXp = (lastXpDate === todayStr) ? (userData.dailyXp || 0) : 0;
        const MAX_DAILY_XP = 5000;

        let xpDelta = 0;
        let gemsDelta = 0;
        let updateData: any = {
            lastActive: FieldValue.serverTimestamp(),
            lastXpDate: todayStr,
        };

        if (type === "CHAPTER") {
            const currentCycle = userData.cycle || 1;
            const progressId = `${bookId}_${chapter}_cycle${currentCycle}`;
            const progressRef = userRef.collection("reading_progress").doc(progressId);
            const progressSnap = await progressRef.get();

            if (progressSnap.exists) {
                return NextResponse.json({ success: true, alreadyRead: true });
            }

            xpDelta = CHAPTER_XP;
            gemsDelta = CHAPTER_GEMS;
            
            // Write progress
            await progressRef.set({
                bookId,
                chapter,
                completedAt: FieldValue.serverTimestamp(),
                xpAwarded: xpDelta,
                cycle: currentCycle
            });

            // Update user metadata
            updateData.totalChapters = FieldValue.increment(1);
            
            // Streak Logic
            const existingDates = userData.readDates || [];
            if (!existingDates.includes(todayStr)) {
                const newDates = [...existingDates, todayStr].slice(-30);
                updateData.readDates = newDates;
                updateData.streak = calculateStreakServer(newDates);
            }

            // Wisdom Points
            const currentLevel = calculateLevel(userData.xp || 0);
            if (currentLevel >= MAX_LEVEL) {
                updateData.wisdomPoints = FieldValue.increment(1);
            }

            // Cycle Logic
            const totalReadInCycle = (userData.totalReadInCycle || 0) + 1;
            updateData.totalReadInCycle = totalReadInCycle;
            if (totalReadInCycle >= TOTAL_BIBLE_CHAPTERS) {
                updateData.cycle = currentCycle + 1;
                updateData.totalReadInCycle = 0;
                updateData.cycleStartChapter = null;
                updateData.cycleStartDate = null;
            } else if (totalReadInCycle === 1) {
                updateData.cycleStartChapter = { bookId, chapter };
                updateData.cycleStartDate = FieldValue.serverTimestamp();
            }

        } else if (type === "QUIZ") {
            xpDelta = Math.min((correctCount || 0) * QUIZ_XP_PER_CORRECT, MAX_QUIZ_XP);
        } else if (type === "MISSION") {
            xpDelta = Math.min(bonus || 0, 500); 
        } else if (type === "ENCOUNTER_WIN") {
            xpDelta = 40;
            updateData.weeklyEncounterWins = FieldValue.increment(1);
        }

        if (dailyXp + xpDelta > MAX_DAILY_XP) {
            return NextResponse.json({ error: "Limite diário de XP atingido" }, { status: 429 });
        }

        if (xpDelta > 0) {
            updateData.xp = FieldValue.increment(xpDelta);
            updateData.weeklyXp = FieldValue.increment(xpDelta);
            updateData.dailyXp = (lastXpDate === todayStr) ? FieldValue.increment(xpDelta) : xpDelta;
        }

        if (gemsDelta > 0) {
            updateData.gems = FieldValue.increment(gemsDelta);
        }

        await userRef.update(updateData);

        // Group Sync
        if (userData.groupId && xpDelta > 0) {
            await adminDb.collection("groups").doc(userData.groupId).update({
                totalXpWeek: FieldValue.increment(xpDelta)
            });
        }

        // Audit Log
        await adminDb.collection("xp_audit").add({
            uid,
            type,
            bookId: bookId || null,
            chapter: chapter || null,
            xpDelta,
            gemsDelta,
            timestamp: FieldValue.serverTimestamp()
        });

        return NextResponse.json({ success: true, xpAdded: xpDelta, gemsAdded: gemsDelta });

    } catch (error: any) {
        console.error("XP API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function calculateStreakServer(readDates: string[]): number {
    if (!readDates || readDates.length === 0) return 0;
    let count = 0;
    const now = new Date();
    const checkDate = new Date();
    
    const todayStr = getLocalDateString(now);
    if (readDates.includes(todayStr)) {
        count++;
        while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (readDates.includes(getLocalDateString(checkDate))) count++;
            else break;
        }
    } else {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = getLocalDateString(checkDate);
        if (readDates.includes(yesterdayStr)) {
            count++;
            while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                if (readDates.includes(getLocalDateString(checkDate))) count++;
                else break;
            }
        }
    }
    return count;
}

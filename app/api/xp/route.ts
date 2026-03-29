import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const CHAPTER_XP = 50;
const QUIZ_XP_PER_CORRECT = 10;
const MAX_QUIZ_XP = 50;

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
        const { type, bookId, chapter, correctCount, results } = body;

        let xpDelta = 0;
        let auditData: any = { timestamp: new Date() };

        if (type === "CHAPTER") {
            // Anti-cheat: Check if recently read? (Optional)
            xpDelta = CHAPTER_XP;
            auditData.action = "CHAPTER_READ";
            auditData.bookId = bookId;
            auditData.chapter = chapter;
        } else if (type === "QUIZ") {
            // Anti-cheat: Validate correctCount against something?
            xpDelta = Math.min((correctCount || 0) * QUIZ_XP_PER_CORRECT, MAX_QUIZ_XP);
            auditData.action = "QUIZ_COMPLETED";
            auditData.correctCount = correctCount;
            auditData.bookId = bookId;
            auditData.chapter = chapter;
        } else if (type === "MISSION") {
            // Missions bonus
            xpDelta = body.bonus || 0;
            auditData.action = "MISSION_BONUS";
            auditData.missionId = body.missionId;
        } else if (type === "ENCOUNTER_WIN") {
            // Jornada do Saber win
            xpDelta = 40;
            auditData.action = "ENCOUNTER_WIN";
        }

        let updateData: any = {
            lastActive: FieldValue.serverTimestamp(),
        };

        if (xpDelta > 0) {
            updateData.xp = FieldValue.increment(xpDelta);
            updateData.weeklyXp = FieldValue.increment(xpDelta);
        }

        if (type === "ENCOUNTER_WIN") {
            updateData.weeklyEncounterWins = FieldValue.increment(1);
        }

        if (xpDelta > 0 || type === "ENCOUNTER_WIN") {
            const userRef = adminDb.collection("users").doc(uid);
            await userRef.update(updateData);

            // Log the action for later auditing if needed
            await adminDb.collection("xp_audit").add({
                uid,
                ...auditData,
                xpDelta,
            });
        }

        return NextResponse.json({ success: true, xpAdded: xpDelta });
    } catch (error: any) {
        console.error("XP API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

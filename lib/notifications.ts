import { getLocalDateString } from "./utils";

const NOTIFY_KEY = "biblequest_notify_enabled";
const LAST_NOTIFIED_KEY = "biblequest_last_notified";
const REMIND_HOUR = 19; // 7pm default reminder

// ── Weekly chapter tracking ──────────────────────────────────────────────────
function getISOWeek(): string {
    const d = new Date();
    const day = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - day);
    const year = d.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const weekNo = Math.ceil((((d.getTime() - startOfYear.getTime()) / 86400000) + 1) / 7);
    return `${year}-W${String(weekNo).padStart(2, "0")}`;
}

export function trackWeeklyChapter(): void {
    if (typeof window === "undefined") return;
    const key = `biblequest_weekly_chapters_${getISOWeek()}`;
    const current = parseInt(localStorage.getItem(key) ?? "0", 10);
    localStorage.setItem(key, String(current + 1));
}

export function getWeeklyChapters(): number {
    if (typeof window === "undefined") return 0;
    const key = `biblequest_weekly_chapters_${getISOWeek()}`;
    return parseInt(localStorage.getItem(key) ?? "0", 10);
}

export function getWeeklyGoal(): number {
    if (typeof window === "undefined") return 5;
    return parseInt(localStorage.getItem("biblequest_weekly_goal") ?? "5", 10);
}

export function setWeeklyGoal(goal: number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("biblequest_weekly_goal", String(goal));
}

export function isNotificationsEnabled(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(NOTIFY_KEY) === "true" && Notification.permission === "granted";
}

export async function requestNotificationPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    if (Notification.permission === "granted") {
        localStorage.setItem(NOTIFY_KEY, "true");
        return true;
    }
    const result = await Notification.requestPermission();
    if (result === "granted") {
        localStorage.setItem(NOTIFY_KEY, "true");
        return true;
    }
    return false;
}

export function disableNotifications(): void {
    localStorage.setItem(NOTIFY_KEY, "false");
}

export function markReadToday(): void {
    const today = getLocalDateString();
    // Save to read dates (for StreakWeek component)
    const stored = localStorage.getItem("biblequest_read_dates");
    const dates: string[] = stored ? JSON.parse(stored) : [];
    if (!dates.includes(today)) {
        dates.push(today);
        // Keep only last 30 days
        const recent = dates.slice(-30);
        localStorage.setItem("biblequest_read_dates", JSON.stringify(recent));
        // Track for weekly goal
        trackWeeklyChapter();
    }
}

export function checkStreakAtRisk(streak: number): void {
    if (!isNotificationsEnabled()) return;
    if (streak <= 0) return;

    const today = getLocalDateString();
    const stored = localStorage.getItem("biblequest_read_dates");
    const dates: string[] = stored ? JSON.parse(stored) : [];

    // Only if not read today
    if (dates.includes(today)) return;

    // Only after 7pm
    const hour = new Date().getHours();
    if (hour < 19) return;

    const riskKey = "biblequest_streak_risk_notified";
    if (localStorage.getItem(riskKey) === today) return;

    localStorage.setItem(riskKey, today);
    new Notification(`⚠️ Sua ofensiva de ${streak} dias está em risco!`, {
        body: "Você ainda não leu hoje. Leia agora para não perder sua ofensiva!",
        icon: "/icon-192",
        badge: "/icon-192",
        tag: "streak-risk",
    });
}

export function checkAndSendReminder(): void {
    if (!isNotificationsEnabled()) return;

    const today = getLocalDateString();
    const stored = localStorage.getItem("biblequest_read_dates");
    const dates: string[] = stored ? JSON.parse(stored) : [];
    const lastNotified = localStorage.getItem(LAST_NOTIFIED_KEY);

    // Don't notify if already read today
    if (dates.includes(today)) return;
    // Don't notify more than once per day
    if (lastNotified === today) return;

    // Only notify during reasonable hours (8am–10pm)
    const hour = new Date().getHours();
    if (hour < 8 || hour > 22) return;

    localStorage.setItem(LAST_NOTIFIED_KEY, today);
    new Notification("BibleQuest — Sua leitura de hoje te espera! 📖", {
        body: "Mantenha sua ofensiva! Alguns minutos de leitura bíblica podem transformar seu dia.",
        icon: "/icon-192",
        badge: "/icon-192",
        tag: "daily-reminder",
    });
}

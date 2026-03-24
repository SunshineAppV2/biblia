const NOTIFY_KEY = "biblequest_notify_enabled";
const LAST_NOTIFIED_KEY = "biblequest_last_notified";
const REMIND_HOUR = 19; // 7pm default reminder

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
    const today = new Date().toISOString().slice(0, 10);
    // Save to read dates (for StreakWeek component)
    const stored = localStorage.getItem("biblequest_read_dates");
    const dates: string[] = stored ? JSON.parse(stored) : [];
    if (!dates.includes(today)) {
        dates.push(today);
        // Keep only last 30 days
        const recent = dates.slice(-30);
        localStorage.setItem("biblequest_read_dates", JSON.stringify(recent));
    }
}

export function checkAndSendReminder(): void {
    if (!isNotificationsEnabled()) return;

    const today = new Date().toISOString().slice(0, 10);
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

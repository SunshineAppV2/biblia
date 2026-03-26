import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getLocalDateString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function calculateStreak(readDates: string[]): number {
    if (!readDates || readDates.length === 0) return 0;
    
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(today);
    
    const todayStr = getLocalDateString(checkDate);
    if (readDates.includes(todayStr)) {
        count++;
        while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (readDates.includes(getLocalDateString(checkDate))) {
                count++;
            } else {
                break;
            }
        }
    } else {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = getLocalDateString(checkDate);
        if (readDates.includes(yesterdayStr)) {
            count++;
            while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                if (readDates.includes(getLocalDateString(checkDate))) {
                    count++;
                } else {
                    break;
                }
            }
        }
    }
    return count;
}

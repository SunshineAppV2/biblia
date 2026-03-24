import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export interface AppConfig {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    quizEnabled: boolean;
    leaguesEnabled: boolean;
    welcomeMessage: string;
    welcomeMessageEnabled: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
    maintenanceMode: false,
    maintenanceMessage: "O sistema está em manutenção. Voltamos em breve!",
    quizEnabled: true,
    leaguesEnabled: true,
    welcomeMessage: "",
    welcomeMessageEnabled: false,
};

export async function getAppConfig(): Promise<AppConfig> {
    const ref = doc(db, "app_config", "settings");
    const snap = await getDoc(ref);
    if (!snap.exists()) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...snap.data() } as AppConfig;
}

"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info, Trophy } from "lucide-react";

export type ToastType = "success" | "error" | "achievement" | "info";

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, React.ElementType> = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    achievement: Trophy,
};

const STYLES: Record<ToastType, string> = {
    success: "border-accent/40 text-accent bg-accent/10",
    error: "border-red-500/40 text-red-400 bg-red-500/10",
    info: "border-primary/40 text-foreground/80 bg-primary/10",
    achievement: "border-secondary/40 text-secondary bg-secondary/10",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-28 right-4 z-[200] flex flex-col gap-2 max-w-xs pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => {
                        const Icon = ICONS[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                                transition={{ type: "spring", damping: 20 }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl text-sm font-semibold",
                                    STYLES[toast.type]
                                )}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span>{toast.message}</span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

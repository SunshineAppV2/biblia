"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ShareType = "streak" | "achievement" | "level";

interface Props {
    type: ShareType;
    value: number | string;
    name?: string;
}

function buildText(type: ShareType, value: number | string, name?: string): string {
    if (type === "streak") {
        return `🔥 ${value} dias de leitura bíblica consecutivos no BibleQuest! 📖 anobiblico.vercel.app`;
    }
    if (type === "achievement") {
        return `🏆 Conquista desbloqueada: ${name || value}! Jornada bíblica gamificada. 📖 anobiblico.vercel.app`;
    }
    // level
    return `⭐ Cheguei ao Nível ${value} no BibleQuest! 📖 anobiblico.vercel.app`;
}

export function ShareButton({ type, value, name }: Props) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const text = buildText(type, value, name);

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ text });
            } catch {
                // user cancelled — no-op
            }
            return;
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            console.error("ShareButton: clipboard unavailable");
        }
    };

    return (
        <div className="relative inline-flex">
            <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/30 hover:bg-secondary/20 text-secondary text-xs font-bold transition-all"
            >
                <Share2 className="w-3.5 h-3.5" />
                Compartilhar
            </motion.button>

            <AnimatePresence>
                {copied && (
                    <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg bg-primary text-white text-[10px] font-semibold shadow-lg pointer-events-none"
                    >
                        Link copiado!
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
}

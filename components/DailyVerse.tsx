"use client";

import { motion } from "framer-motion";
import { Sun, Quote } from "lucide-react";
import { getDailyVerse } from "@/lib/daily-verse";

export function DailyVerse() {
    const verse = getDailyVerse();

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            aria-label="Versículo do Dia"
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-1 mb-3">
                <Sun className="w-4 h-4 text-secondary fill-secondary/30" />
                <h3 className="text-base font-black text-primary uppercase tracking-widest">
                    Versículo do Dia
                </h3>
            </div>

            {/* Card */}
            <div
                style={{ backgroundColor: "#FEFAF0" }}
                className="relative rounded-2xl border border-secondary/40 px-5 py-5 shadow-sm overflow-hidden"
            >
                {/* Decorative golden top bar */}
                <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ background: "linear-gradient(to right, #B8820A44, #B8820A, #B8820A44)" }}
                />

                {/* Opening quote icon */}
                <Quote
                    className="w-8 h-8 mb-2 opacity-25"
                    style={{ color: "#B8820A" }}
                    aria-hidden="true"
                />

                {/* Verse text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="text-sm leading-relaxed italic font-medium"
                    style={{ color: "#1A237E" }}
                >
                    {verse.text}
                </motion.p>

                {/* Reference */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-3 text-xs font-black tracking-wide text-right"
                    style={{ color: "#B8820A" }}
                >
                    — {verse.reference}
                </motion.p>
            </div>
        </motion.section>
    );
}

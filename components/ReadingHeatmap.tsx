"use client";

import { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

interface Props {
    userId: string;
}

type DayMap = Record<string, number>; // "YYYY-MM-DD" -> chapter count

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

function getCellColor(count: number): string {
    if (count === 0) return "bg-primary/8";
    if (count === 1) return "bg-secondary/40";
    if (count === 2) return "bg-secondary/70";
    return "bg-secondary";
}

function buildWeekGrid(): { date: Date; dateStr: string }[][] {
    // Build 52 full weeks ending today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the Sunday on or before (today - 52*7 + 1) days ago
    const totalDays = 52 * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);
    // Adjust so week starts on Sunday
    const dayOfWeek = startDate.getDay(); // 0=Sun
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeks: { date: Date; dateStr: string }[][] = [];
    let current = new Date(startDate);

    while (current <= today) {
        const week: { date: Date; dateStr: string }[] = [];
        for (let d = 0; d < 7; d++) {
            const cell = new Date(current);
            const dateStr = cell.toISOString().slice(0, 10);
            week.push({ date: cell, dateStr });
            current.setDate(current.getDate() + 1);
        }
        weeks.push(week);
        if (weeks.length >= 53) break;
    }

    return weeks;
}

export function ReadingHeatmap({ userId }: Props) {
    const [dayMap, setDayMap] = useState<DayMap>({});
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState<{ dateStr: string; count: number; x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userId) return;
        const fetchData = async () => {
            try {
                const snap = await getDocs(collection(db, "users", userId, "reading_progress"));
                const map: DayMap = {};
                snap.forEach(doc => {
                    const data = doc.data();
                    let dateStr: string | null = null;
                    if (data.completedAt?.toDate) {
                        dateStr = data.completedAt.toDate().toISOString().slice(0, 10);
                    } else if (data.completedAt instanceof Date) {
                        dateStr = data.completedAt.toISOString().slice(0, 10);
                    }
                    if (dateStr) {
                        map[dateStr] = (map[dateStr] || 0) + 1;
                    }
                });
                setDayMap(map);
            } catch (e) {
                console.error("ReadingHeatmap: failed to fetch", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const weeks = buildWeekGrid();

    // Compute month labels: for each week column, check if the first day changes month
    const monthLabels: { col: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, col) => {
        const month = week[0].date.getMonth();
        if (month !== lastMonth) {
            monthLabels.push({ col, label: MONTH_LABELS[month] });
            lastMonth = month;
        }
    });

    const totalChapters = Object.values(dayMap).reduce((a, b) => a + b, 0);
    const activeDays = Object.keys(dayMap).length;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                    Histórico de Leitura
                </h3>
                <span className="text-xs text-muted-foreground">
                    {activeDays} dias ativos · {totalChapters} cap.
                </span>
            </div>

            {loading ? (
                <div className="glass-card p-4 flex items-center justify-center h-28">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary" />
                </div>
            ) : (
                <div className="glass-card p-4 overflow-x-auto" ref={containerRef}>
                    <div className="relative min-w-max">
                        {/* Month labels row */}
                        <div className="flex mb-1.5 ml-6">
                            {weeks.map((_, col) => {
                                const label = monthLabels.find(m => m.col === col);
                                return (
                                    <div key={col} className="w-3.5 mr-0.5 flex-shrink-0">
                                        {label && (
                                            <span className="text-[9px] text-muted-foreground font-bold leading-none">
                                                {label.label}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-0">
                            {/* Day of week labels */}
                            <div className="flex flex-col mr-1.5 gap-0.5">
                                {DAY_LABELS.map((label, i) => (
                                    <div key={i} className="h-3.5 flex items-center">
                                        <span className="text-[8px] text-muted-foreground w-4 text-right leading-none">
                                            {i % 2 === 1 ? label : ""}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="flex gap-0.5">
                                {weeks.map((week, col) => (
                                    <div key={col} className="flex flex-col gap-0.5">
                                        {week.map(({ dateStr, date }) => {
                                            const count = dayMap[dateStr] || 0;
                                            const isFuture = date > new Date();
                                            return (
                                                <motion.div
                                                    key={dateStr}
                                                    className={`w-3.5 h-3.5 rounded-sm cursor-pointer transition-all ${
                                                        isFuture
                                                            ? "opacity-0 pointer-events-none"
                                                            : getCellColor(count)
                                                    }`}
                                                    whileHover={{ scale: 1.3 }}
                                                    onMouseEnter={(e) => {
                                                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                        const containerRect = containerRef.current?.getBoundingClientRect();
                                                        setTooltip({
                                                            dateStr,
                                                            count,
                                                            x: rect.left - (containerRect?.left ?? 0) + rect.width / 2,
                                                            y: rect.top - (containerRect?.top ?? 0) - 4,
                                                        });
                                                    }}
                                                    onMouseLeave={() => setTooltip(null)}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tooltip */}
                        {tooltip && (
                            <div
                                className="absolute z-10 pointer-events-none px-2 py-1 rounded-lg bg-primary text-white text-[10px] font-semibold shadow-xl -translate-x-1/2 -translate-y-full whitespace-nowrap"
                                style={{ left: tooltip.x, top: tooltip.y }}
                            >
                                {new Date(tooltip.dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                                {" — "}
                                {tooltip.count === 0
                                    ? "nenhum capítulo"
                                    : `${tooltip.count} capítulo${tooltip.count > 1 ? "s" : ""}`}
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-1.5 mt-3 justify-end">
                        <span className="text-[9px] text-muted-foreground">Menos</span>
                        {[0, 1, 2, 3].map(v => (
                            <div key={v} className={`w-3 h-3 rounded-sm ${getCellColor(v)}`} />
                        ))}
                        <span className="text-[9px] text-muted-foreground">Mais</span>
                    </div>
                </div>
            )}
        </section>
    );
}

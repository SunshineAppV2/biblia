"use client";

import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, Flame } from "lucide-react";
import { getTodaysPlanChapter, getPlanProgress, getUpcomingChapters, PlanChapter } from "@/lib/reading-plan";

interface ReadingPlanCardProps {
  onNavigate: (bookId: string, chapter: number) => void;
}

export function ReadingPlanCard({ onNavigate }: ReadingPlanCardProps) {
  const [today, setToday] = useState<PlanChapter | null>(null);
  const [progress, setProgress] = useState<{ dayNumber: number; totalDays: number; percent: number } | null>(null);
  const [upcoming, setUpcoming] = useState<PlanChapter[]>([]);

  useEffect(() => {
    setToday(getTodaysPlanChapter());
    setProgress(getPlanProgress());
    setUpcoming(getUpcomingChapters(4));
  }, []);

  if (!today || !progress) return null;

  const [, ...next3] = upcoming;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg border"
      style={{
        background: "var(--card)",
        borderColor: "rgba(184,130,10,0.25)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)" }}
      >
        <div className="flex items-center gap-2.5">
          <Flame className="w-5 h-5 text-yellow-300" />
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mb-0.5">
              Plano de Leitura
            </p>
            <p className="text-sm font-bold text-white leading-none">
              REAVIVADOS POR SUA PALAVRA (RPSP)
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-yellow-300">
            Dia {progress.dayNumber}
          </p>
          <p className="text-[10px] text-white/50">
            de {progress.totalDays}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-black/10" style={{ background: "rgba(0,0,0,0.12)" }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${progress.percent}%`,
            background: "linear-gradient(90deg, #B8820A, #D4A430)",
          }}
        />
      </div>

      {/* Today's chapter */}
      <div className="px-5 pt-4 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--muted-foreground)" }}>
          Leitura de hoje
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #B8820A22, #D4A43022)", border: "1px solid #B8820A44" }}
            >
              <BookOpen className="w-5 h-5" style={{ color: "#B8820A" }} />
            </div>
            <div>
              <p className="font-black text-lg leading-tight" style={{ color: "var(--foreground)" }}>
                {today.bookName} {today.chapter}
              </p>
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                {progress.percent}% do plano concluído
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate(today.bookId, today.chapter)}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #B8820A, #D4A430)" }}
          >
            Ler hoje
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upcoming */}
      {next3.length > 0 && (
        <div className="px-5 pb-4 pt-1 border-t" style={{ borderColor: "rgba(184,130,10,0.12)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--muted-foreground)" }}>
            Próximos dias
          </p>
          <div className="flex flex-col gap-1">
            {next3.map((ch, i) => (
              <div
                key={`${ch.bookId}-${ch.chapter}`}
                className="flex items-center justify-between text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span>
                  <span className="font-semibold opacity-50 mr-2">+{i + 1}d</span>
                  {ch.bookName} {ch.chapter}
                </span>
                <span className="text-[10px] opacity-40">Dia {ch.dayNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div
        className="px-5 py-2.5 text-center text-[10px]"
        style={{
          color: "var(--muted-foreground)",
          borderTop: "1px solid rgba(184,130,10,0.1)",
          opacity: 0.6,
        }}
      >
        1 capítulo por dia · Bíblia completa em ~3 anos
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Target, ChevronDown } from "lucide-react";
import { getWeeklyChapters, getWeeklyGoal, setWeeklyGoal } from "@/lib/notifications";

const GOAL_OPTIONS = [3, 5, 7, 10, 14];

export function ReadingGoal() {
  const [chapters, setChapters] = useState(0);
  const [goal, setGoal] = useState(5);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setChapters(getWeeklyChapters());
      setGoal(getWeeklyGoal());
    };
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);


  const handleGoalChange = (g: number) => {
    setGoal(g);
    setWeeklyGoal(g);
    setShowPicker(false);
  };

  const percent = Math.min(100, Math.round((chapters / goal) * 100));
  const done = chapters >= goal;

  return (
    <div
      className="rounded-2xl shadow-sm border relative"
      style={{
        background: "var(--card)",
        borderColor: done ? "rgba(34,197,94,0.35)" : "rgba(66,165,245,0.25)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between rounded-t-2xl overflow-hidden"

        style={{
          background: done
            ? "linear-gradient(135deg, #14532d 0%, #166534 100%)"
            : "linear-gradient(135deg, #1e3a5f 0%, #1A237E 100%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Target className="w-4 h-4 text-white/80" />
          <p className="text-sm font-bold text-white leading-none">Meta Semanal</p>
        </div>

        {/* Goal selector */}
        <div className="relative">
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white/90 hover:bg-white/10 transition-colors"
          >
            {goal} cap/sem
            <ChevronDown className="w-3 h-3" />
          </button>
          {showPicker && (
            <div
              className="absolute right-0 top-8 z-50 rounded-xl shadow-xl border overflow-hidden w-48"
              style={{ background: "var(--card)", borderColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="p-2 border-b border-white/5">
                <p className="text-[10px] font-black text-muted-foreground uppercase px-2 mb-1">Sugestões</p>
                {GOAL_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGoalChange(g)}
                    className="w-full px-3 py-1.5 text-xs text-left hover:bg-primary/10 rounded-lg transition-colors font-medium border-l-2 border-transparent"
                    style={{
                      color: g === goal ? "#3b82f6" : "var(--foreground)",
                      borderColor: g === goal ? "#3b82f6" : "transparent",
                    }}
                  >
                    {g} capítulos/semana
                  </button>
                ))}
              </div>
              <div className="p-3 bg-secondary/10">
                <p className="text-[10px] font-black text-secondary uppercase px-1 mb-1.5">Meta Personalizada</p>
                <div className="flex items-center gap-2">
                   <input 
                      type="number"
                      min="1"
                      placeholder="Ex: 15"
                      className="w-full bg-white/50 dark:bg-black/20 border border-primary/20 rounded-lg text-xs font-black focus:outline-none focus:border-secondary px-2 py-1.5"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt((e.target as HTMLInputElement).value);
                          if (val > 0) handleGoalChange(val);
                        }
                      }}
                      onBlur={(e) => {
                         // Optional: auto-save on blur if value changed
                      }}
                   />
                   <button 
                     onClick={(e) => {
                       const input = (e.currentTarget.previousSibling as HTMLInputElement);
                       const val = parseInt(input.value);
                       if (val > 0) handleGoalChange(val);
                     }}
                     className="bg-secondary text-white text-[10px] font-black px-2 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                   >
                     OK
                   </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

      {/* Progress */}
      <div className="px-5 py-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span
              className="text-3xl font-black leading-none"
              style={{ color: done ? "#22c55e" : "var(--foreground)" }}
            >
              {chapters}
            </span>
            <span className="text-sm text-muted-foreground ml-1">/ {goal} capítulos</span>
          </div>
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{
              background: done ? "rgba(34,197,94,0.15)" : "rgba(66,165,245,0.12)",
              color: done ? "#22c55e" : "#3b82f6",
            }}
          >
            {done ? "✓ Meta atingida!" : `${percent}% da meta`}
          </span>
        </div>

        {/* Bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.1)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percent}%`,
              background: done
                ? "linear-gradient(90deg, #16a34a, #22c55e)"
                : "linear-gradient(90deg, #1d4ed8, #3b82f6)",
            }}
          />
        </div>

        {/* Day dots - only for goals up to 14 to avoid clutter */}
        {goal <= 14 && (
          <div className="flex gap-1.5 mt-3">
            {Array.from({ length: goal }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full"
                style={{
                  background:
                    i < chapters
                      ? done
                        ? "#22c55e"
                        : "#3b82f6"
                      : "rgba(0,0,0,0.12)",
                  maxWidth: 28,
                }}
              />
            ))}
          </div>
        )}


        {!done && (
          <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
            Faltam <strong>{goal - chapters}</strong> capítulo{goal - chapters !== 1 ? "s" : ""} para completar a meta desta semana
          </p>
        )}
      </div>
    </div>
  );
}

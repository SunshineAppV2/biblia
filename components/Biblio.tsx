"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface BiblioProps {
  mood?: "happy" | "excited" | "sleeping" | "sad" | "reading";
  size?: number;
  className?: string;
  animate?: boolean;
}

export function Biblio({
  mood = "happy",
  size = 120,
  className,
  animate = true,
}: BiblioProps) {
  const controls = useAnimation();

  // ── Idle / mood-specific animation sequences ──────────────────────────────
  useEffect(() => {
    if (!animate) {
      controls.stop();
      return;
    }

    if (mood === "excited") {
      controls.start({
        y: [0, -10, 0, -6, 0],
        rotate: [0, -4, 4, -3, 3, 0],
        scale: [1, 1.08, 1, 1.05, 1],
        transition: { duration: 0.7, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 },
      });
    } else if (mood === "sleeping") {
      controls.start({
        scale: [1, 1.025, 1],
        y: [0, 2, 0],
        transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
      });
    } else if (mood === "sad") {
      controls.start({
        y: [0, 3, 0],
        rotate: [0, -1.5, 0],
        transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity },
      });
    } else {
      // happy / reading — gentle float
      controls.start({
        y: [0, -5, 0],
        transition: { duration: 2.2, ease: "easeInOut", repeat: Infinity },
      });
    }
  }, [mood, animate, controls]);

  // ── Eye shapes per mood ───────────────────────────────────────────────────
  const renderEyes = () => {
    const cx1 = 36;
    const cx2 = 56;
    const cy = 52;

    switch (mood) {
      case "happy":
        return (
          <>
            <circle cx={cx1} cy={cy} r={4.5} fill="#1A237E" />
            <circle cx={cx2} cy={cy} r={4.5} fill="#1A237E" />
            <circle cx={cx1 + 1.5} cy={cy - 1.5} r={1.2} fill="white" />
            <circle cx={cx2 + 1.5} cy={cy - 1.5} r={1.2} fill="white" />
          </>
        );

      case "excited":
        // Star-shaped eyes
        return (
          <>
            {[cx1, cx2].map((cx, i) => (
              <g key={i} transform={`translate(${cx},${cy})`}>
                {/* 4-point star */}
                <polygon
                  points="0,-5.5 1.3,-1.3 5.5,0 1.3,1.3 0,5.5 -1.3,1.3 -5.5,0 -1.3,-1.3"
                  fill="#1A237E"
                />
                <circle cx={1} cy={-1} r={1} fill="white" />
              </g>
            ))}
          </>
        );

      case "sleeping":
        // Curved closed eyes ( ﹏ shape )
        return (
          <>
            <path
              d={`M${cx1 - 5},${cy} Q${cx1},${cy - 5} ${cx1 + 5},${cy}`}
              fill="none"
              stroke="#1A237E"
              strokeWidth={2.2}
              strokeLinecap="round"
            />
            <path
              d={`M${cx2 - 5},${cy} Q${cx2},${cy - 5} ${cx2 + 5},${cy}`}
              fill="none"
              stroke="#1A237E"
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          </>
        );

      case "sad":
        // Droopy eyes — tilted downward inside
        return (
          <>
            <ellipse cx={cx1} cy={cy} rx={4.5} ry={4} fill="#1A237E" transform={`rotate(10,${cx1},${cy})`} />
            <ellipse cx={cx2} cy={cy} rx={4.5} ry={4} fill="#1A237E" transform={`rotate(-10,${cx2},${cy})`} />
            {/* droopy upper lids */}
            <path
              d={`M${cx1 - 5},${cy - 2} Q${cx1},${cy + 2} ${cx1 + 5},${cy - 2}`}
              fill="#FEFAF0"
              stroke="none"
            />
            <path
              d={`M${cx2 - 5},${cy - 2} Q${cx2},${cy + 2} ${cx2 + 5},${cy - 2}`}
              fill="#FEFAF0"
              stroke="none"
            />
            <circle cx={cx1 + 1} cy={cy - 1} r={1} fill="white" />
            <circle cx={cx2 + 1} cy={cy - 1} r={1} fill="white" />
          </>
        );

      case "reading":
        // Squinting / focused eyes looking down
        return (
          <>
            <ellipse cx={cx1} cy={cy} rx={4.5} ry={2.8} fill="#1A237E" />
            <ellipse cx={cx2} cy={cy} rx={4.5} ry={2.8} fill="#1A237E" />
            {/* focused highlight low */}
            <circle cx={cx1 + 1} cy={cy + 0.5} r={1} fill="white" />
            <circle cx={cx2 + 1} cy={cy + 0.5} r={1} fill="white" />
            {/* squint line above each eye */}
            <path
              d={`M${cx1 - 5},${cy - 3} Q${cx1},${cy - 6} ${cx1 + 5},${cy - 3}`}
              fill="none"
              stroke="#1A237E"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <path
              d={`M${cx2 - 5},${cy - 3} Q${cx2},${cy - 6} ${cx2 + 5},${cy - 3}`}
              fill="none"
              stroke="#1A237E"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </>
        );

      default:
        return null;
    }
  };

  // ── Eyebrow shapes per mood ───────────────────────────────────────────────
  const renderEyebrows = () => {
    const cx1 = 36;
    const cx2 = 56;
    const by = 44;

    switch (mood) {
      case "happy":
      case "reading":
        return (
          <>
            <path d={`M${cx1 - 5},${by} Q${cx1},${by - 3} ${cx1 + 5},${by}`} fill="none" stroke="#1A237E" strokeWidth={1.8} strokeLinecap="round" />
            <path d={`M${cx2 - 5},${by} Q${cx2},${by - 3} ${cx2 + 5},${by}`} fill="none" stroke="#1A237E" strokeWidth={1.8} strokeLinecap="round" />
          </>
        );
      case "excited":
        return (
          <>
            <path d={`M${cx1 - 5},${by - 2} Q${cx1},${by - 6} ${cx1 + 5},${by - 2}`} fill="none" stroke="#1A237E" strokeWidth={2} strokeLinecap="round" />
            <path d={`M${cx2 - 5},${by - 2} Q${cx2},${by - 6} ${cx2 + 5},${by - 2}`} fill="none" stroke="#1A237E" strokeWidth={2} strokeLinecap="round" />
          </>
        );
      case "sleeping":
        return null;
      case "sad":
        // Angled down toward center
        return (
          <>
            <path d={`M${cx1 - 5},${by - 3} L${cx1 + 5},${by + 1}`} fill="none" stroke="#1A237E" strokeWidth={1.8} strokeLinecap="round" />
            <path d={`M${cx2 - 5},${by + 1} L${cx2 + 5},${by - 3}`} fill="none" stroke="#1A237E" strokeWidth={1.8} strokeLinecap="round" />
          </>
        );
      default:
        return null;
    }
  };

  // ── Mouth shapes per mood ─────────────────────────────────────────────────
  const renderMouth = () => {
    const mx = 46;
    const my = 65;

    switch (mood) {
      case "happy":
        return (
          <path
            d={`M${mx - 8},${my} Q${mx},${my + 7} ${mx + 8},${my}`}
            fill="none"
            stroke="#1A237E"
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        );

      case "excited":
        return (
          <>
            {/* Wide open smile */}
            <path
              d={`M${mx - 10},${my - 1} Q${mx},${my + 10} ${mx + 10},${my - 1}`}
              fill="#E53935"
              stroke="#1A237E"
              strokeWidth={1.5}
            />
            {/* teeth hint */}
            <path
              d={`M${mx - 7},${my + 1} L${mx + 7},${my + 1}`}
              fill="none"
              stroke="white"
              strokeWidth={1.5}
            />
          </>
        );

      case "sleeping":
        return (
          <path
            d={`M${mx - 5},${my + 1} Q${mx},${my + 4} ${mx + 5},${my + 1}`}
            fill="none"
            stroke="#1A237E"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        );

      case "sad":
        return (
          <path
            d={`M${mx - 8},${my + 4} Q${mx},${my - 3} ${mx + 8},${my + 4}`}
            fill="none"
            stroke="#1A237E"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );

      case "reading":
        return (
          <path
            d={`M${mx - 6},${my + 1} L${mx + 6},${my + 1}`}
            fill="none"
            stroke="#1A237E"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );

      default:
        return null;
    }
  };

  // ── "Z z" floating for sleeping mood ─────────────────────────────────────
  const renderZzz = () => {
    if (mood !== "sleeping") return null;
    return (
      <>
        <motion.text
          x={72}
          y={28}
          fontSize={9}
          fontWeight="bold"
          fill="#7986CB"
          fontFamily="sans-serif"
          animate={{ opacity: [0, 1, 0], y: [28, 18, 8] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.3 }}
        >
          z
        </motion.text>
        <motion.text
          x={79}
          y={20}
          fontSize={7}
          fontWeight="bold"
          fill="#9FA8DA"
          fontFamily="sans-serif"
          animate={{ opacity: [0, 1, 0], y: [20, 12, 4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, repeatDelay: 0.3 }}
        >
          z
        </motion.text>
      </>
    );
  };

  // ── SVG dimensions (all coordinates tuned at 100×100 viewBox) ────────────
  return (
    <motion.div
      className={cn("inline-flex items-center justify-center select-none", className)}
      animate={controls}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Biblio mascot — ${mood} mood`}
        role="img"
      >
        {/* ── Drop shadow filter ─────────────────────────────────────────── */}
        <defs>
          <filter id="biblio-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1A237E" floodOpacity="0.18" />
          </filter>
          <linearGradient id="spine-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B6508" />
            <stop offset="40%" stopColor="#D4A017" />
            <stop offset="100%" stopColor="#8B6508" />
          </linearGradient>
          <linearGradient id="left-cover-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A237E" />
            <stop offset="100%" stopColor="#283593" />
          </linearGradient>
          <linearGradient id="right-cover-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#283593" />
            <stop offset="100%" stopColor="#1A237E" />
          </linearGradient>
        </defs>

        {/* ── Left arm ──────────────────────────────────────────────────── */}
        <rect x={3} y={52} width={14} height={8} rx={4} fill="#1A237E" />
        {/* left hand */}
        <circle cx={4} cy={56} r={5} fill="#283593" />
        <circle cx={4} cy={56} r={3.5} fill="#B8820A" />

        {/* ── Right arm ─────────────────────────────────────────────────── */}
        <rect x={103} y={52} width={14} height={8} rx={4} fill="#1A237E" />
        {/* right hand */}
        <circle cx={116} cy={56} r={5} fill="#283593" />
        <circle cx={116} cy={56} r={3.5} fill="#B8820A" />

        {/* ── Outer Bible body (filter group) ───────────────────────────── */}
        <g filter="url(#biblio-shadow)">
          {/* Left cover */}
          <rect x={10} y={12} width={47} height={76} rx={4} fill="url(#left-cover-grad)" />
          {/* Right cover */}
          <rect x={63} y={12} width={47} height={76} rx={4} fill="url(#right-cover-grad)" />
          {/* Spine */}
          <rect x={56} y={12} width={8} height={76} rx={2} fill="url(#spine-grad)" />
        </g>

        {/* ── Gold trim border on left cover ────────────────────────────── */}
        <rect x={10} y={12} width={47} height={76} rx={4} fill="none" stroke="#B8820A" strokeWidth={1.5} />
        {/* Gold trim on right cover */}
        <rect x={63} y={12} width={47} height={76} rx={4} fill="none" stroke="#B8820A" strokeWidth={1.5} />

        {/* ── Left page (face page) ─────────────────────────────────────── */}
        <rect x={13} y={16} width={41} height={68} rx={2} fill="#FEFAF0" />

        {/* Text line details on left page (upper portion above face) */}
        {[22, 27, 32, 37].map((y) => (
          <line key={y} x1={17} y1={y} x2={50} y2={y} stroke="#D4B896" strokeWidth={1} strokeLinecap="round" />
        ))}

        {/* ── Face elements ─────────────────────────────────────────────── */}
        {renderEyebrows()}
        {renderEyes()}
        {renderMouth()}

        {/* Rosy cheeks for happy / excited */}
        {(mood === "happy" || mood === "excited") && (
          <>
            <ellipse cx={28} cy={60} rx={4} ry={2.5} fill="#FFCDD2" opacity={0.7} />
            <ellipse cx={64} cy={60} rx={4} ry={2.5} fill="#FFCDD2" opacity={0.7} />
          </>
        )}

        {/* Text lines below mouth */}
        {[74, 79].map((y) => (
          <line key={y} x1={17} y1={y} x2={50} y2={y} stroke="#D4B896" strokeWidth={1} strokeLinecap="round" />
        ))}

        {/* ── Right page ────────────────────────────────────────────────── */}
        <rect x={66} y={16} width={41} height={68} rx={2} fill="#FEFAF0" />

        {/* Line details on right page */}
        {[22, 27, 32, 37, 74, 79].map((y) => (
          <line key={y} x1={69} y1={y} x2={104} y2={y} stroke="#D4B896" strokeWidth={1} strokeLinecap="round" />
        ))}

        {/* Golden cross on right page */}
        {/* Vertical bar */}
        <rect x={84} y={44} width={5} height={26} rx={1.5} fill="#B8820A" />
        {/* Horizontal bar */}
        <rect x={76} y={53} width={21} height={5} rx={1.5} fill="#B8820A" />
        {/* Cross shine */}
        <rect x={85.5} y={45} width={2} height={8} rx={1} fill="#D4A017" opacity={0.6} />

        {/* ── Sleeping Zzz ──────────────────────────────────────────────── */}
        {renderZzz()}

        {/* ── Spine decorative dot ──────────────────────────────────────── */}
        <circle cx={60} cy={50} r={2} fill="#D4A017" />
        <circle cx={60} cy={30} r={1.2} fill="#D4A017" />
        <circle cx={60} cy={70} r={1.2} fill="#D4A017" />
      </svg>
    </motion.div>
  );
}

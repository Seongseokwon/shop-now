"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
}

function getColor(score: number) {
  if (score >= 70) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    setDisplayed(0);
    const start = performance.now();
    const duration = 1200;

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [score]);

  const color = getColor(score);
  const offset = CIRCUMFERENCE * (1 - displayed / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="136" height="136" viewBox="0 0 136 136" aria-label={`구매 추천도 ${score}점`}>
        {/* Track */}
        <circle
          cx="68"
          cy="68"
          r={RADIUS}
          fill="none"
          stroke="#E9ECEF"
          strokeWidth="12"
        />
        {/* Progress */}
        <circle
          cx="68"
          cy="68"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 68 68)"
          style={{ transition: "stroke 0.3s" }}
        />
        {/* Score text */}
        <text
          x="68"
          y="62"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="28"
          fontWeight="900"
          fill={color}
          fontFamily="inherit"
        >
          {displayed}
        </text>
        <text
          x="68"
          y="84"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fill="#888888"
          fontFamily="inherit"
        >
          / 100점
        </text>
      </svg>
      <p className="text-xs text-[#888888]">구매 추천도</p>
    </div>
  );
}

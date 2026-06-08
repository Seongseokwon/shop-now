export const STATS_KEY = "decide_stats";

export interface DecideStats {
  total: number;   // 누적 판정 횟수
  skip: number;    // 누적 "참으세요" 횟수
  buy: number;     // 누적 "사세요" 횟수
}

export interface Badge {
  id: string;
  emoji: string;
  label: string;
  description: string;
  earned: boolean;
}

function defaultStats(): DecideStats {
  return { total: 0, skip: 0, buy: 0 };
}

export function loadStats(): DecideStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) };
  } catch {
    return defaultStats();
  }
}

export function recordJudgment(verdict: string): DecideStats {
  try {
    const stats = loadStats();
    stats.total += 1;
    if (verdict === "참으세요") stats.skip += 1;
    else stats.buy += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch {
    return defaultStats();
  }
}

const BADGE_DEFS: Omit<Badge, "earned">[] = [
  {
    id: "first",
    emoji: "🎯",
    label: "첫 판정",
    description: "첫 번째 살까말까 판정",
  },
  {
    id: "resist_1",
    emoji: "🛡️",
    label: "충동구매 위기탈출",
    description: "참으세요 판정 1회 달성",
  },
  {
    id: "resist_3",
    emoji: "🧠",
    label: "신중한 소비자",
    description: "참으세요 판정 3회 달성",
  },
  {
    id: "resist_5",
    emoji: "🏆",
    label: "절약왕",
    description: "참으세요 판정 5회 달성",
  },
  {
    id: "analyst",
    emoji: "🔍",
    label: "쇼핑 분석가",
    description: "누적 판정 10회 달성",
  },
];

export function getEarnedBadges(stats: DecideStats): Badge[] {
  return BADGE_DEFS.map((def) => {
    let earned = false;
    switch (def.id) {
      case "first":      earned = stats.total >= 1; break;
      case "resist_1":   earned = stats.skip >= 1; break;
      case "resist_3":   earned = stats.skip >= 3; break;
      case "resist_5":   earned = stats.skip >= 5; break;
      case "analyst":    earned = stats.total >= 10; break;
    }
    return { ...def, earned };
  });
}

/** 방금 새로 획득한 배지만 반환 (이전 stats와 비교) */
export function getNewlyEarned(prev: DecideStats, next: DecideStats): Badge[] {
  const before = getEarnedBadges(prev);
  const after = getEarnedBadges(next);
  return after.filter(
    (b, i) => b.earned && !before[i].earned
  );
}

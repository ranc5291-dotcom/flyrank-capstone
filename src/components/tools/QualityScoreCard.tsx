// src/components/tools/QualityScoreCard.tsx

interface Tier {
  label: string;
  emoji: string;
  badgeClass: string;
  explanation: string;
}

function getTier(score: number): Tier {
  if (score <= 40) {
    return {
      label: "Poor Prompt",
      emoji: "🔴",
      badgeClass: "bg-red-100 text-red-700 border-red-300",
      explanation: "This prompt is missing key context or clarity — significant rework recommended.",
    };
  }
  if (score <= 70) {
    return {
      label: "Fair Prompt",
      emoji: "🟡",
      badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-300",
      explanation: "This prompt is usable but has gaps. A few targeted improvements would help.",
    };
  }
  if (score <= 90) {
    return {
      label: "Good Prompt",
      emoji: "🟢",
      badgeClass: "bg-green-100 text-green-700 border-green-300",
      explanation: "This prompt is solid and clear, with minor room to improve.",
    };
  }
  return {
    label: "Excellent Prompt",
    emoji: "🟣",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-300",
    explanation: "This prompt is well-structured and specific, with clear intent and constraints.",
  };
}

export function QualityScoreCard({ score }: { score: number }) {
  const tier = getTier(score);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Prompt Quality Score</h3>
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${tier.badgeClass}`}>
          <span>{tier.emoji}</span>
          <span className="text-lg font-bold">{score}</span>
          <span className="text-xs font-medium">/ 100</span>
        </div>
      </div>
      <p className="mt-1 text-xs font-medium text-gray-500">{tier.label}</p>
      <p className="mt-1 text-xs text-gray-500">{tier.explanation}</p>
    </div>
  );
}
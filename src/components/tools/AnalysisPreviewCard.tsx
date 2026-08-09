// src/components/tools/AnalysisPreviewCard.tsx

const PREVIEW_ITEMS = [
  "Prompt Quality Score",
  "Strengths",
  "Weaknesses",
  "Suggestions",
  "Optimized Prompt",
];

export function AnalysisPreviewCard() {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-2">📊 Analysis Preview</p>
      <ul className="space-y-1 mb-3">
        {PREVIEW_ITEMS.map((item) => (
          <li key={item} className="text-sm text-gray-400 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            {item}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-400">Enter a prompt above to begin.</p>
    </div>
  );
}
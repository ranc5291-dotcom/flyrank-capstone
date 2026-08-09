// src/components/tools/ExamplePrompts.tsx

const EXAMPLES = [
  { emoji: "📝", label: "Write a blog post about productivity" },
  { emoji: "💻", label: "Create a React login page" },
  { emoji: "📧", label: "Write a professional email" },
  { emoji: "📈", label: "Create a marketing strategy" },
];

export function ExamplePrompts({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">💡 Try one of these examples:</p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => onPick(ex.label)}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-600
                       hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {ex.emoji} {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
}
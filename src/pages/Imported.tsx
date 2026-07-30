import usePrompts from '../hooks/usePrompts'
import PromptCard from '../components/PromptCard'
import BackHomeButton from '../components/BackHomeButton'

export default function Imported() {
  const { prompts } = usePrompts()
  const imported = prompts.filter((p) => p.imported)

  return (
    <div>
      <BackHomeButton />
      <h1 className="text-2xl font-semibold mb-4">Imported Prompts</h1>

      {imported.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No imported prompts yet. Use "Import JSON" from Quick Actions to bring prompts in.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {imported.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}
    </div>
  )
}
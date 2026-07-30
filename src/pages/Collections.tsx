import { useState } from 'react'
import { Link } from 'react-router-dom'
import useCollections from '../hooks/useCollections'
import usePrompts from '../hooks/usePrompts'
import BackHomeButton from '../components/BackHomeButton'

export default function Collections() {
  const { collections, deleteCollection } = useCollections()
  const { prompts, updatePrompt } = usePrompts()
  const [openAddFor, setOpenAddFor] = useState<string | null>(null)

  function handleAddPrompt(promptId: string, collectionId: string) {
    updatePrompt(promptId, { collectionId })
    setOpenAddFor(null)
  }

  function handleRemovePrompt(promptId: string) {
    updatePrompt(promptId, { collectionId: undefined })
  }

  return (
    <div>
      <BackHomeButton />
      <h1 className="text-2xl font-semibold mb-4">Your Collections</h1>

      {collections.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No collections yet. Create one from the dashboard's Quick Actions.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((c) => {
            const inCollection = prompts.filter((p) => p.collectionId === c.id)
            const notInCollection = prompts.filter((p) => p.collectionId !== c.id)

            return (
              <div key={c.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full ${c.color}`} />
                  <h3 className="font-semibold">{c.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {inCollection.length} prompt{inCollection.length === 1 ? '' : 's'}
                </p>

                {inCollection.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {inCollection.map((p) => (
                      <li key={p.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{p.title}</span>
                        <button
                          onClick={() => handleRemovePrompt(p.id)}
                          className="text-red-500 hover:underline text-xs ml-2 shrink-0"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="relative mb-3">
                  <button
                    onClick={() => setOpenAddFor(openAddFor === c.id ? null : c.id)}
                    className="w-full text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    + Add prompt
                  </button>

                  {openAddFor === c.id && (
                    <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                      {notInCollection.length === 0 ? (
                        <p className="text-xs text-gray-500 p-3">No other prompts available.</p>
                      ) : (
                        notInCollection.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleAddPrompt(p.id, c.id)}
                            className="w-full text-left text-sm px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 truncate"
                          >
                            {p.title}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Link to={`/library?collection=${c.id}`} className="text-indigo-600 hover:underline">
                    View
                  </Link>
                  <button onClick={() => deleteCollection(c.id)} className="text-red-600 hover:underline">
                    Delete collection
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
import { forwardRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePrompts from '../hooks/usePrompts'
import useCollections from '../hooks/useCollections'
import type { Prompt } from '../types/dashboard'

interface PromptCardProps {
  prompt: Prompt
  selected?: boolean
}

const TAG_COLORS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
  'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
  'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200',
  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
]

function tagColor(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

const PromptCard = forwardRef<HTMLDivElement, PromptCardProps>(({ prompt, selected }, ref) => {
  const navigate = useNavigate()
  const { toggleFavorite, deletePrompt, updatePrompt } = usePrompts()
  const { collections } = useCollections()
  const [showCollectionPicker, setShowCollectionPicker] = useState(false)

  const categoryName = collections.find((c) => c.id === prompt.collectionId)?.name ?? 'Uncategorized'

  function handleCopy() {
    navigator.clipboard.writeText(prompt.body ?? '')
  }

  function handleEdit() {
    navigate(`/add?id=${prompt.id}`)
  }

  function handleDelete() {
    if (confirm(`Delete "${prompt.title}"?`)) {
      deletePrompt(prompt.id)
    }
  }

  function handleAssignCollection(collectionId: string) {
    updatePrompt(prompt.id, { collectionId })
    setShowCollectionPicker(false)
  }

  function handleRemoveFromCollection() {
    updatePrompt(prompt.id, { collectionId: undefined })
    setShowCollectionPicker(false)
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`relative rounded-lg border p-4 bg-white dark:bg-gray-800 transition-colors ${
        selected ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{prompt.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {categoryName} • {prompt.model ?? 'any'} • {new Date(prompt.createdAt).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{prompt.body}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {prompt.tags?.map((tag) => (
          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tagColor(tag)}`}>
            {tag}
          </span>
        ))}
        {prompt.imported && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
            Imported
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-sm flex-wrap">
        <button onClick={handleCopy} className="text-indigo-600 hover:underline">Copy</button>
        <button
          onClick={() => toggleFavorite(prompt.id)}
          className={prompt.favorite ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'}
          aria-label={prompt.favorite ? 'Unfavorite' : 'Favorite'}
        >
          ★
        </button>
        <button onClick={handleEdit} className="text-indigo-600 hover:underline">Edit</button>
        <button onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
        <button
          onClick={() => setShowCollectionPicker((s) => !s)}
          className="text-indigo-600 hover:underline"
        >
          + Collection
        </button>
      </div>

      {showCollectionPicker && (
        <div className="absolute z-10 mt-2 right-4 w-48 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          {prompt.collectionId && (
            <button
              onClick={handleRemoveFromCollection}
              className="w-full text-left text-sm px-3 py-2 text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Remove from collection
            </button>
          )}
          {collections.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 p-3">No collections yet.</p>
          ) : (
            collections.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAssignCollection(c.id)}
                className="w-full text-left text-sm px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 truncate text-gray-900 dark:text-gray-100"
              >
                {c.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
})

export default PromptCard
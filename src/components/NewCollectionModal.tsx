import { useEffect, useState } from 'react'

interface NewCollectionModalProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

export default function NewCollectionModal({ open, onClose, onCreate }: NewCollectionModalProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setName('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">New Collection</h2>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Collection name"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={!name.trim()}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
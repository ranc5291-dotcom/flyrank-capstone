import React from 'react'
import usePrompts from '../hooks/usePrompts'
import PromptCard from '../components/PromptCard'
import BackHomeButton from '../components/BackHomeButton'

export default function Favorites() {
  const { prompts } = usePrompts()
  const favorites = prompts.filter((p) => p.favorite)

  return (
    <div>
      <BackHomeButton />
      <h1 className="text-2xl font-semibold mb-4">Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          You haven't favorited any prompts yet. Star a prompt from the library or dashboard to see it here.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}
    </div>
  )
}
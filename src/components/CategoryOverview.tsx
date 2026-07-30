import React from 'react'
import type { Category } from '../types/dashboard'
import usePrompts from '../hooks/usePrompts'

type Props = {
  categories: Category[]
}

export default function CategoryOverview({ categories }: Props) {
  const { prompts } = usePrompts()

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Categories</div>
      <div className="flex flex-wrap gap-2">
        {categories.length === 0 ? (
          <p className="text-xs text-gray-500">No collections yet. Add one from Quick Actions.</p>
        ) : (
          categories.map((c) => {
            const count = prompts.filter((p) => p.collectionId === c.name).length
            return (
              <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className={`w-2 h-2 rounded-full ${c.color || 'bg-indigo-500'}`} />
                <div className="text-sm">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{count} prompt{count === 1 ? '' : 's'}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  onToggleSidebar: () => void
}

export default function Navbar({ onToggleSidebar }: Props) {
  const navigate = useNavigate()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={onToggleSidebar}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-md" />
              <span className="font-semibold">AI Prompt Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <input
                className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                placeholder="Search prompts..."
                aria-label="Search"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/add')}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              title="Create new prompt"
              aria-label="Create new prompt"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              title="Open settings"
              aria-label="Open settings"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2 17.89l.06-.06c.35-.35.5-.84.33-1.32a1.65 1.65 0 0 0-.33-1.82L2.68 12.9a2 2 0 0 1 0-2.83l.06-.06c.35-.35.5-.84.33-1.32a1.65 1.65 0 0 0-.33-1.82L3.7 4.7A2 2 0 1 1 6.53 1.87l.06.06c.35.35.84.5 1.32.33a1.65 1.65 0 0 0 1.82-.33L12 1.1a2 2 0 0 1 2.83 0l.06.06c.35.35.84.5 1.32.33.55-.2 1.14-.02 1.51.33l1.02 1.02a2 2 0 1 1 2.83 2.83l-1.02 1.02c-.35.35-.5.84-.33 1.32.18.49.02 1.08-.33 1.42L19.4 15z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

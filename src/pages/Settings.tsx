import { useState, useEffect } from 'react'
import BackHomeButton from '../components/BackHomeButton'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('apst_theme_v1') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('apst_theme_v1', darkMode ? 'dark' : 'light')
  }, [darkMode])

  function handleClearData() {
    if (confirm('This will remove all prompts and collections. Continue?')) {
      localStorage.removeItem('apst_prompts_v1')
      localStorage.removeItem('apst_collections_v2')
      window.location.reload()
    }
  }

  return (
    <div className="max-w-xl">
      <BackHomeButton />
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">User preferences and app settings.</p>

      <div className="space-y-6">
        <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm text-gray-500">Toggle the app's color theme.</p>
          </div>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className={`w-11 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-5' : ''}`}
            />
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <p className="font-medium mb-1">Default model</p>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent">
            <option value="gpt-4o">gpt-4o</option>
            <option value="claude-2">claude-2</option>
            <option value="gemini-pro">gemini-pro</option>
          </select>
        </div>

        <div className="border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="font-medium text-red-600 mb-1">Danger zone</p>
          <p className="text-sm text-gray-500 mb-3">Clear all locally stored prompts and collections.</p>
          <button
            onClick={handleClearData}
            className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Clear all data
          </button>
        </div>
      </div>
    </div>
  )
}
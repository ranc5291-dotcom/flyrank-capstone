import { useState, useEffect } from 'react'
import BackHomeButton from '../components/BackHomeButton'
import usePrompts from '../hooks/usePrompts'
import useCollections from '../hooks/useCollections'

const DEFAULT_MODEL_KEY = 'apst_default_model_v1'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('apst_theme_v1') === 'dark')
  const [defaultModel, setDefaultModel] = useState(
    () => localStorage.getItem(DEFAULT_MODEL_KEY) ?? 'gpt-4o'
  )
  const { prompts, setPrompts } = usePrompts()
  const { collections } = useCollections()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('apst_theme_v1', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem(DEFAULT_MODEL_KEY, defaultModel)
  }, [defaultModel])

  function handleClearData() {
    if (confirm('This will remove all prompts and collections. Continue?')) {
      localStorage.removeItem('apst_prompts_v1')
      localStorage.removeItem('apst_collections_v2')
      window.location.reload()
    }
  }

  function handleExport() {
    const data = { prompts, collections, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-prompt-studio-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        const importedPrompts = Array.isArray(parsed) ? parsed : parsed.prompts
        if (Array.isArray(importedPrompts)) {
          const merged = [...importedPrompts, ...prompts]
          const deduped = Array.from(new Map(merged.map((p) => [p.id, p])).values())
          setPrompts(deduped)
          alert(`Imported ${importedPrompts.length} prompt(s).`)
        } else {
          alert('That file doesn\'t look like a valid export.')
        }
      } catch {
        alert('Failed to read that file — is it valid JSON?')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="max-w-xl">
      <BackHomeButton />
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2 17.89l.06-.06c.35-.35.5-.84.33-1.32a1.65 1.65 0 0 0-.33-1.82L2.68 12.9a2 2 0 0 1 0-2.83l.06-.06c.35-.35.5-.84.33-1.32a1.65 1.65 0 0 0-.33-1.82L3.7 4.7A2 2 0 1 1 6.53 1.87l.06.06c.35.35.84.5 1.32.33a1.65 1.65 0 0 0 1.82-.33L12 1.1a2 2 0 0 1 2.83 0l.06.06c.35.35.84.5 1.32.33.55-.2 1.14-.02 1.51.33l1.02 1.02a2 2 0 1 1 2.83 2.83l-1.02 1.02c-.35.35-.5.84-.33 1.32.18.49.02 1.08-.33 1.42L19.4 15z"
          />
        </svg>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>
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
          <p className="text-sm text-gray-500 mb-2">Used as the default selection when adding a new prompt.</p>
          <select
            value={defaultModel}
            onChange={(e) => setDefaultModel(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent"
          >
            <option value="gpt-4o">gpt-4o</option>
            <option value="claude-2">claude-2</option>
            <option value="gemini-pro">gemini-pro</option>
          </select>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <p className="font-medium mb-1">Export / Import data</p>
          <p className="text-sm text-gray-500 mb-3">Download your prompts and collections, or restore from a file.</p>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Export data
            </button>
            <label className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              Import data
              <input type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
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
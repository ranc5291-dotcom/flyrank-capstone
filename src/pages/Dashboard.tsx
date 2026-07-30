import React, { useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { mockCategories, mockActivity } from '../lib/mockData'
import usePrompts from '../hooks/usePrompts'
import StatCard from '../components/StatCard'
import PromptCard from '../components/PromptCard'
import QuickActions from '../components/QuickActions'
import CategoryOverview from '../components/CategoryOverview'
import RecentActivity from '../components/RecentActivity'

export default function Dashboard() {
  const navigate = useNavigate()
  const { prompts, setPrompts } = usePrompts()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stats = {
    totalPrompts: prompts.length,
    favorites: prompts.filter((p) => p.favorite).length,
    collections: mockCategories.length,
    recentEdits: prompts.length,
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string)
        if (Array.isArray(imported)) {
          const tagged = imported.map((p) => ({ ...p, imported: true }))
          setPrompts([...tagged, ...prompts])
        }
      } catch {
        // ignore invalid file
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">AI Prompt Studio</h1>
              <p className="text-indigo-100 mt-1">Manage and iterate on your AI prompts — fast and simple.</p>
            </div>
            <div className="hidden sm:flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button onClick={handleImportClick} className="bg-white/20 px-4 py-2 rounded-md">Import</button>
              <button onClick={() => navigate('/add')} className="bg-white px-4 py-2 rounded-md text-indigo-600 font-semibold">New Prompt</button>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total prompts" value={stats.totalPrompts} />
            <StatCard label="Favourites" value={stats.favorites} />
            <StatCard label="Collections" value={stats.collections} />
            <StatCard label="Recent edits" value={stats.recentEdits} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent prompts</h2>
              <Link to="/library" className="text-sm text-indigo-600 hover:underline">View all</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prompts.slice(0, 4).map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Favourite prompts</h2>
              <Link to="/favorites" className="text-sm text-indigo-600 hover:underline">View favourites</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prompts.filter((p) => p.favorite).slice(0, 4).map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <QuickActions />

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <CategoryOverview categories={mockCategories} />
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <RecentActivity activity={mockActivity} />
          </div>
        </aside>
      </section>
    </div>
  )
}
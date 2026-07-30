import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import usePrompts from '../hooks/usePrompts'
import useCollections from '../hooks/useCollections'
import PromptCard from '../components/PromptCard'
import BackHomeButton from '../components/BackHomeButton'

export default function Library() {
  const { prompts } = usePrompts()
  const { collections } = useCollections()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [collectionId, setCollectionId] = useState(searchParams.get('collection') ?? 'All')
  const [model, setModel] = useState('All models')
  const [sort, setSort] = useState<'Newest' | 'Oldest'>('Newest')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const models = useMemo(
    () => ['All models', ...Array.from(new Set(prompts.map((p) => p.model).filter(Boolean)))],
    [prompts]
  )

  const filteredPrompts = useMemo(() => {
    let result = prompts.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
      const matchesCollection = collectionId === 'All' || p.collectionId === collectionId
      const matchesModel = model === 'All models' || p.model === model
      return matchesSearch && matchesCollection && matchesModel
    })
    return result.sort((a, b) =>
      sort === 'Newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [prompts, search, collectionId, model, sort])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search, collectionId, model, sort])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (!filteredPrompts.length) return

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filteredPrompts.length - 1))
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const prompt = filteredPrompts[selectedIndex]
        if (prompt) navigate(`/add?id=${prompt.id}`)
      }
        else if (e.key === 'Escape') {
        setSearch('')
        setSelectedIndex(0)
        ;(document.activeElement as HTMLElement)?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredPrompts, selectedIndex, navigate])

  useEffect(() => {
    cardRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedIndex])

  return (
    <div>
      <BackHomeButton />
      <h1 className="text-3xl font-bold mb-4">Prompt Library</h1>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts..."
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
        />
        <select
          value={collectionId}
          onChange={(e) => {
            setCollectionId(e.target.value)
            setSearchParams(e.target.value === 'All' ? {} : { collection: e.target.value })
          }}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
        >
          <option value="All">All categories</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
        >
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'Newest' | 'Oldest')}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
        >
          <option value="Newest">Sort: Newest</option>
          <option value="Oldest">Sort: Oldest</option>
        </select>
      </div>

      {filteredPrompts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No prompts match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.map((prompt, i) => (
            <PromptCard
              key={prompt.id}
              ref={(el) => (cardRefs.current[i] = el)}
              prompt={prompt}
              selected={i === selectedIndex}
            />
          ))}
        </div>
      )}
    </div>
  )
}
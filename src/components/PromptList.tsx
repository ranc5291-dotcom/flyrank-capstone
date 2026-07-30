import React, { useEffect, useMemo, useRef, useState } from 'react'
import usePrompts from '../hooks/usePrompts'
import useCollections from '../hooks/useCollections'
import FormField from './FormField'
import PromptCard from './PromptCard'

function useGridColumns() {
  const [cols, setCols] = useState(1)
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w >= 1024) setCols(3)
      else if (w >= 640) setCols(2)
      else setCols(1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return cols
}

export default function PromptList() {
  const { prompts } = usePrompts()
  const { collections } = useCollections()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | 'all'>('all')
  const [model, setModel] = useState<string | 'all'>('all')
  const [sort, setSort] = useState<'newest' | 'alpha'>('newest')

  const cols = useGridColumns()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const models = useMemo(() => {
    const set = new Set<string>()
    prompts.forEach((p) => { if (p.model) set.add(p.model) })
    return Array.from(set)
  }, [prompts])

  const filtered = useMemo(() => {
    let items = prompts.slice()
    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.tags.join(' ').toLowerCase().includes(q)
      )
    }
    if (category !== 'all') {
      items = items.filter((p) => (p.collectionId ?? 'Uncategorized') === category)
    }
    if (model !== 'all') {
      items = items.filter((p) => (p.model ?? 'any') === model)
    }
    if (sort === 'newest') items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (sort === 'alpha') items.sort((a, b) => a.title.localeCompare(b.title))
    return items
  }, [prompts, query, category, model, sort])

  cardRefs.current = cardRefs.current.slice(0, filtered.length)

  function handleGridKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index
    if (e.key === 'ArrowRight') next = index + 1
    else if (e.key === 'ArrowLeft') next = index - 1
    else if (e.key === 'ArrowDown') next = index + cols
    else if (e.key === 'ArrowUp') next = index - cols
    else return
    e.preventDefault()
    if (next >= 0 && next < filtered.length) {
      cardRefs.current[next]?.focus()
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
        <div className="flex-1">
          <FormField
            id="search"
            value={query}
            onChange={(e) => setQuery((e as any).target.value)}
            placeholder="Search prompts..."
            aria-label="Search prompts"
          />
        </div>

        <div className="mt-2 md:mt-0">
          <FormField
            id="filter-category"
            as="select"
            value={category}
            onChange={(e) => setCategory((e.target as HTMLSelectElement).value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {collections.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </FormField>
        </div>

        <div className="mt-2 md:mt-0">
          <FormField
            id="filter-model"
            as="select"
            value={model}
            onChange={(e) => setModel((e.target as HTMLSelectElement).value)}
            aria-label="Filter by model"
          >
            <option value="all">All models</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </FormField>
        </div>

        <div className="mt-2 md:mt-0">
          <FormField
            id="sort"
            as="select"
            value={sort}
            onChange={(e) => setSort((e.target as HTMLSelectElement).value as any)}
            aria-label="Sort prompts"
          >
            <option value="newest">Sort: Newest</option>
            <option value="alpha">Sort: A–Z</option>
          </FormField>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="grid">
        {filtered.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => { cardRefs.current[i] = el }}
            tabIndex={0}
            role="gridcell"
            onKeyDown={(e) => handleGridKeyDown(e, i)}
            className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <PromptCard prompt={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
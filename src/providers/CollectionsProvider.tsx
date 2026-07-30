import React, { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Category } from '../types/dashboard'

const STORAGE_KEY = 'apst_collections_v2'

const DEFAULT_COLLECTIONS: Category[] = [
  { id: uuid(), name: 'Resume', color: 'bg-indigo-500' },
  { id: uuid(), name: 'Interview', color: 'bg-pink-500' },
  { id: uuid(), name: 'LinkedIn', color: 'bg-sky-500' },
  { id: uuid(), name: 'Email', color: 'bg-amber-500' },
  { id: uuid(), name: 'Coding', color: 'bg-green-500' },
  { id: uuid(), name: 'Marketing', color: 'bg-purple-500' },
  { id: uuid(), name: 'Sales', color: 'bg-rose-500' },
  { id: uuid(), name: 'Education', color: 'bg-teal-500' },
  { id: uuid(), name: 'Content Writing', color: 'bg-orange-500' },
]

const COLORS = ['bg-indigo-500', 'bg-pink-500', 'bg-sky-500', 'bg-amber-500', 'bg-green-500', 'bg-purple-500', 'bg-rose-500', 'bg-teal-500', 'bg-orange-500']

type CollectionsContextType = {
  collections: Category[]
  addCollection: (name: string) => Category
  deleteCollection: (id: string) => void
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined)

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<Category[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as Category[]
    } catch (e) {
      // ignore
    }
    return DEFAULT_COLLECTIONS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections))
    } catch (e) {
      // ignore
    }
  }, [collections])

  function addCollection(name: string) {
    const trimmed = name.trim()
    const newCollection: Category = {
      id: uuid(),
      name: trimmed,
      color: COLORS[collections.length % COLORS.length],
    }
    setCollections((s) => [...s, newCollection])
    return newCollection
  }

  function deleteCollection(id: string) {
    setCollections((s) => s.filter((c) => c.id !== id))
  }

  return (
    <CollectionsContext.Provider value={{ collections, addCollection, deleteCollection }}>
      {children}
    </CollectionsContext.Provider>
  )
}

export function useCollectionsContext() {
  const ctx = useContext(CollectionsContext)
  if (!ctx) throw new Error('useCollectionsContext must be used within CollectionsProvider')
  return ctx
}
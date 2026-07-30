import React, { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Prompt, Activity } from '../types/dashboard'
import { mockPrompts } from '../lib/mockData'

const PROMPTS_KEY = 'apst_prompts_v1'
const ACTIVITY_KEY = 'apst_activity_v1'
const MAX_ACTIVITY = 20

type PromptsContextType = {
  prompts: Prompt[]
  activity: Activity[]
  addPrompt: (p: Prompt) => void
  updatePrompt: (id: string, patch: Partial<Prompt>) => void
  deletePrompt: (id: string) => void
  toggleFavorite: (id: string) => void
  setPrompts: (p: Prompt[]) => void
}

const PromptsContext = createContext<PromptsContextType | undefined>(undefined)

export function PromptsProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPromptsState] = useState<Prompt[]>(() => {
    try {
      const raw = localStorage.getItem(PROMPTS_KEY)
      if (raw) return JSON.parse(raw) as Prompt[]
    } catch (e) {
      // ignore
    }
    return mockPrompts
  })

  const [activity, setActivity] = useState<Activity[]>(() => {
    try {
      const raw = localStorage.getItem(ACTIVITY_KEY)
      if (raw) return JSON.parse(raw) as Activity[]
    } catch (e) {
      // ignore
    }
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts))
    } catch (e) {
      // ignore
    }
  }, [prompts])

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity))
    } catch (e) {
      // ignore
    }
  }, [activity])

  function logActivity(type: Activity['type'], promptId: string, title: string) {
    const entry: Activity = {
      id: uuid(),
      type,
      promptId,
      title,
      user: 'You',
      at: new Date().toISOString(),
    }
    setActivity((s) => [entry, ...s].slice(0, MAX_ACTIVITY))
  }

  function dedupeById(list: Prompt[]): Prompt[] {
    const map = new Map<string, Prompt>()
    for (const p of list) map.set(p.id, p)
    return Array.from(map.values())
}

function setPrompts(p: Prompt[]) {
    setPromptsState(dedupeById(p))
}

function addPrompt(p: Prompt) {
    setPromptsState((s) => dedupeById([p, ...s]))
    logActivity('create', p.id, p.title)
}

  function updatePrompt(id: string, patch: Partial<Prompt>) {
    setPromptsState((s) =>
      s.map((it) => (it.id === id ? { ...it, ...patch, updatedAt: new Date().toISOString() } : it))
    )
    const current = prompts.find((p) => p.id === id)
    logActivity('edit', id, patch.title ?? current?.title ?? 'Untitled')
  }

  function deletePrompt(id: string) {
    const current = prompts.find((p) => p.id === id)
    setPromptsState((s) => s.filter((it) => it.id !== id))
    if (current) logActivity('delete', id, current.title)
  }

  function toggleFavorite(id: string) {
    const current = prompts.find((p) => p.id === id)
    setPromptsState((s) => s.map((it) => (it.id === id ? { ...it, favorite: !it.favorite } : it)))
    if (current) logActivity('favorite', id, current.title)
  }

  return (
    <PromptsContext.Provider
      value={{ prompts, activity, addPrompt, updatePrompt, deletePrompt, toggleFavorite, setPrompts }}
    >
      {children}
    </PromptsContext.Provider>
  )
}

export function usePromptsContext() {
  const ctx = useContext(PromptsContext)
  if (!ctx) throw new Error('usePromptsContext must be used within PromptsProvider')
  return ctx
}
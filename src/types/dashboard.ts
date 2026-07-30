export interface PromptVersion {
  id: string
  promptId: string
  body: string
  createdAt: string
  author?: string
}

export interface Prompt {
  id: string
  title: string
  body: string
  tags: string[]
  collectionId?: string
  favorite: boolean
  createdAt: string
  model?: string
  versions?: PromptVersion[]
}

export interface Category {
  id: string
  name: string
  color?: string
  count?: number
}

export interface Activity {
  id: string
  type: 'edit' | 'create' | 'delete' | 'favorite'
  promptId?: string
  title?: string
  user?: string
  at: string
}

export interface DashboardStats {
  totalPrompts: number
  favorites: number
  collections: number
  recentEdits: number
}
export interface Prompt {
  id: string
  title: string
  body: string
  tags: string[]
  collectionId?: string
  favorite: boolean
  createdAt: string
  model?: string
  versions?: PromptVersion[]
  imported?: boolean
}
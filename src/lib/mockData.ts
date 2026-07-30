import type { Prompt, Activity, Category, DashboardStats } from '../types/dashboard'
import { v4 as uuid } from 'uuid'

const now = new Date().toISOString()

export const mockPrompts: Prompt[] = [
  {
    id: uuid(),
    title: 'Professional cold email for hiring',
    body: 'Write a short, professional cold email to reach out to a candidate about a product design role.',
    tags: ['email', 'hiring', 'sales'],
    model: 'gpt-4o',
    collectionId: undefined,
    favorite: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: uuid(),
    title: 'Refactor legacy React component',
    body: 'Describe step-by-step how to refactor a legacy React class component into functional components with hooks.',
    tags: ['react', 'refactor'],
    model: 'claude-2',
    collectionId: undefined,
    favorite: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: uuid(),
    title: 'Generate unit tests for utility functions',
    body: 'Produce Jest test cases for a set of utility functions handling dates and validation.',
    tags: ['testing', 'jest'],
    model: 'gemini-pro',
    collectionId: undefined,
    favorite: true,
    createdAt: now,
    updatedAt: now,
  },
]

export const mockCategories: Category[] = [
  { id: uuid(), name: 'Onboarding', color: 'bg-indigo-500', count: 12 },
  { id: uuid(), name: 'Sales', color: 'bg-pink-500', count: 8 },
  { id: uuid(), name: 'Engineering', color: 'bg-green-500', count: 25 },
]

export const mockActivity: Activity[] = [
  { id: uuid(), type: 'edit', promptId: mockPrompts[0].id, title: mockPrompts[0].title, user: 'You', at: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: uuid(), type: 'create', promptId: mockPrompts[1].id, title: mockPrompts[1].title, user: 'You', at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: uuid(), type: 'favorite', promptId: mockPrompts[2].id, title: mockPrompts[2].title, user: 'You', at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
]

export const mockStats: DashboardStats = {
  totalPrompts: mockPrompts.length,
  favorites: mockPrompts.filter((p) => p.favorite).length,
  collections: mockCategories.length,
  recentEdits: 3,
}

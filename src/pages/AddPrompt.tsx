import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import usePrompts from '../hooks/usePrompts'
import useCollections from '../hooks/useCollections'
import FormField from '../components/FormField'
import type { Prompt } from '../types/dashboard'
import BackHomeButton from '../components/BackHomeButton'

type FormValues = {
  title: string
  description: string
  category: string
  model: string
  tags: string
  prompt: string
}

export default function AddPrompt() {
  const { prompts, addPrompt, updatePrompt } = usePrompts()
  const { collections } = useCollections()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const editingPrompt = editId ? prompts.find((p) => p.id === editId) : undefined

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: 'Uncategorized',
      model: 'any',
      tags: '',
      prompt: '',
    }
  })

  useEffect(() => {
    if (editingPrompt) {
      reset({
        title: editingPrompt.title,
        description: '',
        category: editingPrompt.collectionId ?? 'Uncategorized',
        model: editingPrompt.model ?? 'any',
        tags: editingPrompt.tags.join(', '),
        prompt: editingPrompt.body,
      })
    }
  }, [editingPrompt, reset])

  async function onSubmit(data: FormValues) {
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, {
        title: data.title,
        body: data.prompt,
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        collectionId: data.category === 'Uncategorized' ? undefined : data.category,
        model: data.model === 'any' ? undefined : data.model,
      })
      navigate('/library')
      return
    }

    const now = new Date().toISOString()
    const newPrompt: Prompt = {
      id: uuid(),
      title: data.title,
      body: data.prompt,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      collectionId: data.category === 'Uncategorized' ? undefined : data.category,
      model: data.model === 'any' ? undefined : data.model,
      favorite: false,
      createdAt: now,
    }

    addPrompt(newPrompt)
    navigate('/library')
  }

  function handleFormKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    const target = e.target as HTMLElement
    if (e.key === 'Enter' && target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  return (
    <div className="max-w-3xl">
      <BackHomeButton />
      <h1 className="text-2xl font-semibold mb-4">{editingPrompt ? 'Edit Prompt' : 'Add Prompt'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <FormField id="title" {...register('title', { required: 'Title is required' })} />
          {errors.title && <div className="text-sm text-red-500 mt-1">{errors.title.message}</div>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <FormField id="description" {...register('description', { required: 'Description is required' })} />
          {errors.description && <div className="text-sm text-red-500 mt-1">{errors.description.message}</div>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <FormField id="category" as="select" {...register('category')}>
              <option>Uncategorized</option>
              {collections.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </FormField>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">AI Model</label>
            <FormField id="model" as="select" {...register('model')}>
              <option value="any">Any</option>
              <option value="gpt-4o">gpt-4o</option>
              <option value="claude-2">claude-2</option>
              <option value="gemini-pro">gemini-pro</option>
            </FormField>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <FormField id="tags" {...register('tags')} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <FormField id="prompt" as="textarea" {...register('prompt', { required: 'Prompt body is required' })} rows={6} />
          {errors.prompt && <div className="text-sm text-red-500 mt-1">{errors.prompt.message}</div>}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
            {editingPrompt ? 'Save Changes' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/library')} className="px-4 py-2 rounded-md border">Cancel</button>
        </div>
      </form>
    </div>
  )
}
import React, { useEffect, useState } from 'react'

type Post = {
  id: number
  title: string
  body: string
}

type Status = 'checking' | 'ok' | 'error'

export default function Health() {
  const [apiStatus, setApiStatus] = useState<Status>('checking')
  const [post, setPost] = useState<Post | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    async function checkHealth() {
      setLastUpdated(new Date().toLocaleString())
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
        if (!res.ok) throw new Error('Bad response')
        const data: Post = await res.json()
        if (!cancelled) {
          setPost(data)
          setApiStatus('ok')
        }
      } catch {
        if (!cancelled) setApiStatus('error')
      }
    }

    checkHealth()
    return () => {
      cancelled = true
    }
  }, [])

  const storageOk = (() => {
    try {
      const testKey = '__apst_storage_test__'
      localStorage.setItem(testKey, '1')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  })()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">System Health</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Live status check for AI Prompt Studio
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatusCard label="Application" ok status="Healthy" />
        <StatusCard
          label="API"
          ok={apiStatus === 'ok'}
          status={
            apiStatus === 'checking'
              ? 'Checking...'
              : apiStatus === 'ok'
              ? 'Online'
              : 'Offline'
          }
        />
        <StatusCard
          label="Storage"
          ok={storageOk}
          status={storageOk ? 'Available' : 'Unavailable'}
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Last updated: {lastUpdated}
      </p>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">
          Fetched Data — JSONPlaceholder Test
        </h2>
        {apiStatus === 'checking' && <p className="text-gray-500">Loading...</p>}
        {apiStatus === 'error' && (
          <p className="text-red-500">Failed to fetch test data.</p>
        )}
        {apiStatus === 'ok' && post && (
          <div>
            <p className="font-medium capitalize">{post.title}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{post.body}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusCard({
  label,
  ok,
  status,
}: {
  label: string
  ok: boolean
  status: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            ok ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="font-semibold">{status}</span>
      </div>
    </div>
  )
}
import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import './index.css'
import { PromptsProvider } from './providers/PromptsProvider'
import { CollectionsProvider } from './providers/CollectionsProvider'
import { AuthProvider } from './providers/AuthProvider'

export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem('apst_theme_v1')
    if (theme === 'dark') document.documentElement.classList.add('dark')
  }, [])

  return (
    <AuthProvider>
      <CollectionsProvider>
        <PromptsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </PromptsProvider>
      </CollectionsProvider>
    </AuthProvider>
  )
}
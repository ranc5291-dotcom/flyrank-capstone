import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const SIDEBAR_COLLAPSED_KEY = 'apst_sidebar_collapsed_v1'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  )

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />

        {/* CHANGED: overflow-hidden -> overflow-y-auto so pages like
            Dashboard scroll at the page level. Pages like AIWorkspace
            that need fixed-height + internal scrolling (chat window)
            still work — main's height stays bounded by flex-1 min-h-0,
            and their own inner overflow-y-auto div handles that scroll
            before main ever needs to. */}
        <main className="flex-1 min-w-0 min-h-0 flex flex-col p-6 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
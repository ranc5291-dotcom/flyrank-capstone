import React, { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

type Props = {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

type NavItem = {
  to: string
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    to: '/library',
    label: 'Prompt Library',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
  },
  {
    to: '/favorites',
    label: 'Favorites',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 17.3 6.2 20.5l1.1-6.5L2.5 9.3l6.6-1L12 2.5l2.9 5.8 6.6 1-4.8 4.7 1.1 6.5z" />
      </svg>
    ),
  },
  {
    to: '/add',
    label: 'Add Prompt',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    to: '/collections',
    label: 'Collections',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      </svg>
    ),
  },
  {
    to: '/imported',
    label: 'Imported',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
      </svg>
    ),
  },
  {
    to: '/health',
    label: 'Health',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    to: '/ai-workspace',
    label: 'AI Workspace',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM7.5 19.5 5 22l.75-3.25" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2 17.89l.06-.06c.35-.35.5-.84.33-1.32a1.65 1.65 0 0 0-.33-1.82L2.68 12.9a2 2 0 0 1 0-2.83l.06-.06c.35-.35.5-.84.33-1.32a1.65 1.65 0 0 0-.33-1.82L3.7 4.7A2 2 0 1 1 6.53 1.87l.06.06c.35.35.84.5 1.32.33a1.65 1.65 0 0 0 1.82-.33L12 1.1a2 2 0 0 1 2.83 0l.06.06c.35.35.84.5 1.32.33.55-.2 1.14-.02 1.51.33l1.02 1.02a2 2 0 1 1 2.83 2.83l-1.02 1.02c-.35.35-.5.84-.33 1.32.18.49.02 1.08-.33 1.42L19.4 15z"
        />
      </svg>
    ),
  },
]

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }: Props) {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState(0)

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(focusedIndex + 1, NAV_ITEMS.length - 1)
      setFocusedIndex(next)
      itemRefs.current[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(focusedIndex - 1, 0)
      setFocusedIndex(prev)
      itemRefs.current[prev]?.focus()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = NAV_ITEMS[focusedIndex]
      if (item) {
        navigate(item.to)
        onClose()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:static lg:translate-x-0 transition-all duration-200 ease-in-out ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="h-full flex flex-col relative">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex items-center justify-center absolute -right-3 top-6 w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 z-10"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          className={`px-4 py-6 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-md shrink-0" />
          {!collapsed && <div className="text-lg font-semibold truncate text-gray-900 dark:text-gray-100">AI Prompt Studio</div>}
        </div>

        <nav className="p-4 flex-1 overflow-y-auto" onKeyDown={handleKeyDown}>
          <div className="space-y-1">
            {NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                ref={(el) => { itemRefs.current[i] = el }}
                onFocus={() => setFocusedIndex(i)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                    collapsed ? 'justify-center' : ''
                  } ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''}`
                }
              >
                {item.icon}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                collapsed ? 'justify-center' : ''
              }`}
              title={collapsed ? 'Logout' : undefined}
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                />
              </svg>
              {!collapsed && <span className="truncate">Logout</span>}
            </button>
          ) : (
            <NavLink
              to="/login"
              title={collapsed ? 'Login' : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                  collapsed ? 'justify-center' : ''
                } ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''}`
              }
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
                />
              </svg>
              {!collapsed && <span className="truncate">Login</span>}
            </NavLink>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="w-full text-left text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            aria-label="Close sidebar"
          >
            Close
          </button>
        </div>
      </div>
    </aside>
  )
}
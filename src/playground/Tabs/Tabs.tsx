import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

interface TabsContextValue {
  activeId: string
  setActiveId: (id: string) => void
  baseId: string
  registerTab: (id: string, node: HTMLButtonElement | null) => void
  tabOrder: string[]
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(componentName: string): TabsContextValue {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error(`${componentName} must be used inside <Tabs>`)
  }
  return context
}

interface TabsProps {
  defaultTabId: string
  children: ReactNode
}

/**
 * Tabs implementing the WAI-ARIA APG "Tabs" pattern (automatic activation
 * would also be valid; this implements the more common manual-activation
 * variant with arrow-key navigation).
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Roles/attributes: tablist / tab / tabpanel, aria-selected, aria-controls,
 * aria-labelledby, roving tabindex (only the active tab is in the Tab order).
 * Keyboard: ArrowLeft/ArrowRight move and activate, Home/End jump to first/last.
 */
export function Tabs({ defaultTabId, children }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId)
  const baseId = useId()
  const tabNodesRef = useRef<Map<string, HTMLButtonElement>>(new Map())
  const tabOrderRef = useRef<string[]>([])

  function registerTab(id: string, node: HTMLButtonElement | null) {
    if (node) {
      tabNodesRef.current.set(id, node)
      if (!tabOrderRef.current.includes(id)) tabOrderRef.current.push(id)
    } else {
      tabNodesRef.current.delete(id)
      tabOrderRef.current = tabOrderRef.current.filter((tabId) => tabId !== id)
    }
  }

  const value: TabsContextValue = {
    activeId,
    setActiveId,
    baseId,
    registerTab,
    tabOrder: tabOrderRef.current,
  }

  return (
    <TabsContext.Provider value={value}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabListProps {
  label: string
  children: ReactNode
}

export function TabList({ label, children }: TabListProps) {
  const { activeId, setActiveId, tabOrder, registerTab } = useTabsContext('TabList')
  const tabNodesRef = useRef<Map<string, HTMLButtonElement>>(new Map())

  function focusAndActivate(id: string) {
    setActiveId(id)
    tabNodesRef.current.get(id)?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const order = tabOrder
    const currentIndex = order.indexOf(activeId)
    if (currentIndex === -1) return

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault()
        const next = order[(currentIndex + 1) % order.length]
        focusAndActivate(next)
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        const prev = order[(currentIndex - 1 + order.length) % order.length]
        focusAndActivate(prev)
        break
      }
      case 'Home': {
        event.preventDefault()
        focusAndActivate(order[0])
        break
      }
      case 'End': {
        event.preventDefault()
        focusAndActivate(order[order.length - 1])
        break
      }
    }
  }

  // Wrap registerTab so this component keeps its own ref map for focusing,
  // while still registering with the shared context for order/keyboard nav.
  function wrappedRegister(id: string, node: HTMLButtonElement | null) {
    if (node) tabNodesRef.current.set(id, node)
    else tabNodesRef.current.delete(id)
    registerTab(id, node)
  }

  return (
    <div role="tablist" aria-label={label} onKeyDown={handleKeyDown} className="flex gap-1 border-b border-gray-200">
      <TabListRegisterContext.Provider value={wrappedRegister}>{children}</TabListRegisterContext.Provider>
    </div>
  )
}

// Internal context so <Tab> can register with TabList's local node map too,
// without prop-drilling through every child.
const TabListRegisterContext = createContext<
  (id: string, node: HTMLButtonElement | null) => void
>(() => {})

interface TabProps {
  id: string
  children: ReactNode
}

export function Tab({ id, children }: TabProps) {
  const { activeId, setActiveId, baseId } = useTabsContext('Tab')
  const registerWithList = useContext(TabListRegisterContext)
  const isSelected = activeId === id

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${id}`}
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${id}`}
      tabIndex={isSelected ? 0 : -1}
      ref={(node) => registerWithList(id, node)}
      onClick={() => setActiveId(id)}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSelected
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

interface TabPanelProps {
  id: string
  children: ReactNode
}

export function TabPanel({ id, children }: TabPanelProps) {
  const { activeId, baseId } = useTabsContext('TabPanel')
  if (activeId !== id) return null

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${id}`}
      aria-labelledby={`${baseId}-tab-${id}`}
      tabIndex={0}
      className="p-4 focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {children}
    </div>
  )
}

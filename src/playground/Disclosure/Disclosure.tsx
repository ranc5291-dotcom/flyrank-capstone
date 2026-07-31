import { useId, useState, type ReactNode } from 'react'

interface DisclosureProps {
  summary: string
  children: ReactNode
  defaultExpanded?: boolean
}

/**
 * Disclosure implementing the WAI-ARIA APG "Disclosure (Show/Hide)" pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * A native <button> is used as the trigger, so Space/Enter activation and
 * Tab focusability come from the browser for free — no keydown handler
 * needed for that part. The only ARIA involved is aria-expanded on the
 * button and aria-controls pointing at the content region.
 */
export function Disclosure({ summary, children, defaultExpanded = false }: DisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const contentId = useId()

  return (
    <div className="border border-gray-200 rounded-md">
      <h3>
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span>{summary}</span>
          <span aria-hidden="true" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>
      </h3>
      {isExpanded && (
        <div id={contentId} className="px-4 pb-3 text-sm text-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

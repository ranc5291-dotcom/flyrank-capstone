import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  titleId: string
  title: string
  children: ReactNode
}

// Selector for elements that can receive keyboard focus.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Modal dialog implementing the WAI-ARIA APG "Dialog (Modal)" pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Behaviors implemented by hand (none of this comes from a library):
 * - role="dialog" + aria-modal="true" + aria-labelledby
 * - Focus moves into the dialog on open (to the first focusable element)
 * - Focus is trapped inside the dialog while open (Tab / Shift+Tab wrap)
 * - Escape closes the dialog
 * - Focus returns to the element that opened the dialog, on close
 * - Rendered via a portal directly under <body>, as a sibling of #root, so
 *   the rest of the app (#root) can be hidden from assistive tech without
 *   ever hiding the dialog itself (which would otherwise contain focus).
 */
export function Modal({ isOpen, onClose, titleId, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerElementRef = useRef<HTMLElement | null>(null)

  // Remember what had focus before the dialog opened, so we can restore it.
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null
    }
  }, [isOpen])

  // Move focus into the dialog when it opens; restore focus when it closes.
  useEffect(() => {
    if (!isOpen) return

    const dialogNode = dialogRef.current
    if (!dialogNode) return

    const focusables = dialogNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    const firstFocusable = focusables[0] ?? dialogNode
    firstFocusable.focus()

    return () => {
      triggerElementRef.current?.focus()
    }
  }, [isOpen])

  // Hide the rest of the app from assistive tech while the dialog is open
  // (safe now: the dialog itself renders outside #root, via the portal
  // below, so this never hides the currently-focused element), and lock
  // scroll on the body.
  useEffect(() => {
    if (!isOpen) return

    const root = document.getElementById('root')
    const previousAriaHidden = root?.getAttribute('aria-hidden')
    root?.setAttribute('aria-hidden', 'true')

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      if (previousAriaHidden === null || previousAriaHidden === undefined) {
        root?.removeAttribute('aria-hidden')
      } else {
        root?.setAttribute('aria-hidden', previousAriaHidden)
      }
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }

    if (event.key !== 'Tab') return

    const dialogNode = dialogRef.current
    if (!dialogNode) return

    const focusables = Array.from(
      dialogNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    )
    if (focusables.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (event.shiftKey) {
      if (active === first || !dialogNode.contains(active)) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (active === last || !dialogNode.contains(active)) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      // Clicking the overlay (not the dialog itself) closes it, same as Escape.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl outline-none"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
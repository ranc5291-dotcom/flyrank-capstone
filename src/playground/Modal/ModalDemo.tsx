import { useId, useState } from 'react'
import { Modal } from './Modal'

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()

  return (
    <section aria-labelledby="modal-demo-heading" className="space-y-3">
      <h2 id="modal-demo-heading" className="text-xl font-bold">
        Modal Dialog
      </h2>
      <p className="text-sm text-gray-600">
        Open the dialog, then press Tab / Shift+Tab to confirm focus stays
        trapped inside, and Escape to close and return focus to this button.
      </p>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Open modal
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} titleId={titleId} title="Delete prompt?">
        <p className="mb-4 text-sm text-gray-700">
          This action can't be undone. This will permanently delete the
          selected prompt from your library.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Delete
          </button>
        </div>
      </Modal>
    </section>
  )
}

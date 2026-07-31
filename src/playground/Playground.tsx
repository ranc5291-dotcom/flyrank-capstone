import { ModalDemo } from './Modal/ModalDemo'
import { TabsDemo } from './Tabs/TabsDemo'
import { DisclosureDemo } from './Disclosure/DisclosureDemo'

export function Playground() {
  return (
    <main className="mx-auto max-w-2xl space-y-10 p-8">
      <div>
        <h1 className="text-2xl font-bold">Accessible Component Playground</h1>
        <p className="mt-1 text-sm text-gray-600">
          Three components built from scratch against the WAI-ARIA Authoring
          Practices patterns. No component libraries. Test each one with
          keyboard only: Tab, Shift+Tab, Enter, Space, Escape, and arrow
          keys where noted.
        </p>
      </div>
      <ModalDemo />
      <TabsDemo />
      <DisclosureDemo />
    </main>
  )
}

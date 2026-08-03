import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

export function ShadcnComparison() {
  return (
    <main className="mx-auto max-w-2xl space-y-10 p-8">
      <div>
        <h1 className="text-2xl font-bold">shadcn/ui Comparison</h1>
        <p className="mt-1 text-sm text-gray-600">
          Same two widgets, built by copying shadcn's dialog and tabs source
          (Radix UI underneath) instead of writing them by hand. See NOTES.md
          for the diff against the playground versions.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Dialog (shadcn)</h2>
        <Dialog>
          <DialogTrigger className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
            Open dialog
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete prompt?</DialogTitle>
              <DialogDescription>
                This action can't be undone. This will permanently delete the
                selected prompt from your library.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500">
                Cancel
              </DialogClose>
              <DialogClose className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500">
                Delete
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Tabs (shadcn)</h2>
        <Tabs defaultValue="prompts">
          <TabsList>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="prompts">
            <p className="text-sm">Your saved prompts show up here.</p>
          </TabsContent>
          <TabsContent value="collections">
            <p className="text-sm">Prompts grouped into collections show up here.</p>
          </TabsContent>
          <TabsContent value="favorites">
            <p className="text-sm">Starred prompts show up here.</p>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
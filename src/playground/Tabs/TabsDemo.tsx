import { Tab, TabList, TabPanel, Tabs } from './Tabs'

export function TabsDemo() {
  return (
    <section aria-labelledby="tabs-demo-heading" className="space-y-3">
      <h2 id="tabs-demo-heading" className="text-xl font-bold">
        Tabs
      </h2>
      <p className="text-sm text-gray-600">
        Click a tab, then use ArrowLeft / ArrowRight / Home / End to move
        between tabs without leaving the tab row (roving tabindex).
      </p>
      <Tabs defaultTabId="prompts">
        <TabList label="Prompt library sections">
          <Tab id="prompts">Prompts</Tab>
          <Tab id="collections">Collections</Tab>
          <Tab id="favorites">Favorites</Tab>
        </TabList>
        <TabPanel id="prompts">
          <p>Your saved prompts show up here.</p>
        </TabPanel>
        <TabPanel id="collections">
          <p>Prompts grouped into collections show up here.</p>
        </TabPanel>
        <TabPanel id="favorites">
          <p>Starred prompts show up here.</p>
        </TabPanel>
      </Tabs>
    </section>
  )
}

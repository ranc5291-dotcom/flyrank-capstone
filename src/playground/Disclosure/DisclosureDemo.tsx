import { Disclosure } from './Disclosure'

export function DisclosureDemo() {
  return (
    <section aria-labelledby="disclosure-demo-heading" className="space-y-3">
      <h2 id="disclosure-demo-heading" className="text-xl font-bold">
        Disclosure
      </h2>
      <p className="text-sm text-gray-600">
        Tab to the button and press Enter or Space to toggle it. Notice
        aria-expanded flips and the content region is only in the DOM while
        expanded.
      </p>
      <div className="space-y-2">
        <Disclosure summary="What model does this prompt use?">
          <p>This prompt is configured to run against Claude Sonnet by default, but you can override the model per-run.</p>
        </Disclosure>
        <Disclosure summary="Can I share this collection with teammates?">
          <p>Team workspaces are on the roadmap. For now, collections are private to your account.</p>
        </Disclosure>
      </div>
    </section>
  )
}

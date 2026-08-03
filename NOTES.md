# NOTES — hand-built vs shadcn/ui

## Setup note (read this first)

`npx shadcn init` / `shadcn add` fetch their registry from `ui.shadcn.com`,
which this sandbox's network policy blocks (`host_not_allowed`). shadcn's
dialog and tabs components are themselves thin Tailwind-styled wrappers
around `@radix-ui/react-dialog` and `@radix-ui/react-tabs` — both real npm
packages, reachable here. So instead of running the CLI, I installed those
Radix packages directly and hand-wrote `src/components/ui/dialog.tsx` and
`tabs.tsx` against their actual (installed, type-checked) API — the same
files the CLI would have dropped in. If you run this in an environment
where `ui.shadcn.com` is reachable, `npx shadcn add dialog tabs` will
overwrite these with the canonical versions; the diff below should still
hold since both wrap the same Radix primitives.

## Modal vs shadcn Dialog

My hand-built modal (`playground/Modal/Modal.tsx`) gets the ARIA Authoring
Practices basics right — `role="dialog"`, `aria-modal`, `aria-labelledby`,
Tab-trapping via a hand-rolled focusable-elements query, Escape to close,
and focus restoration on close. But comparing it against what
`@radix-ui/react-dialog` (which shadcn's `Dialog` wraps) actually does
under the hood surfaced gaps I wouldn't have thought of without reading it:

1. **No portal — my dialog originally rendered in place in the React
   tree.** Radix's `DialogContent` renders into a `Portal` appended near
   `document.body`. Mine rendered wherever `<Modal>` sat in the component
   tree — which meant it was a *descendant* of `#root`, the same element
   my other effect sets `aria-hidden="true"` on to hide the background
   from screen readers while the dialog is open. Chrome caught this at
   runtime: `Blocked aria-hidden on an element because its descendant
   retained focus` — I was trying to accessibility-hide the very element
   that held focus. Radix avoids this by construction: the dialog content
   is portaled outside `#root` before the background ever gets hidden, so
   the two operations can never collide. I fixed mine the same way
   (`createPortal(..., document.body)`) once the browser told me why it
   was wrong — this is exactly the kind of gap that's invisible reading
   the code and only shows up as a live console warning.

2. **My scroll lock causes layout shift; Radix's doesn't.**
   I lock background scroll with `document.body.style.overflow = 'hidden'`.
   That's enough to stop scrolling, but on any page with a vertical
   scrollbar, hiding overflow removes the scrollbar and the page content
   shifts right by the scrollbar's width for as long as the dialog is
   open — a visible jump. Radix uses `react-remove-scroll`, which locks
   scroll *and* compensates with padding so nothing shifts, and also
   handles touch-scroll on iOS, which `overflow: hidden` alone doesn't
   reliably block.

3. **My focus trap is a single flat keydown handler; Radix's is a layered
   dismissable-layer stack.** My Escape/Tab handling assumes there's only
   ever one thing on top. If I opened a second overlay (a confirm popover,
   a select dropdown) from inside my modal, Escape would close both or
   fight over which one owns Tab-wrapping — I never built anything to
   stop propagation between layered overlays. Radix's `DismissableLayer`
   maintains a layer stack so the top-most one intercepts Escape and
   outside-clicks first.

4. **No exit animation.** Mine does `if (!isOpen) return null` — the
   dialog disappears the instant `isOpen` flips, with no transition.
   Radix exposes `data-state="open" | "closed"` on content/overlay via a
   `Presence` component that keeps the node mounted just long enough to
   run an exit animation before actually removing it from the DOM. shadcn's
   generated CSS classes (`data-[state=closed]:animate-out` etc.) hook
   directly into that.

## Tabs vs shadcn Tabs

My hand-built tabs (`playground/Tabs/Tabs.tsx`) implement the manual-
activation APG pattern correctly for the common case: `tablist`/`tab`/
`tabpanel` roles, `aria-selected`, `aria-controls`/`aria-labelledby`
pairing, and roving `tabindex` driven by ArrowLeft/ArrowRight/Home/End.
Two gaps against `@radix-ui/react-tabs`:

5. **Hard-coded to horizontal, left-to-right.** I only listen for
   `ArrowLeft`/`ArrowRight`. Radix's `Tabs.Root` takes an `orientation`
   prop (`horizontal` | `vertical`) that remaps the active keys to
   ArrowUp/ArrowDown for a vertical tab list, and also reads `dir` from
   context to flip Left/Right in RTL layouts. The APG pattern actually
   requires this — arrow-key direction should match visual layout — and I
   just didn't handle it because my demo only needed one orientation.

6. **No activation-mode choice.** My tabs always activate on arrow-move
   (I call `setActiveId` the moment focus moves). Radix's
   `activationMode="manual"` option lets the tab receive focus on arrow
   press *without* activating its panel until Enter/Space — useful when
   switching tabs is expensive (e.g., re-fetching data per tab). I only
   built the "automatic activation" behavior and didn't realize it was a
   choice, not the only correct option, until reading Radix's props.

## Takeaway

Both of my components pass the APG pattern's *minimum* keyboard/ARIA
requirements, which is what the AI Authoring Practices checklist is
actually grading. What I missed wasn't roles or keys — it was the stuff
that only shows up once a component has to survive being embedded in a
real, messy app: nested overlays, scrollbars, RTL, animation, and layout
contexts outside the component's control. That's a good argument for
building the primitives once and reviewing them carefully, rather than
either (a) hand-rolling every dialog/tabs instance in a real app or (b)
trusting an AI-generated component without checking it against the APG
pattern and something battle-tested like Radix.
---
'@jig-ui/react': minor
---

Tabs, Textarea, and a leading icon for fields.

**New: `Tabs`, `TabList`, `Tab` and `TabPanel`.** Four parts rather than an
inferred list, because naming the list is what leaves room for content that is
neither a tab nor a panel — a menu, a persistent message. `Tabs` itself draws
nothing: no layout, no spacing, no border. It is a behavioural wrapper, and
anything inside it that is not a `TabList` or a `TabPanel` renders where you
wrote it.

Activation is manual — arrow keys move focus, <kbd>Enter</kbd> or
<kbd>Space</kbd> selects — and focus loops at the ends. Both are Base UI's
defaults, fixed rather than exposed. `orientation` takes `'horizontal'` (the
default) or `'vertical'`, and decides which arrow keys move focus.

The active tab is marked by a sliding underline, and a `TabList` that overflows
scrolls rather than wraps. The indicator is a child of the scroller, so it
scrolls with the tabs without a scroll listener.

```tsx
<Tabs defaultValue="usage">
  <TabList aria-label="Component docs">
    <Tab value="usage">Usage</Tab>
    <Tab value="props" end={<Token>12</Token>}>Props</Tab>
  </TabList>
  <TabPanel value="usage">…</TabPanel>
  <TabPanel value="props">…</TabPanel>
</Tabs>
```

`Tab` takes `start` and `end` for an icon, a token or a count. Both are
**non-interactive** and render inside the tab's own `<button>` — which is the
difference from `ListItem`, where `end` sits outside the row's control and may
hold a button of its own.

**New: `Textarea`.** Styled as `Input` is, and sized so that a one-line
`Textarea` is exactly as tall as an `Input` beside it — 27.04 / 38.55 / 42.40px
at the three sizes, measured rather than eyeballed. It takes the same `label`,
`description`, `error`, `size` and `disabled` props, and the same rule that
`className` and `style` land on the field wrapper while everything else reaches
the control.

It grows with its value through **`field-sizing: content`**. `lines` sets the
floor and defaults to 3; `maxLines` caps it, and is unset by default.

```tsx
<Textarea label="Release note" lines={3} maxLines={12} />
```

Both ends of the envelope are one control height plus a line for each line
after the first, so `lines={1}` really is an `Input`'s height.

`rows` and `cols` are **not** part of the API. `field-sizing: content` makes
them inert — they would type-check, read correctly and do nothing — so `lines`
is the only way in. `size` is omitted for the reason it is omitted on `Input`:
the native attribute means something else.

Note the browser support this buys and costs: `field-sizing` is Baseline as of
June 2026 (Chrome 123, Safari 26.2, Firefox 152). Jig takes it natively with no
JavaScript fallback, on the same terms as CSS anchor positioning.

**`resize: vertical` is always on, and the drag wins.** Dragging the grip writes
an inline height, and an explicit height re-imposes fixed sizing — so the first
drag ends the automatic growth for that field, permanently. That is deliberate:
someone who drags a field to a height has said what they want. The drag is
still clamped by `lines` and `maxLines`, so it cannot leave the envelope.

**New: `icon` on `Input` and `Textarea`.** A decorative glyph on the leading
edge, from the curated set, sized and placed by the field rather than the
caller — the way `Button` already sizes its own icon. Leading edge only; there
is no `iconPosition`.

```diff
- <Input label="Search" placeholder="Search issues" />
+ <Input label="Search" placeholder="Search issues" icon="magnifying-glass" />
```

The icon is laid over the control rather than sharing a flex row with it, so
the `<input>` and `<textarea>` stay the bordered box. Two things follow that a
wrapper would have cost: the resize grip sits in the real corner instead of one
padding step inside the border, and `Input`'s existing border, hover, focus,
invalid and disabled rules are untouched. On a `Textarea` the glyph aligns to
the **first line** rather than the middle of the box, so it stays put as the
field grows.

It is `aria-hidden` and `pointer-events: none` — it labels the field visually
and does not replace `label`, which is still where the accessible name comes
from.

Fixes: `SideNavSection`'s heading was indented to `spacing.500` while the rows
beneath it sit at `spacing.300`, so the label that named a section hung further
from the edge than the items in it. The heading now sits at `spacing.300` and
aligns with them, and has moved from `caption01` to `caption02` so it is not
out-weighed by the rows it labels. Each section's list also carries a bottom
margin, so adjacent sections are no longer flush.

No token changes. Both components compose `size.control.*`, `color.control.*`,
`spacing`, `radius.400` and `type.body01` as they stand.

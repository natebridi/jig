# @jig-ui/react

## 0.2.0

### Minor Changes

- eb891ee: Foundations pass ahead of growing the component set. Breaking, and deliberately
  so while the package is `0.x`.
  
  **React 19 is now the minimum.** Components take `ref` as an ordinary prop, so
  there are no `forwardRef` wrappers. Every component forwards a ref to its
  rendered element, including through `as`.
  
  **`as` is restricted per component.** It previously accepted any
  `ElementType` while the props, event types and ref stayed fixed to
  `HTMLElement` — so `as="a"` never actually exposed anchor props. Each component
  now names the elements it can legitimately render (`StackElement`,
  `TypographyElement`, `AdornElement`).
  
  **Fluid type is gone.** `Typography` had two competing size models: semantic
  `with="heading01"` presets and independent `sizeMin`/`sizeMax`. `with` is now
  the only size driver. Remove `sizeMin`/`sizeMax`; the `.fluid-type` class and
  its custom properties no longer exist.
  
  **`Adorn` is semantic colour only.** `semibold`, `bold` and `italic` are
  removed — use `as="strong"`, `as="b"`, `as="em"`, `as="i"`, which carry the
  meaning as well as the styling. `muted`, `accent` and `danger` are now
  implemented (they previously produced no styles) and backed by new
  `--color-text-muted` / `-accent` / `-danger` tokens.
  
  **`maxWidth` no longer centres.** It silently applied `margin-inline: auto`.
  Add the explicit `centered` prop where you want that.
  
  **`Grid columns` no longer accepts arbitrary numbers.** `columns={13}` used to
  type-check and then produce no class at all; the prop is now the 1–12 union.
  
  **CSS now ships in cascade layers**, declared as
  `@layer jig.reset, jig.tokens, jig.base, jig.components`. Unlayered consumer CSS
  beats all of it regardless of specificity, so overriding a token no longer means
  out-specifying `:root[data-theme="dark"]`. Both `styles.css` and `reset.css`
  state the order, so import order does not change the cascade.
  
  If you previously relied on the reset outranking Jig's component styles, it no
  longer does — `jig.reset` is the lowest layer.
  
  **The base stylesheet no longer restyles your app.** A global
  `:focus-visible` rule applied to every focusable element in the consuming
  document; the focus ring is now carried by Jig's own components.
  
  **The reset no longer overrides component typography.** It sits in the lowest
  layer, so `<Typography as="h1" with="heading01">` keeps its preset instead of
  being flattened to `font-size: inherit` by the reset's `h1..h6, p` rule.
  
  **`Stack` gains a `justify` prop.**
  
  Fixes: `CodeBlock`'s copy control was a `ToggleButton`, giving it a wrong
  `aria-pressed` and no accessible name — it is now an `IconButton` whose label
  changes on success, with a live region for the announcement. `Tooltip` now
  honours `event.defaultPrevented` from the trigger's own handlers. `Button`
  defaults to `type="button"`. Consumer props can no longer overwrite attributes a
  component owns.
  
  Internal: the published stylesheet is 58% smaller (135KB → 57KB) after
  deduplicating token declarations that did not vary by theme.
- f390c1f: Tabs, Textarea, and a leading icon for fields.
  
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
- 049a97d: Eighteen new components and the token groups behind them. Breaking in places,
  and deliberately so while the package is `0.x`.
  
  **New components.** `Input`, `Combobox`, `Slider` and `ToggleButtonGroup` for
  form controls; `Dialog`, `ScrollArea` and `Separator` for structure; `Box` for
  layout; `Collapsible` for disclosure; `Link` and `Token`; `ListItem`, `SideNav`
  and `SideNavSection` for navigation; and `StructuredList` with
  `StructuredListRow` and `StructuredListCell` for tabular layout. `Icon` is now
  exported from the root entry as well as from `@jig-ui/react/icons` — both
  specifiers resolve to the same chunk, so neither is cheaper than the other.
  
  **Breaking: `Box` no longer takes dimension props.** `width`, `height`,
  `minHeight`, `maxWidth` and `centered` are gone, along with the `BoxSizeProps`
  type. Box dimensions go through `style`, which is now the rule across the
  system — only `Stack`, `Grid` and `Typography` take spacing props, and nothing
  takes size props.
  
  ```diff
  - <Box maxWidth="40rem" centered />
  + <Box style={{ maxWidth: '40rem', marginInline: 'auto' }} />
  ```
  
  **Breaking: the grid is 24 columns, and `columns` accepts only its divisors.**
  `GridColumns` is now `1 | 2 | 3 | 4 | 6 | 8 | 12 | 24`, so tracks always come
  out whole. This supersedes the "the prop is now the 1–12 union" line in the
  preceding changeset: `columns={5}`, `{7}`, `{9}`, `{10}` and `{11}` no longer
  type-check.
  
  **Breaking: primary and secondary buttons are warm, with a new relationship.**
  Primary was blue at `blue.450`; it is now the page's own ink, `warm.600` in
  light and `warm.100` in dark. Secondary moved the other way — from a mid-tone
  fill with light text to a quiet light fill with ink text — because with both
  variants on one hue, weight rather than colour is what separates them.
  
  That change also fixes an accessibility failure. The light secondary button had
  been shipping at **4.35:1**, below WCAG AA's 4.5:1 for text at Button's size;
  it is now **10.37:1**. The cause was structural rather than a bad value: every
  variant sat at the same positions on its own hue's ramp, and identical ramp
  positions do not produce identical contrast because the ramps differ in chroma.
  Warm is the least chromatic hue, so it landed lowest. Button colours are now
  written out per variant instead of generated from a shared mapping.
  
  **New token groups.** `elevation` (`lo`, `med`, `hi`, themed — a shadow needs
  more opacity on a dark page than a light one); `size.control` for the height
  bordered controls share with Button, and `size.dialog`; per-hue `color.token.*`
  fills; `color.scrollbar.*` and `color.slider.*`; and `color.line`, which is
  deliberately separate from `color.control.border` so a divider and a field
  border can be retuned apart.
  
  **New `code01` type preset.** The mono family at `body01`'s scale step, weight
  and line-height, so a monospaced value sits on the same rhythm as the prose
  beside it. Same nominal size rather than an optically compensated one, which
  was measured rather than assumed: at 15.52px Work Sans has an x-height of
  7.76px against Source Code Pro's 7.54px.
  
  Fixes: the Combobox popup had no maximum height whenever Base UI had not yet
  measured the available space — `max-height: min(20rem, var(--available-height))`
  has no fallback, so the whole declaration was dropped and a long list could run
  off the screen instead of scrolling. That reference and two others now carry
  fallbacks.

---
'@jig-ui/react': minor
---

Foundations pass ahead of growing the component set. Breaking, and deliberately
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

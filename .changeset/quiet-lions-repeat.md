---
'@jig-ui/react': minor
---

Eighteen new components and the token groups behind them. Breaking in places,
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

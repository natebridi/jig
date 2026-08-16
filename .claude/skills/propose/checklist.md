# Jig decision checklist

Walk this before writing a proposal. Most lines resolve to "follows precedent" —
those go in the **Already settled by precedent** list, not into a decision block.
Only the lines with a genuine fork become decisions.

## Tokens

- Does this need new tokens, or does it compose existing ones?
- If new: primitive or semantic? Primitives live in `packages/tokens/src/primitives/`,
  semantics in `packages/tokens/src/semantics/`. A component-specific colour set is a
  semantic (see `color.button.*`), never a primitive.
- Spacing is a computed ratio ramp (`primitives/spacing.ts`, 1.618, steps 100–900).
  Adding an off-ramp value is a real decision and needs an argument.
- Type styles are composed through the `textStyle()` helper in `semantics/type.ts` —
  family, weight, scale step, line-height. Do not hand-roll a size.
- New tokens must pass `packages/tokens/src/validate.ts` and be DTCG-shaped.
- Token IDs are kebab-case at source; the build camelCases them for `.css.ts`.

## Sizing

- Does the component take a `size` prop? If so it must be `sm | md | lg`, matching
  `ButtonSize`.
- **Does it share a control height with other interactive controls?** `Button` currently
  derives its size from padding alone, so there is no shared control-height ramp. Any
  component that sits inline with a Button (input, select, chip) has to either establish
  that ramp or explicitly opt out. This is usually a real decision.
- Icon sizing is owned by the parent component, not the caller — see `buttonIconSize`.

## Variants and states

- Variant/emphasis names should reuse the existing vocabulary before inventing one:
  `primary | secondary | danger | ghost`.
- State colour tokens follow the `baseBg / hoverBg / activeBg / disabledBg / text /
  disabledText` shape established by `color.button.*`. New states (`selected`,
  `invalid`, `readonly`, `checked`) extend that shape rather than renaming it — and
  adding one to the shared vocabulary is a decision worth showing.
- **Focus treatment depends on whether the component draws a border.** A component that
  already has an outline of its own — input, select, combobox, textarea, any field-like
  control — highlights *that border* on focus (`color.control.active-border`) and does
  **not** spread `focusRing`. A component with no border of its own — button, link,
  toggle — gets the ring from `focusRing` in `packages/components/src/focus-ring.ts`.
  Never both: a text input matches `:focus-visible` on click as well as on keyboard
  focus, so spreading the ring onto a bordered control double-paints the focus state.
  Decided in `0002-text-input.html` D4.

## API surface

- Polymorphic `as`: layout and typography components only, via the shared
  `PolymorphicProps` utility in `polymorphic.ts`. Everything else takes a fixed element.
- Spacing props: `Stack`, `Grid` and `Typography` only, via the margin/padding Sprinkles
  with hand-declared prop types. Other components get spacing from their parent, and box
  dimensions go through `style`, not props.
- Refs forward and are typed to the rendered element (`refs.test.tsx` enforces this).
- Responsive props go through `breakpoints.ts` / `responsive.ts` conditions.

## Behaviour

- Overlays use native CSS anchor positioning and the Popover API. No positioning
  library, no fallbacks.
- Theming is `:root`-scoped. Nested or subtree theming is out of scope — do not
  propose it as an option.
- Keyboard model and ARIA roles: state them explicitly, and cite the APG pattern
  being followed.

## Files a component ships

```
packages/components/src/<name>/
  <name>.tsx
  <name>.css.ts
  <name>.stories.tsx
  <name>.test.tsx
  index.ts
```

Plus an export from `packages/components/src/index.ts`. Repo-wide guards that will
catch a miss: `api.types.test.tsx`, `refs.test.tsx`, `stylesheet.test.ts`.

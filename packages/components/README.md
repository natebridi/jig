# @jig-ui/react

React components for the Jig design system.

Ships as plain ESM plus a stylesheet — no Vanilla Extract, PostCSS, or other
build tooling is required in the consuming project.

## Install

```sh
npm install @jig-ui/react
```

`react` and `react-dom` (>=19) are peer dependencies. React 19 is required
because components take `ref` as an ordinary prop rather than through
`forwardRef`.

## Use

Import the stylesheet once, at your app's entry point:

```js
import '@jig-ui/react/styles.css';
```

Then use the components anywhere:

```jsx
import { Button, Stack, Typography } from '@jig-ui/react';

export function Example() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing="400">
      <Typography as="h1" with="heading01">Hello</Typography>
      <Button variant="primary">Click me</Button>
    </Stack>
  );
}
```

### Fonts

Jig's type tokens name three families but deliberately do not load them, so that
the package makes no network requests of its own and you stay in control of how
the fonts are served. You must make them available yourself, or text will fall
back to `sans-serif` / `monospace` / `serif`:

| Token             | Family           |
| ----------------- | ---------------- |
| `type.family.sans`    | Work Sans        |
| `type.family.mono`    | Source Code Pro  |
| `type.family.display` | Amarna           |

All three are variable fonts covering weights 400–700, which is the full range
the weight tokens use. The quickest option is Google Fonts — add to your
`<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Amarna:wght@400..700&family=Source+Code+Pro:wght@400..700&family=Work+Sans:wght@400..700&display=swap"
  rel="stylesheet"
/>
```

To avoid the third-party request, self-host instead — via `@fontsource-variable`
packages or your own `@font-face` rules — using the exact family names above.

To substitute your own typefaces, override the custom properties rather than
loading these at all:

```css
:root {
  --type-family-sans: 'Inter', sans-serif;
}
```

### Reset

An optional reset is available separately. Import it before `styles.css`:

```js
import '@jig-ui/react/reset.css';
```

### Tokens

The design tokens are exported as CSS custom property references, for inline
styles or your own CSS-in-JS:

```jsx
import { color, spacing } from '@jig-ui/react/tokens';

<div style={{ background: color.surfaces[100], padding: spacing[500] }} />
```

Theming is done entirely through CSS custom properties, so you can override any
token in your own stylesheet without touching the package.

## Theming

### Cascade layers

All of Jig's CSS ships inside cascade layers, declared in this order:

```css
@layer jig.reset, jig.tokens, jig.base, jig.components;
```

Both `styles.css` and `reset.css` state this order, so importing them in either
order gives the same cascade.

Because every Jig rule sits in a layer, **any unlayered CSS you write beats all
of it**, regardless of selector specificity. Overriding a token is therefore
just:

```css
:root {
  --color-text-primary: #111;
}
```

You do not need to out-specify Jig's own `:root[data-theme="dark"]` selectors —
layer order settles it first. If your app uses layers itself, name Jig's in your
own `@layer` statement to place your rules deliberately:

```css
@layer jig.reset, jig.tokens, jig.base, jig.components, app;
```

`jig.base` currently emits nothing. It is declared so that adding base styles
later does not renumber an order you have already written against.

`jig.reset` is lowest on purpose. A reset exists to beat the *browser's* default
styles, and those lose to author CSS at any layer — so layering it takes nothing
away. It also has to sit below `jig.components`, or its `h1`–`h6` rules would
override the components' own typography.

### Light and dark

By default Jig follows the operating system via `prefers-color-scheme`. To take
control, set `data-theme` on the root element:

```html
<html data-theme="dark">
```

Both directions are supported: `data-theme="light"` forces light even when the
OS is dark, and vice versa.

Theme selectors are scoped to `:root`, so a theme applies to the whole document.
Nested theme regions — a dark card inside a light page — are not supported.

### Avoiding a flash of the wrong theme

Following the OS needs no JavaScript and is correct before first paint, because
it is pure CSS.

A **persisted** preference is different. If you read a stored theme and apply
`data-theme` after hydration, the user sees the OS theme first and yours a moment
later. Jig deliberately ships no runtime for this — it is your app's data, and a
library-injected script cannot know where you keep it. Either render the
attribute server-side:

```html
<html data-theme="{{ user.theme }}">
```

or set it from a small blocking script in `<head>`, before the stylesheet:

```html
<script>
  const t = localStorage.getItem('theme');
  if (t) document.documentElement.dataset.theme = t;
</script>
```

## License

MIT

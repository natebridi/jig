# @jig-ui/react

React components for the Jig design system.

Ships as plain ESM plus a stylesheet — no Vanilla Extract, PostCSS, or other
build tooling is required in the consuming project.

## Install

```sh
npm install @jig-ui/react
```

`react` and `react-dom` (>=18) are peer dependencies.

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

## License

MIT

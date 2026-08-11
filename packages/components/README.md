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

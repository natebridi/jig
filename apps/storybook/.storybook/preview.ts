import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Same cascade the published package composes, and the same order main.tsx
// uses in the playground: reset, then tokens, then base styles.
import '@jig-ui/styles/reset.css';
import '@jig-ui/styles/vars.css';
import './preview.css';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    a11y: { test: 'error' },
  },
};

export default preview;

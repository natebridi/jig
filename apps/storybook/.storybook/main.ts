import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const here = dirname(fileURLToPath(import.meta.url));
const componentsSrc = resolve(here, '../../../packages/components/src');

/**
 * The margin props Typography picks up from SpacingProps. Their declaration
 * lives in a generated Sprinkles type inside node_modules, so the
 * node_modules filter below would drop them from the props table without
 * this allowance.
 */
const spacingProps = new Set([
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
]);

const config: StorybookConfig = {
  stories: [`${componentsSrc}/**/*.stories.@(ts|tsx)`],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // The components sit outside this app's Vite root, and the plugin's
      // default globs are resolved against that root — so without absolute
      // patterns it never sees them and every props table falls back to
      // whatever Storybook can infer from a story's args.
      include: [resolve(componentsSrc, '**/*.tsx')],
      exclude: [resolve(componentsSrc, '**/*.stories.tsx')],
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Without this every component that extends an HTML element's attributes
      // reports several hundred inherited DOM props.
      propFilter: (prop) =>
        spacingProps.has(prop.name) ||
        !prop.parent ||
        !/node_modules/.test(prop.parent.fileName),
    },
  },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), vanillaExtractPlugin()];
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        // Render the components from source, so editing a component or its
        // .css.ts hot-reloads instead of needing @jig-ui/react rebuilt. The
        // playground is what exercises the published build.
        '@jig-ui/react': resolve(componentsSrc, 'index.ts'),
      },
    };
    return viteConfig;
  },
};

export default config;

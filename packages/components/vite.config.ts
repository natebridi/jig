import { existsSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';

const here = dirname(fileURLToPath(import.meta.url));
const stylesDist = resolve(here, '../styles/dist');
const dist = resolve(here, 'dist');

/**
 * Assembles the published stylesheet. Token custom properties have to land
 * before the base layer and the compiled component styles, so the cascade is
 * built explicitly here rather than left to module graph ordering.
 *
 * Runs on every build, including `vite build --watch` rebuilds.
 */
function composeStylesheet(): Plugin {
    return {
        name: 'jig-compose-stylesheet',
        closeBundle() {
            const emitted = resolve(dist, 'components.css');
            const layers = [
                readFileSync(resolve(stylesDist, 'tokens.css'), 'utf8'),
                readFileSync(resolve(stylesDist, 'styles.css'), 'utf8'),
                existsSync(emitted) ? readFileSync(emitted, 'utf8') : ''
            ];

            writeFileSync(resolve(dist, 'styles.css'), layers.join('\n'), 'utf8');
            if (existsSync(emitted)) rmSync(emitted);

            // The reset ships separately so consumers with their own can skip it.
            copyFileSync(resolve(stylesDist, 'reset.css'), resolve(dist, 'reset.css'));
        }
    };
}

export default defineConfig({
    plugins: [
        vanillaExtractPlugin(),
        dts({ rollupTypes: true, tsconfigPath: './tsconfig.build.json' }),
        composeStylesheet()
    ],
    build: {
        outDir: 'dist',
        cssCodeSplit: false,
        lib: {
            entry: {
                index: resolve(here, 'src/index.ts'),
                tokens: resolve(here, 'src/tokens.ts'),
                icons: resolve(here, 'src/icons.ts')
            },
            formats: ['es']
        },
        rollupOptions: {
            // Everything else — including the @jig-ui/* workspace packages — is
            // bundled in, so the published package has no runtime dependencies.
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: { assetFileNames: 'components.css' }
        }
    }
});

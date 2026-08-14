import { existsSync, globSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';

const here = dirname(fileURLToPath(import.meta.url));
const stylesDist = resolve(here, '../styles/dist');
const dist = resolve(here, 'dist');

/**
 * Walks the emitted declarations and fails the build if any of them import a
 * package the consumer will not have installed. Relative imports are expected
 * — the declarations ship as a tree — so what matters is that every *bare*
 * specifier resolves to React or something else in peer/dependencies.
 */
function verifyDeclarations() {
    const pkg = JSON.parse(readFileSync(resolve(here, 'package.json'), 'utf8'));
    const installable = new Set([
        ...Object.keys(pkg.peerDependencies ?? {}),
        ...Object.keys(pkg.dependencies ?? {})
    ]);
    const packageOf = (spec: string) =>
        spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]!;

    const problems: string[] = [];

    for (const file of globSync(resolve(dist, '**/*.d.ts'))) {
        // JSDoc @example blocks contain import statements that are prose, not
        // dependencies — strip comments before scanning or every documented
        // example reads as a leak.
        const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
        // Covers `from '…'`, `import('…')` and side-effect imports, in either
        // quote style — the previous check only matched single-quoted `from`.
        const specs = [...source.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((m) => m[1]!);

        for (const spec of new Set(specs)) {
            if (spec.startsWith('.')) {
                const target = resolve(dirname(file), spec);
                // A specifier may name the file or the directory it indexes.
                if (!existsSync(`${target}.d.ts`) && !existsSync(resolve(target, 'index.d.ts'))) {
                    problems.push(`${relative(dist, file)} imports "${spec}", which was not emitted`);
                }
            } else if (!installable.has(packageOf(spec))) {
                problems.push(`${relative(dist, file)} imports "${spec}", which consumers do not install`);
            }
        }
    }

    if (problems.length) {
        throw new Error(`Declarations are not self-contained:\n  - ${problems.join('\n  - ')}`);
    }
}

/**
 * The token typings are generated into the private @jig-ui/styles package, so
 * the declaration `src/tokens.ts` emits points at something the consumer never
 * receives. The file has no imports of its own, so vendoring it into dist and
 * repointing the one specifier is enough to make the entry self-contained.
 */
function vendorTokenTypes() {
    const vendored = 'tokens-vars';
    copyFileSync(resolve(stylesDist, 'vars.d.ts'), resolve(dist, `${vendored}.d.ts`));

    const entry = resolve(dist, 'tokens.d.ts');
    const source = readFileSync(entry, 'utf8');
    const rewritten = source.replaceAll('@jig-ui/styles/tokens', `./${vendored}`);

    if (rewritten === source) {
        throw new Error(
            `tokens.d.ts no longer references @jig-ui/styles/tokens — vendoring is now a no-op ` +
            `and the entry may be leaking a different private path. Check ${entry}.`
        );
    }

    writeFileSync(entry, rewritten, 'utf8');
}

/**
 * The cascade layer order, and the public contract behind it.
 *
 * Emitted at the top of *both* published stylesheets so the order does not
 * depend on which one a consumer imports first — layer order is fixed by first
 * appearance, and a repeat of the same statement is a no-op.
 *
 * Because every Jig rule sits in a layer, *unlayered* consumer CSS beats all
 * of it regardless of selector specificity — so overriding a token does not
 * mean out-specifying `:root[data-theme="dark"]`. Consumers who use layers
 * themselves can name these in their own `@layer` statement to place their
 * rules deliberately.
 *
 * `jig.reset` is lowest because a reset's job is to beat the *user-agent*
 * stylesheet, and UA styles lose to author styles at any layer — so layering
 * it costs it nothing. Leaving it unlayered, on the other hand, put it above
 * every layer including `jig.components`, where its `h1..h6, p` rules silently
 * flattened Typography's own presets: `<Typography as="h1" with="heading01">`
 * rendered at `font-size: inherit`.
 *
 * `jig.base` is declared but currently emits nothing. It is reserved so that
 * adding base styles later does not renumber an order consumers have already
 * written against.
 */
const LAYER_ORDER = '@layer jig.reset, jig.tokens, jig.base, jig.components;\n';

/**
 * Assembles the published stylesheets: one public file plus the optional
 * reset, in a reproducible order, with the cascade stated explicitly.
 *
 * Runs on every build, including `vite build --watch` rebuilds.
 */
function composeStylesheet(): Plugin {
    return {
        name: 'jig-compose-stylesheet',
        closeBundle() {
            const emitted = resolve(dist, 'components.css');
            const wrap = (layer: string, css: string) =>
                css.trim() ? `@layer ${layer} {\n${css}\n}\n` : '';

            const stylesheet = [
                LAYER_ORDER,
                wrap('jig.tokens', readFileSync(resolve(stylesDist, 'tokens.css'), 'utf8')),
                wrap('jig.components', existsSync(emitted) ? readFileSync(emitted, 'utf8') : '')
            ].join('\n');

            writeFileSync(resolve(dist, 'styles.css'), stylesheet, 'utf8');
            if (existsSync(emitted)) rmSync(emitted);

            // The reset ships separately so consumers with their own can skip
            // it. It already declares its own `@layer jig.reset` at source, so
            // it only needs the order statement prepended — which makes the
            // cascade the same whichever of the two files is imported first.
            const reset = readFileSync(resolve(stylesDist, 'reset.css'), 'utf8');
            writeFileSync(resolve(dist, 'reset.css'), `${LAYER_ORDER}\n${reset}`, 'utf8');
        }
    };
}

export default defineConfig({
    plugins: [
        vanillaExtractPlugin(),
        dts({
            tsconfigPath: './tsconfig.build.json',
            // The .css.ts modules are compiled away at build time and nothing
            // in the public chain references their types, so emitting them
            // would ship orphaned declarations whose only effect is to
            // reference @vanilla-extract packages consumers do not install.
            exclude: ['**/*.css.ts', '**/*.stories.tsx', '**/*.test.ts', '**/*.test.tsx'],
            afterBuild: () => {
                vendorTokenTypes();
                verifyDeclarations();
            }
        }),
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

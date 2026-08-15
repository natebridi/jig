import { createRequire } from 'node:module'
import { defineConfig } from '@terrazzo/cli'
import css from '@terrazzo/plugin-css'
import cssInJs from '@terrazzo/plugin-css-in-js'

// Terrazzo wants a file path rather than a module specifier, so the workspace
// dependency is resolved through Node instead of reached for by hand. The
// `workspace:*` dependency on @jig-ui/tokens is what guarantees Turbo has
// already built this file, and `./resolver` makes the DTCG resolver document a
// declared export rather than a path into another package's dist.
const require = createRequire(import.meta.url)
const tokensFile = require.resolve('@jig-ui/tokens/resolver')

export default defineConfig({
    tokens: [tokensFile],
    outDir: './dist/',
    // `core/consistent-naming` is left at its default (kebab-case) and is
    // expected to pass silently. Token IDs are kebab-case throughout; both the
    // emitted custom properties and the css-in-js accessors are derived from
    // them, so the source casing costs nothing at the call site — the
    // components read `color.button.primary.baseBg` from a `'base-bg'` token
    // either way.
    plugins: [
        css({
            filename: 'tokens.css',
            // Four permutations, not five: the default input already resolves
            // to the light theme, so a separate explicit-light `:root` block
            // was emitting a second full copy of the graph that the first one
            // could never win against.
            //
            // Every block below still emits the *whole* token graph. The
            // dedupe pass in scripts/dedupe-tokens.mjs then strips from the
            // last three anything the base block already declares, leaving
            // only the properties that actually change with the theme.
            permutations: [{
                input: {}, // the default theme (lux), and the invariant primitives
                prepare: (contents) => `:root {\n  color-scheme: light dark;\n  ${contents} }`
            },{
                input: { theme: "dark" },
                prepare: (contents) => `@media (prefers-color-scheme: dark) {
                    :root {
                        color-scheme: dark;
                        ${contents}
                    }
                }`
            },{
                // An explicit override for consumers who want to choose a theme
                // rather than follow the OS. Both directions are needed: the
                // attribute selector outweighs the media query above, so
                // data-theme="light" is what forces light while the OS is dark.
                input: { theme: "lux" },
                prepare: (contents) => `:root[data-theme="light"] {\n  color-scheme: light;\n  ${contents} }`
            },{
                input: { theme: "dark" },
                prepare: (contents) => `:root[data-theme="dark"] {\n  color-scheme: dark;\n  ${contents} }`
            }]
        }),
        // The components reference tokens as plain custom-property strings from
        // here, which is what lets a `.css.ts` file use a token without the
        // consumer needing Vanilla Extract at all.
        cssInJs({
            filename: "vars.js",
        })
        // A vanilla-extract `theme.css.ts` contract used to be generated too.
        // Nothing imported it — the components never used the contract — so it
        // was 43KB of build output and one more shape to keep in step for no
        // consumer. Reinstate it only alongside something that reads it.
    ]
});

import { defineConfig } from '@terrazzo/cli'
import css from '@terrazzo/plugin-css'
import vanillaExtract from '@terrazzo/plugin-vanilla-extract'
import cssInJs from '@terrazzo/plugin-css-in-js'

const pathToTokens = __dirname.slice(0, -3) // remove 'src' from end

export default defineConfig({
    // doesn't feel like the best way to do this, but Terrazzo requires a direct file and this works
    tokens: [`${pathToTokens}node_modules/@jig-ui/tokens/dist/tokens.dtcg.json`],
    outDir: './dist/',
    plugins: [
        css({
            filename: 'tokens.css',
            permutations: [{
                input: {}, // default
                prepare: (contents) => `:root {\n  color-scheme: light dark;\n  ${contents} }`
            },{
                input: { theme: "lux" },
                prepare: (contents) => `:root {\n  color-scheme: light;\n  ${contents} }`
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
        cssInJs({
            filename: "vars.js",
        }),
        vanillaExtract({
            filename: 'theme.css.ts',
            globalThemeContract: true,
            themes: {
                light: { input: { theme: "lux" } },
                dark: { input: { theme: "dark" } },
            }
        })
    ]
});
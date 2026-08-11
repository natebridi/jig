import fs from 'node:fs'
import primitives from './src/primitives/index'
import tokens from './src/semantics/index'

fs.mkdirSync(`${import.meta.dirname}/dist`, { recursive: true })

Object.keys(primitives).map(tokenGroup => {
    const jsonData = JSON.stringify(primitives[tokenGroup as keyof typeof primitives], null, 2);
    const fileName = `${import.meta.dirname}/dist/${tokenGroup}.dtcg.json`;
    fs.writeFileSync(fileName, jsonData, 'utf8');
    console.log(`Tokens generated: \x1b[32m ${tokenGroup} \x1b[0m`);
})

Object.keys(tokens).map(tokenGroup => {
    const jsonData = JSON.stringify(tokens[tokenGroup as keyof typeof tokens], null, 2);
    const fileName = `${import.meta.dirname}/dist/${tokenGroup}.dtcg.json`;
    fs.writeFileSync(fileName, jsonData, 'utf8');
    console.log(`Tokens generated: \x1b[32m ${tokenGroup} \x1b[0m`);
})

//https://www.designtokens.org/tr/2025.10/resolver
const resolver = {
    name: 'jig',
    description: 'Working on new design system',
    version: '2025.10',
    sets: {
        foundation: {
            sources: [
                { '$ref': 'color.dtcg.json' },
                { '$ref': 'radius.dtcg.json' },
                { '$ref': 'spacing.dtcg.json' },
                { '$ref': 'typography.dtcg.json' },
            ]
        }
    },
    modifiers: {
        theme: {
            contexts: {
                lux: [{ '$ref': 'colorLight.dtcg.json' }],
                dark: [{ '$ref': 'colorDark.dtcg.json' }]
            },
            default: 'lux'
        }
    },
    resolutionOrder: [
        { '$ref': '#/sets/foundation' },
        { '$ref': '#/modifiers/theme' },
    ]
}

const resolveJson = JSON.stringify(resolver, null, 2);
const resolveFileName = `${import.meta.dirname}/dist/tokens.dtcg.json`;
fs.writeFileSync(resolveFileName, resolveJson, 'utf8');
console.log(`Token resolver successfully written: \x1b[32m ${resolveFileName} \x1b[0m`);

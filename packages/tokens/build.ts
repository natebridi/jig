import fs from 'node:fs'
import primitives from './src/primitives/index'
import tokens from './src/semantics/index'
import { flatten, merge, validateContext, validateParity, validateRequired } from './src/validate'

const dist = `${import.meta.dirname}/dist`
// Built into a sibling and swapped in at the end, so a removed token group
// cannot leave a stale .dtcg.json behind for Terrazzo to keep resolving.
const staging = `${import.meta.dirname}/.dist-staging`

fs.rmSync(staging, { recursive: true, force: true })
fs.mkdirSync(staging, { recursive: true })

/**
 * The semantic groups deliberately re-export and extend their primitives, so
 * `typography`, `radius` and `spacing` are written twice and the semantic copy
 * is the one that survives. That is intended, but only because the semantic
 * version is a superset — a group that overwrote a primitive with something
 * *narrower* would silently drop tokens, so the overwrite is recorded rather
 * than left to chance.
 */
const written = new Map<string, string>()

function writeGroup(source: string, group: string, data: unknown) {
  const file = `${staging}/${group}.dtcg.json`
  const previous = written.get(group)

  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
  written.set(group, source)

  const note = previous ? ` \x1b[90m(supersedes ${previous})\x1b[0m` : ''
  console.log(`Tokens generated: \x1b[32m ${group} \x1b[0m${note}`)
}

for (const [group, data] of Object.entries(primitives)) writeGroup('primitives', group, data)
for (const [group, data] of Object.entries(tokens)) writeGroup('semantics', group, data)

// --- validation -------------------------------------------------------------

type Json = Record<string, unknown>
const read = (group: string) =>
  JSON.parse(fs.readFileSync(`${staging}/${group}.dtcg.json`, 'utf8')) as Json

// The same composition the resolver below describes: the invariant foundation,
// plus one theme context on top.
const foundation = merge(read('color'), read('radius'), read('spacing'), read('typography'))
const light = merge(foundation, read('colorLight'))
const dark = merge(foundation, read('colorDark'))

const problems = [
  ...validateContext('light', light),
  ...validateContext('dark', dark),
  ...validateRequired('light', light),
  ...validateRequired('dark', dark),
  ...validateParity(read('colorLight'), read('colorDark')),
]

if (problems.length) {
  console.error(`\x1b[31mToken validation failed:\x1b[0m`)
  for (const problem of problems) console.error(`  - ${problem}`)
  fs.rmSync(staging, { recursive: true, force: true })
  process.exit(1)
}

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

fs.writeFileSync(`${staging}/tokens.dtcg.json`, JSON.stringify(resolver, null, 2), 'utf8')

fs.rmSync(dist, { recursive: true, force: true })
fs.renameSync(staging, dist)

const validated = new Set([...flatten(light).keys(), ...flatten(dark).keys()]).size
console.log(
  `Token resolver written, \x1b[32m${validated}\x1b[0m tokens validated across both themes`
)

/**
 * Structural checks on the generated DTCG documents.
 *
 * The token sources are plain TypeScript objects widened with `as TokenSet`,
 * which means the compiler cannot see a misspelt alias, a dangling reference,
 * or a semantic that exists in one theme but not the other — the build would
 * happily serialise all three. These are the checks that catch what the type
 * cannot.
 */

type Json = Record<string, unknown>;

interface TokenNode {
  $type?: string;
  $value: unknown;
}

const ALIAS = /^\{([^}]+)\}$/;

const isToken = (node: unknown): node is TokenNode =>
  typeof node === 'object' && node !== null && '$value' in node;

/** Flattens a DTCG document to `dotted.path` → token. */
export function flatten(doc: Json, prefix: string[] = [], out = new Map<string, TokenNode>()) {
  for (const [key, value] of Object.entries(doc)) {
    if (typeof value !== 'object' || value === null) continue;
    if (isToken(value)) out.set([...prefix, key].join('.'), value);
    else flatten(value as Json, [...prefix, key], out);
  }
  return out;
}

/** Deep-merges DTCG documents, right-hand wins. Used to compose a theme context. */
export function merge(...docs: Json[]): Json {
  const result: Json = {};
  for (const doc of docs) {
    for (const [key, value] of Object.entries(doc)) {
      const existing = result[key];
      result[key] =
        typeof value === 'object' && value !== null && !Array.isArray(value) &&
        typeof existing === 'object' && existing !== null && !Array.isArray(existing) &&
        !isToken(value) && !isToken(existing)
          ? merge(existing as Json, value as Json)
          : value;
    }
  }
  return result;
}

const aliasTarget = (value: unknown) =>
  typeof value === 'string' ? (ALIAS.exec(value)?.[1] ?? null) : null;

/**
 * Checks one fully-resolved theme context: every token is typed, every alias
 * points at a token that exists, and no alias chain loops back on itself.
 */
export function validateContext(label: string, doc: Json): string[] {
  const tokens = flatten(doc);
  const problems: string[] = [];

  for (const [path, token] of tokens) {
    if (!token.$type) problems.push(`${label}: ${path} has no $type`);

    const target = aliasTarget(token.$value);
    if (target === null) continue;

    if (!tokens.has(target)) {
      problems.push(`${label}: ${path} aliases {${target}}, which does not exist`);
      continue;
    }

    // Walk the chain. A token that reaches itself would make the CSS custom
    // property resolve to nothing at runtime, silently.
    const seen = new Set([path]);
    let cursor: string | null = target;
    while (cursor !== null) {
      if (seen.has(cursor)) {
        problems.push(`${label}: ${path} is part of an alias cycle via {${cursor}}`);
        break;
      }
      seen.add(cursor);
      cursor = aliasTarget(tokens.get(cursor)?.$value);
    }
  }

  return problems;
}

/**
 * Every semantic present in one theme must be present in the other. A token
 * that exists only in light leaves dark falling back to the light value, which
 * looks like a colour bug a long way from its cause.
 */
export function validateParity(light: Json, dark: Json): string[] {
  const lightPaths = new Set(flatten(light).keys());
  const darkPaths = new Set(flatten(dark).keys());

  return [
    ...[...lightPaths].filter((p) => !darkPaths.has(p)).map((p) => `${p} is missing from the dark theme`),
    ...[...darkPaths].filter((p) => !lightPaths.has(p)).map((p) => `${p} is missing from the light theme`),
  ];
}

/**
 * Semantics the components rely on by name. If one of these disappears, the
 * failure should be a build error here rather than an unstyled component.
 */
export const REQUIRED_SEMANTICS = [
  'color.focus',
  'color.surfaces.body',
  'color.surfaces.card',
  'color.surfaces.popover',
  'color.surfaces.inverse',
  'color.text.primary',
  'color.text.secondary',
  'color.text.inverse',
  'color.text.muted',
  'color.text.accent',
  'color.text.danger',
  // The hover pairs. Link reads `primary-hover` by name as its fallback, and
  // Typography, Dialog and Tooltip each declare one alongside the role they
  // set — so a missing one is an unstyled hover, not a build error, unless it
  // is caught here.
  'color.text.primary-hover',
  'color.text.secondary-hover',
  'color.text.inverse-hover',
  'color.text.muted-hover',
  'color.text.accent-hover',
  'color.text.danger-hover',
];

export function validateRequired(label: string, doc: Json): string[] {
  const tokens = flatten(doc);
  return REQUIRED_SEMANTICS.filter((path) => !tokens.has(path)).map(
    (path) => `${label}: required semantic ${path} is missing`
  );
}

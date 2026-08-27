/**
 * Development-only warnings.
 *
 * For the cases a type cannot express — "required only when this other prop is
 * absent", "required only inside that parent" — where the alternative is a
 * silent failure. Dialog's accessible name is the first; 0005 recorded the same
 * shape for ToggleButton's `value`, which Base UI checks at runtime for the
 * same reason.
 *
 * `process.env.NODE_ENV` is the convention every React library uses and every
 * consumer bundler substitutes, so the branch and its message both leave a
 * production build. `process` is declared narrowly here rather than by adding
 * `@types/node`, which would pull a Node global surface into a package that
 * only ever runs in a browser — and the `typeof` guard keeps it safe where
 * nothing substitutes it at all.
 */
declare const process: { env?: { NODE_ENV?: string } } | undefined;

export function warnInDev(message: string): void {
  if (typeof process === 'undefined' || process?.env?.NODE_ENV === 'production') return;
  console.error(`Jig: ${message}`);
}

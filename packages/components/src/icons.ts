/**
 * The icon set.
 *
 * This entry point was introduced to keep the artwork out of the main bundle,
 * so that importing a Button did not pull it in. That never held — six
 * components render an Icon, so the root entry imports the full set on its
 * first line — and `Icon` is now exported from `@jig-ui/react` as well. Both
 * specifiers resolve to the same chunk, so neither is cheaper than the other.
 *
 * Kept so existing imports keep working, and because a consumer who only wants
 * the icons still has a name for that.
 *
 * @example
 * import { Icon } from '@jig-ui/react';
 * <Icon icon="check-circle" weight="fill" label="Saved" />
 */
export * from './icon';

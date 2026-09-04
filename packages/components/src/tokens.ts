/**
 * The design tokens, as CSS custom property references — `color.text.primary`
 * is the string `var(--color-text-primary)`, not a colour.
 *
 * That means the stylesheet has to be loaded too, since it is what defines the
 * custom properties these point at. Import `@jig-ui/react/styles.css` once at
 * the root of the app; without it every token resolves to nothing and paints
 * nothing. Use these tokens anywhere a CSS value is expected: inline styles,
 * CSS-in-JS, or a `style` attribute.
 *
 * Available groups: `color`, `spacing`, `radius`, `type`, `size`, `elevation`.
 *
 * @example
 * import '@jig-ui/react/styles.css';
 * import { color, spacing, radius } from '@jig-ui/react/tokens';
 *
 * <div style={{
 *   background: color.surfaces.card,
 *   borderRadius: radius[400],
 *   padding: spacing[500],
 *   color: color.text.primary,
 * }} />
 */
export * from '@jig-ui/styles/tokens';

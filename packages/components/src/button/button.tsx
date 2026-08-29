import type { ButtonHTMLAttributes, Ref } from 'react';
import { Icon, type IconName } from '../icon';
import { button, buttonIconSize } from './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'smoke';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * An icon from the curated set, sized and spaced by the button rather than
   * by the caller. Decorative — the label names the button.
   */
  icon?: IconName;
  /** Which side of the label the icon sits on. */
  iconPosition?: 'start' | 'end';
  ref?: Ref<HTMLButtonElement>;
}

/**
 * A button.
 *
 * `variant` sets how loud it is: `primary` for the main action in a view,
 * `secondary` beside it, `danger` for destructive actions, `ghost` for utility
 * actions on another surface, and `smoke` for controls over imagery or video,
 * where a translucent blurred pane keeps the content behind visible.
 *
 * `icon` takes a name from the curated set and is sized and spaced by the
 * button; it is decorative, so the label is what names the control. For a
 * button with no visible label, use `IconButton`, which requires one.
 *
 * Defaults to `type="button"`. Pass `type="submit"` explicitly to submit a
 * form. To navigate rather than act, use `Link` with a button variant.
 *
 * @example
 * <Button variant="primary" icon="arrow-right" iconPosition="end" onClick={save}>
 *   Save changes
 * </Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  // Matches IconButton and ToggleButton. A bare <button> defaults to
  // type="submit", which silently posts whatever form it happens to sit in —
  // pass type="submit" explicitly when that is what you want.
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  const glyph = icon ? <Icon icon={icon} size={buttonIconSize} /> : null;

  return (
    <button
      {...props}
      type={type}
      className={[button({ color: variant, size: size }), className].filter(Boolean).join(' ')}
    >
      {iconPosition === 'start' && glyph}
      {children}
      {iconPosition === 'end' && glyph}
    </button>
  );
}

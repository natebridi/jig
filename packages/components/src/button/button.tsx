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

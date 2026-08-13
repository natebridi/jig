import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../icon';
import { button, buttonIconSize } from './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
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
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  className,
  children,
  ...props
}: ButtonProps) {
  const glyph = icon ? <Icon icon={icon} size={buttonIconSize} /> : null;

  return (
    <button
      className={[button({ color: variant, size: size }), className].filter(Boolean).join(' ')}
      {...props}
    >
      {iconPosition === 'start' && glyph}
      {children}
      {iconPosition === 'end' && glyph}
    </button>
  );
}

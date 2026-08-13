import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName, type IconWeight } from '../icon';
import { button, buttonIconSize } from '../button/button.css';
import type { ButtonVariant, ButtonSize } from '../button';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /**
   * Names the button for assistive technology, and is the only thing that
   * does — there is no visible label to fall back on, so it is required.
   */
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  weight?: IconWeight;
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  weight = 'regular',
  // Buttons default to type="submit", which would post the form an icon
  // button happens to sit in.
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      // The button carries the name; the icon inside stays decorative so it is
      // not announced twice.
      aria-label={label}
      className={[button({ color: variant, size, iconOnly: true }), className].filter(Boolean).join(' ')}
      {...props}
    >
      <Icon icon={icon} weight={weight} size={buttonIconSize} />
    </button>
  );
}

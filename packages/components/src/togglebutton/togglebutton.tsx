import { useState, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { Icon, type IconName } from '../icon';
import { button, buttonIconSize } from '../button/button.css';

type ToggleButtonSize = 'sm' | 'md' | 'lg';

interface ToggleButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ToggleButtonSize;
  /** Controlled pressed state. Leave undefined to let the button manage its own. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Shown while unpressed, at the regular weight. */
  icon?: IconName;
  /**
   * Swapped in while pressed. Defaults to `icon`, and either way the pressed
   * state renders at the `fill` weight — which is what fill is for.
   */
  pressedIcon?: IconName;
  /** Which side of the label the icon sits on. */
  iconPosition?: 'start' | 'end';
}

export type ToggleButtonProps = ToggleButtonBaseProps &
  (
    | {
        /**
         * Drops the label and takes IconButton's square padding, so the two
         * sit together at matching dimensions.
         */
        isIconOnly?: false;
        /** Overrides the accessible name that the visible text would give. */
        label?: string;
      }
    | {
        isIconOnly: true;
        /**
         * Required here: with no visible text there is nothing else to name
         * the button for assistive technology.
         */
        label: string;
        /** Required here too — an icon-only toggle with no icon is an empty square. */
        icon: IconName;
      }
  );

export function ToggleButton({
  size = 'md',
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  icon,
  pressedIcon,
  iconPosition = 'start',
  isIconOnly = false,
  label,
  // Buttons default to type="submit", which would post the form a toggle
  // happens to sit in.
  type = 'button',
  className,
  onClick,
  children,
  ...props
}: ToggleButtonProps) {
  const isControlled = pressedProp !== undefined;
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
  const pressed = isControlled ? pressedProp : uncontrolledPressed;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    // A handler that cancelled the click gets to cancel the toggle with it.
    if (event.defaultPrevented) return;

    const next = !pressed;
    if (!isControlled) setUncontrolledPressed(next);
    onPressedChange?.(next);
  };

  const name = pressed ? pressedIcon ?? icon : icon;
  const glyph = name ? (
    <Icon icon={name} weight={pressed ? 'fill' : 'regular'} size={buttonIconSize} />
  ) : null;

  return (
    <button
      type={type}
      aria-pressed={pressed}
      // Same recipe and the same iconOnly variant IconButton uses, so the two
      // resolve to identical padding at every size rather than to two
      // definitions that have to be kept in step.
      className={[
        button({ color: 'ghost', size, pressed, iconOnly: isIconOnly }),
        className,
      ].filter(Boolean).join(' ')}
      {...(label ? { 'aria-label': label } : {})}
      onClick={handleClick}
      {...props}
    >
      {iconPosition === 'start' && glyph}
      {!isIconOnly && children}
      {iconPosition === 'end' && glyph}
    </button>
  );
}

import { useState, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { button } from '../button/button.css';

type ToggleButtonSize = 'sm' | 'md' | 'lg';

export interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ToggleButtonSize;
  /** Controlled pressed state. Leave undefined to let the button manage its own. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export function ToggleButton({
  size = 'md',
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
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

  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={[button({ color: 'ghost', size, pressed }), className].filter(Boolean).join(' ')}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

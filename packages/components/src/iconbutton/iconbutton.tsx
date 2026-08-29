import type { ButtonHTMLAttributes, Ref } from 'react';
import { Icon, type IconName, type IconWeight } from '../icon';
import { button, buttonIconSize } from '../button/button.css';
import type { ButtonVariant, ButtonSize } from '../button';

export interface IconButtonProps
  // `aria-label` is owned by `label` — accepting both would let the two
  // disagree, and the spread below can no longer overwrite it either way.
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  icon: IconName;
  /**
   * Names the button for assistive technology, and is the only thing that
   * does — there is no visible label to fall back on, so it is required.
   */
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  weight?: IconWeight;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * A button whose content is a single icon.
 *
 * `label` is required and is the accessible name — there is no visible text to
 * fall back on. Write what the button does ("Close", "Add to favourites"), not
 * what the icon depicts.
 *
 * Square padding at every size, so it sits at matching dimensions beside a
 * `Button` or an input of the same `size`. Takes Button's variants and defaults
 * to `ghost`, since an icon-only control is usually a utility action beside
 * something else.
 *
 * Consider pairing it with a `Tooltip`, since the label is not visible.
 *
 * @example
 * <Tooltip content="Close">
 *   <IconButton icon="x" label="Close" onClick={close} />
 * </Tooltip>
 */
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
      {...props}
      type={type}
      // The button carries the name; the icon inside stays decorative so it is
      // not announced twice. Set after the spread so consumer props cannot
      // leave the DOM disagreeing with the component.
      aria-label={label}
      className={[button({ color: variant, size, iconOnly: true }), className].filter(Boolean).join(' ')}
    >
      <Icon icon={icon} weight={weight} size={buttonIconSize} />
    </button>
  );
}

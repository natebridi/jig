import { Toggle } from '@base-ui/react/toggle';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { Icon, type IconName } from '../icon';
import { button, buttonIconSize } from '../button/button.css';

type ToggleButtonSize = 'sm' | 'md' | 'lg';

/**
 * What a handler receives alongside the new pressed state.
 *
 * Declared here rather than re-exported from Base UI: 0001 settled that
 * consumers import from `@jig-ui/react` and should not need to know Base UI
 * exists. This is the subset of its change details that is useful to call —
 * the object passed at runtime carries more, and passing it through unchanged
 * is what makes the cancellation reach Base UI.
 */
export interface ToggleChangeDetails {
  /**
   * Cancels the change. The button does not move, and inside a
   * `ToggleButtonGroup` the group's value is not committed either.
   */
  cancel: () => void;
  /** The native event behind the change. */
  readonly event: Event;
  /** Whether something has already cancelled this change. */
  readonly isCanceled: boolean;
}

interface ToggleButtonBaseProps
  // `aria-pressed` *is* the pressed state and `aria-label` is owned by `label`
  // — accepting either would let the DOM contradict the component. `value` is
  // the group identity below, not the native button attribute of that name.
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed' | 'aria-label' | 'value'> {
  size?: ToggleButtonSize;
  /** Controlled pressed state. Leave undefined to let the button manage its own. */
  pressed?: boolean;
  defaultPressed?: boolean;
  /**
   * Fires before the change is applied. Call `details.cancel()` to veto it.
   *
   * This replaced an earlier contract where an `onClick` handler calling
   * `preventDefault()` cancelled the toggle. Base UI does not read
   * `defaultPrevented`, and only this route can also veto a group's value
   * commit. See apps/docs/decisions/0005-toggle-button-group.html (D2).
   */
  onPressedChange?: (pressed: boolean, details: ToggleChangeDetails) => void;
  /**
   * Identifies this button within a `ToggleButtonGroup`. Required in practice
   * when nested in one — the type cannot express "only when nested", so Base
   * UI logs a development error if it is missing.
   */
  value?: string;
  /** Shown while unpressed, at the regular weight. */
  icon?: IconName;
  /**
   * Swapped in while pressed. Defaults to `icon`, and either way the pressed
   * state renders at the `fill` weight — which is what fill is for.
   */
  pressedIcon?: IconName;
  /** Which side of the label the icon sits on. */
  iconPosition?: 'start' | 'end';
  ref?: Ref<HTMLButtonElement>;
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

/**
 * A button that stays pressed.
 *
 * Manages its own state by default; pass `pressed` and `onPressedChange` to
 * control it. `onPressedChange` fires before the change is applied, so calling
 * `details.cancel()` inside it vetoes the toggle.
 *
 * `icon` shows while unpressed and `pressedIcon` while pressed, defaulting to
 * the same glyph — either way the pressed state renders at the `fill` weight.
 *
 * `isIconOnly` drops the label and takes square padding, matching `IconButton`;
 * it requires both `label` and `icon`.
 *
 * Inside a `ToggleButtonGroup` the pressed state comes from the group instead,
 * and each button needs a `value` identifying it.
 *
 * @example
 * <ToggleButton icon="star" pressedIcon="star" isIconOnly label="Favourite" />
 */
export function ToggleButton({
  size = 'md',
  pressed,
  defaultPressed,
  onPressedChange,
  value,
  icon,
  pressedIcon,
  iconPosition = 'start',
  isIconOnly = false,
  label,
  disabled,
  // Buttons default to type="submit", which would post the form a toggle
  // happens to sit in.
  type = 'button',
  className,
  children,
  ref,
  ...props
}: ToggleButtonProps) {
  // Read from the rendered state rather than a local variable: inside a group
  // the pressed state belongs to Base UI, and this is the only way to see it.
  // The two icon weights are different SVG paths, so CSS cannot do this.
  const glyph = (isPressed: boolean) => {
    const name = isPressed ? pressedIcon ?? icon : icon;
    return name ? (
      <Icon icon={name} weight={isPressed ? 'fill' : 'regular'} size={buttonIconSize} />
    ) : null;
  };

  return (
    <Toggle
      // Consumer props go to Base UI rather than onto the element inside
      // `render`, so that it *merges* handlers with its own instead of being
      // overwritten by them. Spreading these after `renderProps` below silently
      // replaced Base UI's `onClick`, which stopped the button toggling at all
      // for anyone who passed one.
      {...props}
      ref={ref}
      type={type}
      value={value}
      pressed={pressed}
      defaultPressed={defaultPressed}
      disabled={disabled}
      onPressedChange={onPressedChange}
      // Same recipe and the same iconOnly variant IconButton uses, so the two
      // resolve to identical padding at every size rather than to two
      // definitions that have to be kept in step.
      className={(state) =>
        [
          button({ color: 'ghost', size, pressed: state.pressed, iconOnly: isIconOnly }),
          className,
        ]
          .filter(Boolean)
          .join(' ')
      }
      render={(renderProps, state) => (
        <button
          {...renderProps}
          // Everything the component owns is set after the spread, so consumer
          // props can add to the button but cannot contradict its state.
          aria-pressed={state.pressed}
          {...(label ? { 'aria-label': label } : {})}
        >
          {iconPosition === 'start' && glyph(state.pressed)}
          {!isIconOnly && children}
          {iconPosition === 'end' && glyph(state.pressed)}
        </button>
      )}
    />
  );
}

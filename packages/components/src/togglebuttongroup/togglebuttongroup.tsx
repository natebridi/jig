import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode, Ref } from 'react';
import { orientation as orientationStyles } from './togglebuttongroup.css';

export interface ToggleButtonGroupProps<Value extends string = string> {
  /**
   * The pressed buttons, as an array of their `value`s — an array even when
   * `multiple` is false, where it holds at most one. Controlled counterpart of
   * `defaultValue`.
   */
  value?: readonly Value[];
  defaultValue?: readonly Value[];
  /**
   * Narrowed to the group's `Value` when one is inferred or given. Note this
   * does *not* check each button's `value` prop — React children are opaque to
   * a parent's type argument, so a mistyped item is a runtime mismatch either
   * way.
   */
  onValueChange?: (value: Value[]) => void;
  /**
   * Allow more than one button pressed at a time. When false, pressing one
   * releases the others.
   *
   * @default false
   */
  multiple?: boolean;
  /** Disables every button in the group, whatever their own `disabled` says. */
  disabled?: boolean;
  /**
   * Which arrow keys move focus, and the value reported to assistive
   * technology.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Wrap focus from the last button back to the first.
   *
   * @default true
   */
  loopFocus?: boolean;
  /**
   * Names the group. A set of toggles is announced as a group, and an unnamed
   * one tells a screen-reader user nothing about what it controls.
   */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A set of `ToggleButton`s sharing one value, with arrow-key navigation between
 * them and a single tab stop.
 *
 * The children are plain `ToggleButton`s — there is no separate item
 * component — and each needs a `value` identifying it within the group.
 *
 * The group's value is an array. By default one button is pressed at a time;
 * `multiple` allows several. Set `aria-label` or `aria-labelledby` to name the
 * group, since it has no visible label of its own.
 *
 * `orientation` sets which arrow keys move focus, and `loopFocus` wraps from
 * the last button to the first.
 *
 * Carries no visual treatment of its own: the buttons look as they do
 * standalone, so wrap it in a `Stack` for spacing.
 *
 * @example
 * <ToggleButtonGroup aria-label="Theme" value={theme} onValueChange={setTheme}>
 *   <ToggleButton value="light" isIconOnly icon="sun" label="Light" />
 *   <ToggleButton value="dark" isIconOnly icon="moon" label="Dark" />
 * </ToggleButtonGroup>
 */
export function ToggleButtonGroup<Value extends string = string>({
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled,
  orientation = 'horizontal',
  loopFocus,
  className,
  children,
  ref,
  ...props
}: ToggleButtonGroupProps<Value>) {
  return (
    <ToggleGroup
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      // Base UI hands back the value and its own event details; the details are
      // not forwarded here because a group-level change has no veto of its own
      // — cancelling belongs to the button that caused it.
      onValueChange={(next) => onValueChange?.(next as Value[])}
      multiple={multiple}
      disabled={disabled}
      orientation={orientation}
      loopFocus={loopFocus}
      className={[orientationStyles[orientation], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ToggleGroup>
  );
}

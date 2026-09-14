import { Tabs as Base } from '@base-ui/react/tabs';
import type { ReactNode, Ref } from 'react';
import { indicator, list, panel, slot, tab } from './tabs.css';

/** Which arrow keys move focus, and the value reported to assistive technology. */
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsProps<Value extends string = string> {
  /**
   * The active tab's `value`. Controlled counterpart of `defaultValue`.
   *
   * `null` means no tab is active, which is Base UI's own contract rather than
   * a state Jig adds.
   */
  value?: Value | null;
  defaultValue?: Value | null;
  /**
   * Narrowed to the set's `Value` when one is inferred or given. Note this
   * does *not* check each `Tab`'s `value` — React children are opaque to a
   * parent's type argument, so a mistyped tab is a runtime mismatch either way.
   *
   * Can be called with `null`: when the active tab is removed or disabled and
   * there is no enabled tab to fall back to, Base UI reports the set as having
   * nothing active. Base UI's event details are not forwarded, matching
   * `ToggleButtonGroup` — a set-level change has no veto of its own.
   */
  onValueChange?: (value: Value | null) => void;
  /**
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A set of tabs and their panels.
 *
 * Four parts, mirroring Base UI's anatomy: `Tabs` wraps a `TabList` of `Tab`s
 * and a `TabPanel` per tab. Decided in apps/docs/decisions/0019-tabs.html (D1),
 * over a three-part shape that inferred the list — because naming the list is
 * what leaves room for content that is neither a tab nor a panel.
 *
 * **`Tabs` itself draws nothing.** No layout, no spacing, no border: it is a
 * behavioural wrapper, and anything you put inside it that is not a `TabList`
 * or a `TabPanel` renders where you wrote it. Every visual rule belongs to the
 * three parts below.
 *
 * Activation is manual — arrow keys move focus, <kbd>Enter</kbd> or
 * <kbd>Space</kbd> selects — and focus loops at the ends. Both are Base UI's
 * defaults, fixed rather than exposed (0019, settled).
 *
 * @example
 * <Tabs defaultValue="usage">
 *   <TabList aria-label="Component docs">
 *     <Tab value="usage">Usage</Tab>
 *     <Tab value="props" end={<Token>12</Token>}>Props</Tab>
 *   </TabList>
 *
 *   <TabPanel value="usage">…</TabPanel>
 *   <TabPanel value="props">…</TabPanel>
 * </Tabs>
 */
export function Tabs<Value extends string = string>({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ref,
  ...props
}: TabsProps<Value>) {
  return (
    <Base.Root
      {...props}
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as Value | null)}
      orientation={orientation}
      className={className}
    >
      {children}
    </Base.Root>
  );
}

export interface TabListProps {
  /** The `Tab`s. */
  children?: ReactNode;
  /**
   * Names the strip. A tab list is announced as one, and an unnamed one tells
   * a screen-reader user nothing about what it switches between.
   */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The strip of tabs, and the only place the set draws anything.
 *
 * Owns the rule the tabs sit on and the sliding indicator (0019 D2) — the
 * indicator is internal, not a part you place. Scrolls on one line rather than
 * wrapping when the tabs do not fit (0019 D4); the tabs keep their own widths
 * and a thin scrollbar appears only when there is somewhere to scroll to.
 *
 * Takes its orientation from `Tabs`, so it is not set here twice.
 */
export function TabList({ children, className, ref, ...props }: TabListProps) {
  return (
    <Base.List
      {...props}
      ref={ref}
      // Both are Base UI's defaults, fixed rather than exposed: manual
      // activation, and focus that loops at the ends (0019, settled). Passing
      // them explicitly would only invite a prop to reach them later.
      className={(state) =>
        [list[state.orientation], className].filter(Boolean).join(' ')
      }
    >
      {children}
      <Base.Indicator
        className={(state) => indicator[state.orientation]}
        // Not turned on: it needs a script in the document head before
        // hydration, which is not a cost this component takes on the caller's
        // behalf. The bar lands one frame late after SSR.
        renderBeforeHydration={false}
      />
    </Base.List>
  );
}

export interface TabProps<Value extends string = string> {
  /** Identifies the tab, and pairs it with the panel of the same `value`. */
  value: Value;
  /** The tab's label. */
  children?: ReactNode;
  /**
   * Content before the label — an icon, a status dot, a swatch.
   *
   * **Non-interactive only**, and so is `end`. Both render inside the tab's
   * own `<button>`, and a button inside a button is invalid HTML that leaves
   * one of the two unreachable. This is the one rule that does not carry over
   * from `ListItem`, where `end` sits outside the row's control and may hold
   * something interactive. Decided in 0019 D3.
   */
  start?: ReactNode;
  /**
   * Content after the label — a count, a `Token`. Non-interactive, for the
   * reason given on `start`.
   */
  end?: ReactNode;
  /**
   * Disables the tab. A disabled first tab is not selected initially; the next
   * enabled one is. That fallback does not run during server rendering, so set
   * `value` or `defaultValue` on `Tabs` to an enabled tab when it matters.
   */
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * One tab. Renders a `<button>`.
 *
 * `start` and `end` take an icon, a token or a count; neither may be
 * interactive (0019 D3). Icons are sized by the tab, not by the caller.
 *
 * @example
 * <Tab value="alerts" start={<Icon icon="bell" />} end={<Token>12</Token>}>
 *   Alerts
 * </Tab>
 */
export function Tab<Value extends string = string>({
  value,
  children,
  start,
  end,
  disabled,
  className,
  ref,
  ...props
}: TabProps<Value>) {
  return (
    <Base.Tab
      {...props}
      ref={ref}
      value={value}
      disabled={disabled}
      className={[tab, className].filter(Boolean).join(' ')}
    >
      {start != null && <span className={slot}>{start}</span>}
      {children}
      {/* The space is for the accessible name, not for the layout: `end`
          content joins the tab's name, and without a separator a count runs
          straight into the label as "Alerts12". A whitespace-only text node
          is not rendered as a flex item, so nothing moves on screen — the gap
          between the label and the slot is still `gap`. */}
      {end != null && <>{' '}<span className={slot}>{end}</span></>}
    </Base.Tab>
  );
}

export interface TabPanelProps<Value extends string = string> {
  /** Shown while the `Tab` with the same `value` is active. */
  value: Value;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The content behind one tab. Renders a `<div>`.
 *
 * A hidden panel unmounts, so anything it holds loses its state when the tab
 * changes — deliberate, and the reason `keepMounted` is not exposed (0019,
 * settled). Lift state a panel needs to keep.
 */
export function TabPanel<Value extends string = string>({
  value,
  children,
  className,
  ref,
  ...props
}: TabPanelProps<Value>) {
  return (
    <Base.Panel
      {...props}
      ref={ref}
      value={value}
      className={[panel, className].filter(Boolean).join(' ')}
    >
      {children}
    </Base.Panel>
  );
}

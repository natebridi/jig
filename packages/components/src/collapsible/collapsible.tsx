import { Collapsible as Base } from '@base-ui/react/collapsible';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { Icon } from '../icon';
import type { TypeStyles } from '../typography';
import { content, indicator as indicatorClass, panel, root, trigger } from './collapsible.css';

/**
 * What a handler receives alongside the new open state.
 *
 * Declared here rather than re-exported from Base UI: 0001 settled that
 * consumers import from `@jig-ui/react` and should not need to know Base UI
 * exists. This is the subset of its change details that is useful to call —
 * the object passed at runtime carries more, and passing it through unchanged
 * is what makes the cancellation reach Base UI.
 *
 * Deliberately the same shape as `ToggleChangeDetails`. 0013 D5's outcome
 * notes that a third consumer should collapse these into one shared type
 * rather than adding a third near-copy.
 */
export interface CollapsibleChangeDetails {
  /** Cancels the change. The panel does not move. */
  cancel: () => void;
  /** The native event behind the change. */
  readonly event: Event;
  /** Whether something has already cancelled this change. */
  readonly isCanceled: boolean;
}

export interface CollapsibleProps
  // Anything else a caller puts on the root reaches it — `id`, `data-*`,
  // `aria-*`. Matches ScrollArea, the other wrapper whose root is a plain
  // `div`; `className`, `style` and `children` are re-declared below because
  // this component narrows or repurposes each of them.
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'> {
  /**
   * The trigger's visible content — the words that name what is inside.
   *
   * Called `label` rather than `trigger` on purpose: `Dialog`'s `trigger`
   * means "an element that opens this", and a Collapsible owns its button
   * rather than accepting one. Reusing the name for a different idea is how a
   * system stops being learnable.
   */
  label: ReactNode;
  /** The panel's contents. */
  children?: ReactNode;
  /**
   * A Typography preset for the trigger's label. Defaults to `body01`, so a
   * trigger with nothing passed matches the body copy around it; a section
   * disclosure usually wants `heading05`.
   *
   * The same presets `Typography` and `Link` name, from one shared map — so
   * this is the type style, not a size ramp. Decided in 0013 D2.
   */
  with?: TypeStyles;
  /**
   * The glyph marking the trigger: `plus` while closed, `minus` while open, at
   * the trailing edge, sized in `em` so it tracks `with`.
   *
   * `false` removes it, for a trigger that is already obviously one. There is
   * no way to substitute a different glyph — the indicator is the component's,
   * like every other icon Jig places rather than accepts. Decided in 0013 D3,
   * whose outcome records that this pair cannot animate: two SVG paths cannot
   * be tweened, so the indicator cuts rather than transitions.
   */
  indicator?: boolean;
  /** Controlled open state. Omit to let the collapsible manage its own. */
  open?: boolean;
  defaultOpen?: boolean;
  /**
   * Fires before the change is applied. Call `details.cancel()` to veto it —
   * which is what makes "do not collapse over a dirty form" expressible.
   *
   * Base UI's signature, kept rather than narrowed to `(open) => void` the way
   * Dialog's is. Decided in 0013 D5.
   */
  onOpenChange?: (open: boolean, details: CollapsibleChangeDetails) => void;
  /** Prevents the panel from being opened or closed. */
  disabled?: boolean;
  /**
   * Keeps the closed panel in the DOM behind `hidden="until-found"`, so the
   * browser's find-in-page can match text inside it and open the panel.
   *
   * Off by default, which is Base UI's default and 0013 D4's decision: a
   * closed panel's children are not rendered at all and cost nothing until it
   * opens. Turn this on for content a reader would expect to search — an FAQ,
   * a reference page.
   *
   * Overrides `keepMounted`. In a browser that does not know the value, the
   * element falls back to plain `hidden`, which is `keepMounted`'s behaviour
   * rather than a broken one.
   */
  hiddenUntilFound?: boolean;
  /**
   * Keeps the closed panel in the DOM behind a plain `hidden`. Off by default.
   *
   * Reach for it when state inside the panel has to survive being collapsed —
   * a partly filled form — and findability is not wanted.
   */
  keepMounted?: boolean;
  /** Applied to the root, which is the element a caller would size. */
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A button that shows and hides a panel below it.
 *
 * `label` names what is inside and `children` are the contents. Manages its
 * own state by default; pass `open` and `onOpenChange` to drive it from
 * elsewhere. `onOpenChange` fires before the change is applied, so calling
 * `details.cancel()` inside it vetoes the toggle.
 *
 * `with` sets the trigger's type from the Typography presets — `body01` by
 * default, `heading05` for a section disclosure.
 *
 * A closed panel is not in the DOM at all, so find-in-page cannot reach it.
 * Pass `hiddenUntilFound` for content a reader would expect to search.
 *
 * Spacing around it comes from the parent, like every other component.
 *
 * @example
 * <Collapsible label="Shipping and returns" with="heading05">
 *   <Typography as="p">Orders ship within two business days.</Typography>
 * </Collapsible>
 */
export function Collapsible({
  label,
  children,
  with: typeStyle = 'body01',
  indicator = true,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  hiddenUntilFound,
  keepMounted,
  className,
  style,
  ref,
  ...props
}: CollapsibleProps) {
  return (
    <Base.Root
      // Consumer props first, so nothing passed in can contradict what the
      // component sets for itself below.
      {...props}
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...(style ? { style } : {})}
    >
      {/*
        `render` rather than plain children, because the glyph depends on the
        open state and with `defaultOpen` that state belongs to Base UI — this
        is the only way to see it. Base UI has no Indicator part for
        Collapsible, so the swap happens here. Two different SVG paths, so CSS
        could not do it even with the state in hand: 0013 D3's motion cost, in
        the markup.
      */}
      <Base.Trigger
        className={trigger({ with: typeStyle })}
        render={(renderProps, state) => (
          <button {...renderProps}>
            {label}
            {indicator && (
              <Icon icon={state.open ? 'minus' : 'plus'} className={indicatorClass} />
            )}
          </button>
        )}
      />

      <Base.Panel
        className={panel}
        {...(hiddenUntilFound !== undefined ? { hiddenUntilFound } : {})}
        {...(keepMounted !== undefined ? { keepMounted } : {})}
      >
        <div className={content}>{children}</div>
      </Base.Panel>
    </Base.Root>
  );
}

import {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { bubble, placement as placementStyles } from './tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TriggerProps = HTMLAttributes<HTMLElement>;

export interface TooltipProps {
  /**
   * The tooltip text. Must be non-interactive — a tooltip is not reachable by
   * pointer or keyboard in its own right, so anything focusable inside it
   * would be announced but unusable. Interactive overlay content belongs in a
   * popover instead.
   */
  content: ReactNode;
  /** Preferred side. Flips to the opposite side when there isn't room. */
  placement?: TooltipPlacement;
  /** Milliseconds to wait before opening on hover. Focus always opens at once. */
  delay?: number;
  /** Milliseconds to wait before closing, so the pointer can cross into the bubble. */
  closeDelay?: number;
  /** Controlled open state. Leave undefined to let the tooltip manage its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Applied to the tooltip bubble, not the trigger. */
  className?: string;
  /**
   * The trigger. A single element that spreads the props it is given onto a
   * DOM node — the tooltip attaches its handlers, `style` (which carries the
   * anchor name) and `aria-describedby` to it.
   */
  children: ReactElement<TriggerProps>;
}

/**
 * Runs the trigger's own handler first, then the tooltip's — unless the
 * trigger cancelled the event, which is the same contract ToggleButton
 * honours. A trigger that calls `preventDefault` gets to suppress the tooltip
 * along with whatever else it was cancelling.
 */
function chain<E extends { defaultPrevented: boolean }>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void
) {
  return (event: E) => {
    theirs?.(event);
    if (event.defaultPrevented) return;
    ours(event);
  };
}

export function Tooltip({
  content,
  placement = 'top',
  delay = 300,
  closeDelay = 100,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: TooltipProps) {
  const child = Children.only(children);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const tooltipId = `jig-tooltip-${uid}`;
  const anchorName = `--jig-tooltip-${uid}`;

  const bubbleRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;

  const openRef = useRef(open);
  openRef.current = open;

  const clearTimer = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (openRef.current === next) return;
      openRef.current = next;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const scheduleOpen = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), delay);
  }, [clearTimer, delay, setOpen]);

  const scheduleClose = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [clearTimer, closeDelay, setOpen]);

  const closeNow = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer, setOpen]);

  // The bubble lives in the top layer, so no ancestor's overflow or stacking
  // context can clip it.
  useEffect(() => {
    const el = bubbleRef.current;
    if (!el || typeof el.showPopover !== 'function') return;
    if (open) {
      if (!el.matches(':popover-open')) el.showPopover();
    } else if (el.matches(':popover-open')) {
      el.hidePopover();
    }
  }, [open]);

  // Escape dismisses even while the pointer, not focus, is on the trigger.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeNow();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeNow]);

  useEffect(() => clearTimer, [clearTimer]);

  const describedBy = [child.props['aria-describedby'], tooltipId].filter(Boolean).join(' ');

  return (
    <>
      {cloneElement(child, {
        style: { ...child.props.style, anchorName },
        'aria-describedby': describedBy,
        // Touch has no hover state, and a tap that opened a tooltip would have
        // no way to dismiss it.
        onPointerEnter: chain(child.props.onPointerEnter, (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType !== 'touch') scheduleOpen();
        }),
        onPointerLeave: chain(child.props.onPointerLeave, (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType !== 'touch') scheduleClose();
        }),
        // Keyboard focus only — a click already gets the hover tooltip, and
        // leaving one open under the pointer after clicking reads as stuck.
        onFocus: chain(child.props.onFocus, (event: FocusEvent<HTMLElement>) => {
          if (event.target.matches(':focus-visible')) {
            clearTimer();
            setOpen(true);
          }
        }),
        onBlur: chain(child.props.onBlur, closeNow),
        onKeyDown: chain(child.props.onKeyDown, (event: KeyboardEvent<HTMLElement>) => {
          if (event.key === 'Escape') closeNow();
        }),
      })}
      <div
        ref={bubbleRef}
        id={tooltipId}
        role="tooltip"
        popover="manual"
        className={[bubble, placementStyles[placement], className].filter(Boolean).join(' ')}
        style={{ positionAnchor: anchorName }}
        // WCAG 1.4.13 — the bubble has to survive the pointer moving onto it.
        onPointerEnter={clearTimer}
        onPointerLeave={scheduleClose}
      >
        {content}
      </div>
    </>
  );
}

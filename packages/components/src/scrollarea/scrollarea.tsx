import { ScrollArea as Base } from '@base-ui/react/scroll-area';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import {
  horizontal,
  root,
  scrollbar,
  scrolling,
  thumb,
  vertical,
  viewport,
} from './scrollarea.css';

export interface ScrollAreaProps
  // `className` is narrowed back to a string: Base UI also accepts a function
  // of its own state, which is machinery this component uses internally rather
  // than surface a consumer should reach for.
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** The scrolling content. */
  children?: ReactNode;
  /** Applied to the root — the element whose height constrains the scroll. */
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const bar = (axis: string, isScrolling: boolean) =>
  [scrollbar, axis, isScrolling && scrolling].filter(Boolean).join(' ');

/**
 * A region that scrolls, with a scrollbar Jig draws rather than the platform.
 *
 * One component rather than Base UI's six parts: five of them are invariant
 * boilerplate, and 0002 D2's rule is that anyone who wants to assemble the
 * pieces by hand is better served by Base UI directly.
 *
 * The height is the caller's. A scroll area scrolls because something
 * constrains it — `style={{ maxHeight }}`, or a flex parent with
 * `min-height: 0` — and that constraint is not a prop.
 *
 * At rest it shows no chrome at all. The scrollbar appears on hover, on focus
 * within, and while scrolling; what says the content is cropped in the
 * meantime is the gradient mask at the two edges. Decided in
 * apps/docs/decisions/0007-scroll-area.html.
 */
export function ScrollArea({ className, children, ref, ...props }: ScrollAreaProps) {
  return (
    <Base.Root
      {...props}
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
    >
      <Base.Viewport className={viewport}>
        <Base.Content>{children}</Base.Content>
      </Base.Viewport>

      {/* Base UI carries `scrolling` in state but does not map it to a data
          attribute, so the reveal-on-scroll half of 0007 D1 is read through
          the function form of `className` rather than from the DOM. */}
      <Base.Scrollbar
        orientation="vertical"
        className={(state) => bar(vertical, state.scrolling)}
      >
        <Base.Thumb className={thumb} />
      </Base.Scrollbar>

      <Base.Scrollbar
        orientation="horizontal"
        className={(state) => bar(horizontal, state.scrolling)}
      >
        <Base.Thumb className={thumb} />
      </Base.Scrollbar>

      {/* Both axes overflowing at once is not a layout Jig has, but the corner
          keeps the DOM matching Base UI's anatomy. Nothing is painted in it. */}
      <Base.Corner />
    </Base.Root>
  );
}

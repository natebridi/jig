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
 * A region that scrolls, with a styled scrollbar in place of the platform's.
 *
 * The height is yours to set: it only scrolls once something constrains it, so
 * give it a `maxHeight`, or put it in a flex or grid parent that bounds it
 * (remembering `min-height: 0` on the flex child above it).
 *
 * No chrome at rest. The scrollbar appears on hover, on focus within, and
 * while scrolling; a gradient mask at the cropped edges shows there is more in
 * the meantime. Space for the scrollbar is always reserved, so content does not
 * shift when it appears.
 *
 * @example
 * <ScrollArea style={{ maxHeight: '20rem' }}>
 *   {messages.map((m) => <Message key={m.id} {...m} />)}
 * </ScrollArea>
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

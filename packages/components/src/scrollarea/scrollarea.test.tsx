import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from './scrollarea';

/**
 * jsdom lays nothing out, so there is no overflow for Base UI to detect and no
 * thumb geometry to measure. What is assertable here is the structure Jig is
 * responsible for: which element the class and the ref land on, that the
 * content is reachable, and that both axes are present. The reveal triggers
 * and the mask are stylesheet behaviour and belong in a visual check.
 */
describe('ScrollArea', () => {
  it('renders its content', () => {
    render(<ScrollArea>Something long</ScrollArea>);

    expect(screen.getByText('Something long')).toBeInTheDocument();
  });

  it('puts the caller className on the root, which is the element they size', () => {
    render(
      <ScrollArea className="mine" data-testid="area">
        content
      </ScrollArea>
    );

    const area = screen.getByTestId('area');

    // The root is what a caller constrains — a max-height on the viewport
    // instead would leave the root free to grow and nothing would ever scroll.
    expect(area).toHaveClass('mine');
    expect(area.querySelector('.mine')).toBeNull();
  });

  it('forwards the ref to the root rather than the viewport', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref} data-testid="area">
        content
      </ScrollArea>
    );

    expect(ref.current).toBe(screen.getByTestId('area'));
  });

  it('keeps a region that does not scroll out of the tab order', () => {
    const { container } = render(<ScrollArea>content</ScrollArea>);

    // Base UI's rule, which 0007 leaned on rather than reimplementing: the
    // viewport is focusable only while it actually overflows. Nothing
    // overflows in jsdom, so this is the non-scrollable case — a scroll area
    // that adds a tab stop for a region with nothing to scroll would be a
    // WCAG 2.4.3 regression, and it would be silent.
    // Base UI marks both the root and the viewport `role="presentation"`, so
    // the viewport is reached structurally rather than by role.
    const viewport = container.firstElementChild?.firstElementChild;

    expect(viewport).toHaveAttribute('tabindex', '-1');
  });

  it('renders no scrollbar when there is nothing to scroll', () => {
    const { container } = render(<ScrollArea>content</ScrollArea>);

    // Base UI unmounts a scrollbar whose axis does not overflow, and Jig takes
    // that default rather than setting keepMounted. The root should hold the
    // viewport and nothing else.
    expect(container.firstElementChild?.children).toHaveLength(1);
  });

  it('spreads arbitrary props onto the root', () => {
    render(
      <ScrollArea data-testid="area" aria-label="Terms">
        content
      </ScrollArea>
    );

    expect(screen.getByTestId('area')).toHaveAttribute('aria-label', 'Terms');
  });
})

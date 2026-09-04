import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Separator } from './separator';

/**
 * The whole component is one element and two attributes, so what is worth
 * asserting is exactly those: that the semantics appear when they should,
 * disappear when asked, and that `decorative` leaves nothing behind in the
 * accessibility tree.
 */
describe('Separator', () => {
  it('is announced as a separator by default', () => {
    render(<Separator />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('carries its orientation for assistive technology', () => {
    const { rerender } = render(<Separator />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');

    rerender(<Separator orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('leaves the accessibility tree entirely when decorative', () => {
    render(<Separator decorative />);

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    // Not merely un-named — the role is gone, so there is nothing for a
    // reading cursor to land on. 0012 D2.
    expect(screen.queryByRole('separator', { hidden: true })).not.toBeInTheDocument();
  });

  it('drops aria-orientation along with the role when decorative', () => {
    const { container } = render(<Separator orientation="vertical" decorative />);
    const el = container.firstElementChild!;

    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('aria-orientation')).toBe(false);
  });

  it('keeps the caller className alongside its own', () => {
    render(<Separator className="mine" />);
    const el = screen.getByRole('separator');

    expect(el).toHaveClass('mine');
    expect(el.className.split(' ').length).toBeGreaterThan(1);
  });

  it('forwards a ref to the element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);

    expect(ref.current?.tagName).toBe('DIV');
  });
});

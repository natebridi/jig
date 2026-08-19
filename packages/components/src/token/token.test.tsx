import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Token } from './token';

/**
 * The element a Token renders is not cosmetic — it is the whole of 0006 D4.
 * These assert the branch, that both affordances stay reachable when they are
 * combined, and that the remove control is named. The hit area and the hover
 * fills are stylesheet concerns and belong in a visual check, not in jsdom.
 */
describe('Token', () => {
  it('renders a plain value as a span, with no interactive role', () => {
    render(<Token>Design</Token>);

    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('makes the whole pill the anchor when there is nothing to nest beside it', () => {
    render(<Token href="/tags/design">Design</Token>);

    const link = screen.getByRole('link', { name: 'Design' });

    expect(link.tagName).toBe('A');
    // The label is inside the anchor rather than the anchor inside a wrapper,
    // which is what makes the entire pill the target.
    expect(link).toHaveTextContent('Design');
  });

  it('shrinks the anchor to the label when a remove button has to sit beside it', () => {
    render(
      <Token href="/tags/design" onRemove={() => {}}>
        Design
      </Token>
    );

    const link = screen.getByRole('link', { name: 'Design' });
    const button = screen.getByRole('button', { name: 'Remove Design' });

    // A <button> inside an <a> is invalid HTML, so neither may contain the
    // other — they are siblings under the pill.
    expect(link).not.toContainElement(button);
    expect(button).not.toContainElement(link);
    expect(link.parentElement).toBe(button.parentElement);
  });

  it('names the remove button from the label', () => {
    render(<Token onRemove={() => {}}>Design</Token>);

    expect(screen.getByRole('button', { name: 'Remove Design' })).toBeInTheDocument();
  });

  it('falls back to a bare name when the label is not a string', () => {
    render(
      <Token onRemove={() => {}}>
        <span>Design</span>
      </Token>
    );

    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('lets removeLabel override the derived name', () => {
    render(
      <Token onRemove={() => {}} removeLabel="Clear the design filter">
        Design
      </Token>
    );

    expect(
      screen.getByRole('button', { name: 'Clear the design filter' })
    ).toBeInTheDocument();
  });

  it('calls onRemove when the button is activated', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Token onRemove={onRemove}>Design</Token>);

    await user.click(screen.getByRole('button', { name: 'Remove Design' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not submit a surrounding form when removed', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Token onRemove={() => {}}>Design</Token>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Remove Design' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps the icon out of the accessibility tree', () => {
    render(<Token icon="user">Nate</Token>);

    // The label already names the token; announcing the icon would say it twice.
    expect(screen.getByText('Nate')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('forwards the ref to the anchor when the pill is a link', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Token href="/tags/design" ref={ref}>Design</Token>);

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('forwards the ref to the container otherwise', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Token ref={ref} onRemove={() => {}}>Design</Token>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
})

import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListItem } from './listitem';

/**
 * What is worth asserting is the contract 0014 settled: which element the row
 * is, where the link stops, that the end slot stays reachable beside it, and
 * that the indicator keeps its space when it is not showing.
 */
describe('ListItem', () => {
  it('renders an li by default and a div on request', () => {
    const { container, rerender } = render(<ListItem>Tokens</ListItem>);
    expect(container.firstElementChild?.tagName).toBe('LI');

    rerender(<ListItem as="div">Tokens</ListItem>);
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('is a plain row with no href and no onClick', () => {
    render(<ListItem>Tokens</ListItem>);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Tokens')).toBeInTheDocument();
  });

  it('becomes a link with href, and a button with onClick', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<ListItem href="/docs">Tokens</ListItem>);
    expect(screen.getByRole('link', { name: 'Tokens' })).toHaveAttribute('href', '/docs');

    rerender(<ListItem onClick={onClick}>Tokens</ListItem>);
    await userEvent.click(screen.getByRole('button', { name: 'Tokens' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  /**
   * 0014 D1. The whole decision: `start` is inside the control so it must not
   * be interactive, and `end` is a sibling so it can be.
   */
  it('puts start inside the link and end outside it', () => {
    render(
      <ListItem href="/docs" start={<span data-testid="s">icon</span>} end={<button>Act</button>}>
        Tokens
      </ListItem>
    );
    const link = screen.getByRole('link');
    const action = screen.getByRole('button', { name: 'Act' });

    expect(link).toContainElement(screen.getByTestId('s'));
    expect(link).not.toContainElement(action);
    // The invalid nesting this decision exists to avoid.
    expect(action.closest('a')).toBeNull();
  });

  it('leaves an end-slot button clickable beside the link', async () => {
    const onAct = vi.fn();
    render(
      <ListItem href="/docs" end={<button onClick={onAct}>Act</button>}>Tokens</ListItem>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Act' }));
    expect(onAct).toHaveBeenCalledOnce();
  });

  it('marks the current row with aria-current on the link', () => {
    render(<ListItem href="/docs" selected>Tokens</ListItem>);
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('does not claim aria-current when it is not selected', () => {
    render(<ListItem href="/docs">Tokens</ListItem>);
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });

  /**
   * 0014 D3. The gutter is reserved on every row, so the glyph is rendered
   * whether or not the row is selected — `visibility` is what hides it, and
   * `display: none` would surrender the space it exists to hold.
   */
  it('renders the selected icon on unselected rows too, to hold the gutter', () => {
    const { container, rerender } = render(
      <ListItem href="/a" selectedIcon="check">Tokens</ListItem>
    );
    expect(container.querySelector('svg')).not.toBeNull();

    rerender(<ListItem href="/a" selectedIcon="check" selected>Tokens</ListItem>);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders no gutter at all when selectedIcon is left off', () => {
    const { container } = render(<ListItem href="/a" selected>Tokens</ListItem>);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('disables a button row', async () => {
    const onClick = vi.fn();
    render(<ListItem onClick={onClick} disabled>Tokens</ListItem>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('keeps the caller className alongside its own', () => {
    const { container } = render(<ListItem className="mine">Tokens</ListItem>);
    const el = container.firstElementChild!;
    expect(el).toHaveClass('mine');
    expect(el.className.split(' ').length).toBeGreaterThan(1);
  });

  it('forwards a ref to the rendered element', () => {
    const li = createRef<HTMLLIElement>();
    const { rerender } = render(<ListItem ref={li}>Tokens</ListItem>);
    expect(li.current?.tagName).toBe('LI');

    const div = createRef<HTMLDivElement>();
    rerender(<ListItem as="div" ref={div}>Tokens</ListItem>);
    expect(div.current?.tagName).toBe('DIV');
  });
});

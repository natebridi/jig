import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapsible } from './collapsible';

/**
 * What is worth asserting here is the disclosure contract — the state a screen
 * reader hears, what a closed panel leaves behind, and the veto route — rather
 * than Base UI's measuring, which is its own tested concern and which jsdom
 * cannot exercise anyway (no layout, so no measured height).
 */
describe('Collapsible', () => {
  it('names the trigger with its label and starts closed', () => {
    render(<Collapsible label="Shipping and returns">Two business days.</Collapsible>);

    const trigger = screen.getByRole('button', { name: /shipping and returns/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Two business days.')).not.toBeInTheDocument();
  });

  it('opens and closes on press, and says so', async () => {
    const user = userEvent.setup();
    render(<Collapsible label="Shipping">Two business days.</Collapsible>);
    const trigger = screen.getByRole('button');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Two business days.')).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('honours defaultOpen without being controlled', () => {
    render(<Collapsible label="Shipping" defaultOpen>Two business days.</Collapsible>);

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Two business days.')).toBeInTheDocument();
  });

  it('stays put when controlled and the owner does not move it', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible label="Shipping" open={false} onOpenChange={onOpenChange}>
        Two business days.
      </Collapsible>
    );

    await user.click(screen.getByRole('button'));

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  /**
   * 0013 D5. The whole reason the details object is exposed rather than
   * narrowed away to `(open) => void` the way Dialog's is.
   */
  it('lets a handler veto the change with details.cancel()', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible label="Shipping" onOpenChange={(_, details) => details.cancel()}>
        Two business days.
      </Collapsible>
    );
    const trigger = screen.getByRole('button');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Two business days.')).not.toBeInTheDocument();
  });

  it('swaps plus for minus rather than rotating one glyph', async () => {
    const user = userEvent.setup();
    const { container } = render(<Collapsible label="Shipping">Body</Collapsible>);
    const closed = container.querySelector('svg')!.innerHTML;

    await user.click(screen.getByRole('button'));

    // Two different paths, which is what 0013 D3 chose and why there is no
    // transition on the indicator.
    expect(container.querySelector('svg')!.innerHTML).not.toBe(closed);
  });

  it('drops the indicator entirely when asked', () => {
    const { container } = render(
      <Collapsible label="Shipping" indicator={false}>Body</Collapsible>
    );

    expect(container.querySelector('svg')).toBeNull();
  });

  /**
   * 0013 D4. The default leaves nothing behind; `hiddenUntilFound` is what
   * puts the content in the DOM for find-in-page to reach.
   */
  it('renders nothing for a closed panel by default', () => {
    const { container } = render(<Collapsible label="Shipping">Findable text.</Collapsible>);

    expect(container.textContent).not.toContain('Findable text.');
  });

  it('keeps a closed panel in the DOM behind hidden="until-found"', () => {
    render(
      <Collapsible label="Shipping" hiddenUntilFound>Findable text.</Collapsible>
    );

    const panel = screen.getByText('Findable text.').closest('[hidden]');
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute('hidden', 'until-found');
  });

  it('keeps a closed panel in the DOM behind a plain hidden with keepMounted', () => {
    render(<Collapsible label="Shipping" keepMounted>Findable text.</Collapsible>);

    const panel = screen.getByText('Findable text.').closest('[hidden]');
    expect(panel).not.toBeNull();
    expect(panel).not.toHaveAttribute('hidden', 'until-found');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Collapsible label="Shipping" disabled>Body</Collapsible>);
    const trigger = screen.getByRole('button');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  /**
   * Base UI builds the trigger with `focusableWhenDisabled`, so a disabled
   * trigger keeps the native attribute *off* and carries `aria-disabled`
   * instead — staying reachable so it can be announced. The stylesheet has to
   * hook the attribute rather than `:disabled`, which matches nothing here;
   * this asserts the shape the CSS depends on.
   */
  it('marks a disabled trigger with aria-disabled and leaves it focusable', () => {
    render(<Collapsible label="Shipping" disabled>Body</Collapsible>);
    const trigger = screen.getByRole('button');

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).not.toBeDisabled();
    expect(trigger).not.toHaveAttribute('tabindex', '-1');
  });

  it('opens on Enter and Space from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Collapsible label="Shipping">Body</Collapsible>);
    const trigger = screen.getByRole('button');

    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the caller className on the root alongside its own', () => {
    const { container } = render(
      <Collapsible label="Shipping" className="mine">Body</Collapsible>
    );
    const root = container.firstElementChild!;

    expect(root).toHaveClass('mine');
    expect(root.className.split(' ').length).toBeGreaterThan(1);
  });

  it('passes anything else through to the root', () => {
    const { container } = render(
      <Collapsible label="Shipping" id="ship" data-testid="col">Body</Collapsible>
    );
    const root = container.firstElementChild!;

    expect(root).toHaveAttribute('id', 'ship');
    expect(root).toHaveAttribute('data-testid', 'col');
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Collapsible ref={ref} label="Shipping">Body</Collapsible>);

    expect(ref.current?.tagName).toBe('DIV');
  });

  it('drives from outside when the owner moves the state', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open from outside</button>
          <Collapsible label="Shipping" open={open} onOpenChange={setOpen}>
            Two business days.
          </Collapsible>
        </>
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Open from outside' }));

    expect(screen.getByRole('button', { name: /shipping/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});

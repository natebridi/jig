import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './dialog';

afterEach(() => vi.restoreAllMocks());

/**
 * The dialog's own behaviour is Base UI's and is not re-tested here. What is
 * Jig's is the frame: which props are optional, where the accessible name comes
 * from when there is no title, and that the close button is a sibling of the
 * panel rather than inside it — the structure 0008 D1's note asked for.
 */
describe('Dialog', () => {
  it('names itself from the title', async () => {
    render(<Dialog defaultOpen title="Discard changes?">Body</Dialog>);

    expect(screen.getByRole('dialog', { name: 'Discard changes?' })).toBeInTheDocument();
  });

  it('associates the description rather than leaving it loose text', () => {
    render(
      <Dialog defaultOpen title="Discard changes?" description="Cannot be undone.">
        Body
      </Dialog>
    );

    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Cannot be undone.');
  });

  it('renders with no frame props at all', () => {
    // 0008 D1's note: every frame prop is optional, so this is a plain panel
    // around its children.
    render(<Dialog defaultOpen aria-label="Preview">just children</Dialog>);

    const dialog = screen.getByRole('dialog', { name: 'Preview' });

    expect(dialog).toHaveTextContent('just children');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('warns in development when it has no accessible name', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Dialog defaultOpen>Body</Dialog>);

    // The type cannot require `aria-label` only when `title` is absent, so a
    // dialog announced as merely "dialog" has to be caught at runtime.
    expect(error).toHaveBeenCalledWith(expect.stringContaining('no accessible name'));
  });

  it('does not warn when either name is present', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Dialog defaultOpen title="Named">Body</Dialog>);
    render(<Dialog defaultOpen aria-label="Also named">Body</Dialog>);

    expect(error).not.toHaveBeenCalled();
  });

  it('keeps the close button outside the panel, not inside it', () => {
    render(<Dialog defaultOpen title="Terms">Body</Dialog>);

    const dialog = screen.getByRole('dialog');
    const close = screen.getByRole('button', { name: 'Close' });
    const heading = screen.getByRole('heading', { name: 'Terms' });

    // The panel is the visible frame; the close is its sibling so that
    // `closePlacement="outside"` is an offset rather than a restructure.
    const panel = heading.parentElement?.parentElement;

    expect(dialog).toContainElement(close);
    expect(panel).not.toContainElement(close);
  });

  it('renders the actions the caller passes', () => {
    render(
      <Dialog defaultOpen title="Discard?" actions={<button type="button">Discard</button>}>
        Body
      </Dialog>
    );

    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
  });

  it('opens from its trigger', async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger={<button type="button">Open</button>} title="Discard?">
        Body
      </Dialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('dialog', { name: 'Discard?' })).toBeInTheDocument();
  });

  it('reports closing through onOpenChange when controlled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Discard?">
        Body
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('forwards the ref to the panel, which is what a caller sizes', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Dialog defaultOpen title="Discard?" ref={ref}>Body</Dialog>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toContainElement(screen.getByRole('heading', { name: 'Discard?' }));
  });
})

import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './tooltip';

/**
 * jsdom implements neither the Popover API nor CSS anchor positioning, so
 * these assert the parts that are Jig's own logic — open/close scheduling,
 * handler composition and the ARIA wiring — rather than whether the bubble
 * reaches the top layer. Placement and overflow behaviour belong in a visual
 * check against a real browser.
 *
 * Real timers throughout, with short delays. Fake timers deadlock against
 * user-event's internal awaits, and the thing worth testing is the ordering,
 * which a short real delay shows just as well.
 */
describe('Tooltip', () => {
  it('describes the trigger rather than naming it', () => {
    render(
      <Tooltip content="Saves your work">
        <button>Save</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Save' });
    // The accessible *name* is still the button's own text — a tooltip is a
    // description, and using it as a name would replace the label.
    expect(trigger).toHaveAccessibleName('Save');
    expect(trigger).toHaveAccessibleDescription('Saves your work');
  });

  it('waits for the delay before opening on hover', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Tip" delay={80} onOpenChange={onOpenChange}>
        <button>Save</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Save' }));
    expect(onOpenChange).not.toHaveBeenCalled();

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
  });

  it("preserves the trigger's own handlers", async () => {
    const user = userEvent.setup();
    const onPointerEnter = vi.fn();
    render(
      <Tooltip content="Tip" delay={0}>
        <button onPointerEnter={onPointerEnter}>Save</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Save' }));
    expect(onPointerEnter).toHaveBeenCalled();
  });

  it('lets the trigger cancel the tooltip with preventDefault', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Tip" delay={0} onOpenChange={onOpenChange}>
        <button onPointerEnter={(event) => event.preventDefault()}>Save</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Save' }));
    await new Promise((r) => setTimeout(r, 50));

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Tip" defaultOpen onOpenChange={onOpenChange}>
        <button>Save</button>
      </Tooltip>
    );

    await user.keyboard('{Escape}');
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it('does not move its own state when controlled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Tip" delay={0} open={false} onOpenChange={onOpenChange}>
        <button>Save</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));

    // Still described, but the owner decides whether it is shown.
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription('Tip');
  });

  /**
   * A controlled parent is allowed to ignore `onOpenChange` — that is what
   * being the owner of the state means. These two cover what used to happen
   * when it did: the tooltip optimistically recorded itself as open, nothing
   * ever re-synced that (no prop change means no render), and its
   * request-deduplication then started lying about the rendered state.
   */
  it('repeats a controlled open request the owner ignored', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Tip" delay={0} closeDelay={0} open={false} onOpenChange={onOpenChange}>
        <button>Save</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Save' });

    await user.hover(trigger);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));

    // Focus is a second, independent request to open. The owner ignored the
    // first, so the tooltip is still closed and still has something to ask for.
    onOpenChange.mockClear();
    await user.tab();
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
  });

  it('does not report a close for a controlled tooltip that never opened', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Tip" delay={0} closeDelay={0} open={false} onOpenChange={onOpenChange}>
        <button>Save</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Save' });

    await user.hover(trigger);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));

    onOpenChange.mockClear();
    await user.unhover(trigger);

    // `open` stayed false throughout, so there is no close to report.
    await waitFor(() => expect(onOpenChange).not.toHaveBeenCalledWith(false));
  });

  it('keeps an existing aria-describedby alongside its own', () => {
    render(
      <>
        <span id="hint">Existing</span>
        <Tooltip content="Tip">
          <button aria-describedby="hint">Save</button>
        </Tooltip>
      </>
    );

    expect(screen.getByRole('button', { name: 'Save' }))
      .toHaveAccessibleDescription('Existing Tip');
  });
});

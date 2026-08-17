import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ToggleButton } from './togglebutton';

describe('ToggleButton', () => {
  it('manages its own pressed state when uncontrolled', async () => {
    const user = userEvent.setup();
    render(<ToggleButton defaultPressed={false}>Bold</ToggleButton>);

    const button = screen.getByRole('button', { name: 'Bold' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not move its own state when controlled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<ToggleButton pressed={false} onPressedChange={onPressedChange}>Bold</ToggleButton>);

    const button = screen.getByRole('button', { name: 'Bold' });
    await user.click(button);

    // The owner decides; the button only reports.
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.objectContaining({ cancel: expect.any(Function) }));
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('follows a controlled value back down', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [pressed, setPressed] = useState(false);
      return <ToggleButton pressed={pressed} onPressedChange={setPressed}>Bold</ToggleButton>;
    }

    render(<Controlled />);
    const button = screen.getByRole('button', { name: 'Bold' });

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  // Replaced the earlier `onClick` + `preventDefault` contract, which Base UI
  // does not read. Decision 0005 D2 — kept as a test rather than deleted, so the
  // veto behaviour stays pinned under its new mechanism.
  it('lets a handler cancel the toggle with details.cancel()', async () => {
    const user = userEvent.setup();
    render(
      <ToggleButton onPressedChange={(_pressed, details) => details.cancel()}>
        Bold
      </ToggleButton>
    );

    await user.click(screen.getByRole('button', { name: 'Bold' }));

    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
  });

  // The bug this caught: consumer props were being spread onto the element
  // after Base UI's, which replaced its onClick and stopped the toggle working
  // for anyone who passed one.
  it('still toggles when a consumer passes its own onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ToggleButton onClick={onClick}>Bold</ToggleButton>);

    await user.click(screen.getByRole('button', { name: 'Bold' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('names an icon-only toggle from its label', () => {
    render(<ToggleButton isIconOnly icon="star" label="Favourite" />);
    expect(screen.getByRole('button', { name: 'Favourite' })).toBeInTheDocument();
  });

  it('defaults to type=button so it cannot submit a surrounding form', () => {
    render(<ToggleButton>Bold</ToggleButton>);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('type', 'button');
  });

  it('keeps its own aria-pressed when a consumer passes a conflicting one', async () => {
    const user = userEvent.setup();
    // `aria-pressed` is Omitted from the public props, but that alone does not
    // stop this: TypeScript exempts hyphenated JSX attributes from excess
    // property checks, so the type cannot reject it. Setting owned attributes
    // *after* the spread is what actually guarantees the DOM agrees with the
    // component — which is what this asserts.
    render(<ToggleButton aria-pressed="false">Bold</ToggleButton>);

    const button = screen.getByRole('button', { name: 'Bold' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});

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
    expect(onPressedChange).toHaveBeenCalledWith(true);
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

  it('lets a handler cancel the toggle with preventDefault', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton
        onClick={(event) => event.preventDefault()}
        onPressedChange={onPressedChange}
      >
        Bold
      </ToggleButton>
    );

    await user.click(screen.getByRole('button', { name: 'Bold' }));

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
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

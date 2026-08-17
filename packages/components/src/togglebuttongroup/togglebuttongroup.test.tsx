import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleButtonGroup } from './togglebuttongroup';
import { ToggleButton } from '../togglebutton';

const pressedNames = () =>
  screen
    .getAllByRole('button')
    .filter((button) => button.getAttribute('aria-pressed') === 'true')
    .map((button) => button.textContent);

const format = (props: Partial<Parameters<typeof ToggleButtonGroup>[0]> = {}) =>
  render(
    <ToggleButtonGroup aria-label="Format" {...props}>
      <ToggleButton value="bold">Bold</ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
  );

describe('ToggleButtonGroup', () => {
  it('exposes itself as a named group', () => {
    format();

    expect(screen.getByRole('group', { name: 'Format' })).toBeInTheDocument();
  });

  it('presses the buttons named by its value', () => {
    format({ defaultValue: ['italic'] });

    expect(pressedNames()).toEqual(['Italic']);
  });

  it('releases the others when only one may be pressed', async () => {
    const user = userEvent.setup();
    format({ defaultValue: ['bold'] });

    await user.click(screen.getByRole('button', { name: 'Italic' }));

    expect(pressedNames()).toEqual(['Italic']);
  });

  it('keeps the others pressed when multiple is set', async () => {
    const user = userEvent.setup();
    format({ multiple: true, defaultValue: ['bold'] });

    await user.click(screen.getByRole('button', { name: 'Italic' }));

    expect(pressedNames()).toEqual(['Bold', 'Italic']);
  });

  it('reports the value as an array, even in single-select', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    format({ onValueChange });

    await user.click(screen.getByRole('button', { name: 'Bold' }));

    expect(onValueChange).toHaveBeenLastCalledWith(['bold']);
  });

  it('moves focus between buttons with the arrow keys rather than tab', async () => {
    const user = userEvent.setup();
    format();

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Bold' }));

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Italic' }));
  });

  it('takes only one tab stop for the whole group', async () => {
    const user = userEvent.setup();
    format();

    await user.tab();
    await user.tab();

    expect(screen.getByRole('group', { name: 'Format' })).not.toContainElement(
      document.activeElement as HTMLElement
    );
  });

  it('disables every button when the group is disabled', () => {
    format({ disabled: true });

    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
  });

  /**
   * The reason D2 chose `details.cancel()` over the old `preventDefault`
   * contract: only this route reaches the group's value commit. A veto on the
   * button has to leave the group where it was.
   */
  it('lets a button veto the group value change', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleButtonGroup aria-label="Format" defaultValue={['bold']} onValueChange={onValueChange}>
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic" onPressedChange={(_pressed, details) => details.cancel()}>
          Italic
        </ToggleButton>
      </ToggleButtonGroup>
    );

    await user.click(screen.getByRole('button', { name: 'Italic' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(pressedNames()).toEqual(['Bold']);
  });

  it('narrows the reported value to the group type', async () => {
    const user = userEvent.setup();
    const seen: ('bold' | 'italic')[] = [];

    render(
      <ToggleButtonGroup<'bold' | 'italic'>
        aria-label="Format"
        onValueChange={(value) => seen.push(...value)}
      >
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
      </ToggleButtonGroup>
    );

    await user.click(screen.getByRole('button', { name: 'Bold' }));

    expect(seen).toEqual(['bold']);
  });
});

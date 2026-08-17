import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './slider';

/**
 * Base UI keeps the thumb at `visibility: hidden` until it can measure the
 * control, and jsdom performs no layout, so it never becomes visible. That is a
 * direct consequence of `thumbAlignment="edge"`: swapping to `center` makes
 * every query below pass unchanged.
 *
 * `getByRole` will still find the input with `hidden: true`, but the accessible
 * *name* computes to empty inside a hidden subtree, so a `{ name }` filter never
 * matches. Querying by label instead asserts the same association — that the
 * label reaches the input Base UI nests in the thumb — without depending on
 * layout the environment does not do. One test below still asserts the role.
 */
const control = (name: string) =>
  screen.getByLabelText(name, { selector: 'input[type="range"]' });

/**
 * jsdom implements neither CSS anchor positioning nor pointer dragging, so the
 * value bubble's placement and its appear-on-drag behaviour are visual checks,
 * not assertions here. What is testable is the wiring Jig owns: the accessible
 * range contract, the stepper arithmetic, and that the description reaches the
 * input Base UI nests inside the thumb.
 */
describe('Slider', () => {
  it('names the slider with its label and exposes it as a slider', () => {
    render(<Slider label="Sweetness" />);

    expect(control('Sweetness')).toBeInTheDocument();
    expect(screen.getByRole('slider', { hidden: true })).toBe(control('Sweetness'));
  });

  it('reflects the range onto the accessible control', () => {
    render(<Slider label="Sweetness" min={10} max={40} step={5} defaultValue={25} />);

    const input = control('Sweetness');

    expect(input).toHaveAttribute('min', '10');
    expect(input).toHaveAttribute('max', '40');
    expect(input).toHaveAttribute('step', '5');
    expect(input).toHaveValue('25');
  });

  it('ties the description to the input rather than leaving it loose text', () => {
    render(<Slider label="Sweetness" description="How sweet the result should be" />);

    expect(control('Sweetness')).toHaveAccessibleDescription(
      'How sweet the result should be'
    );
  });

  it('has no steppers unless asked', () => {
    render(<Slider label="Sweetness" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('labels the steppers with the direction and the field', () => {
    render(<Slider label="Sweetness" steppers />);

    expect(screen.getByRole('button', { name: 'Decrease Sweetness' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Increase Sweetness' })).toBeInTheDocument();
  });

  it('moves by exactly one step per press', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider label="Sweetness" step={5} defaultValue={50} steppers onValueChange={onValueChange} />
    );

    await user.click(screen.getByRole('button', { name: 'Increase Sweetness' }));
    expect(onValueChange).toHaveBeenLastCalledWith(55);

    await user.click(screen.getByRole('button', { name: 'Decrease Sweetness' }));
    expect(onValueChange).toHaveBeenLastCalledWith(50);
  });

  it('disables the stepper that would leave the range', () => {
    render(<Slider label="Sweetness" min={0} max={100} defaultValue={0} steppers />);

    expect(screen.getByRole('button', { name: 'Decrease Sweetness' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase Sweetness' })).toBeEnabled();
  });

  it('snaps a stepper press onto the step grid measured from min', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider
        label="Sweetness"
        min={1}
        max={10}
        step={3}
        defaultValue={1}
        steppers
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Increase Sweetness' }));

    // 1 + 3 = 4, which is on the grid 1, 4, 7, 10 — not 3.
    expect(onValueChange).toHaveBeenLastCalledWith(4);
  });

  it('responds to the keyboard, which is what the value bubble also follows', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider label="Sweetness" defaultValue={50} onValueChange={onValueChange} />);

    // Tab order skips the hidden input in jsdom; focusing it directly exercises
    // the same key handling.
    control('Sweetness').focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenLastCalledWith(51);
  });

  it('leaves a controlled value alone until the caller changes it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider label="Sweetness" value={30} steppers onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Increase Sweetness' }));

    expect(onValueChange).toHaveBeenCalledWith(31);
    expect(control('Sweetness')).toHaveValue('30');
  });

  /**
   * The value bubble's visibility is pure CSS keyed off the root, so what is
   * assertable here is the DOM condition that drives it. jsdom applies no
   * stylesheet, and a computed-style assertion would test nothing.
   *
   * This started as `[data-focused]`, which Base UI only sets for a field
   * inside `Field.Root` — so the bubble never appeared for keyboard users at
   * all. These pin the replacement.
   */
  describe('the value bubble follows focus', () => {
    // Each case renders fresh and queries once. jsdom's selector engine caches
    // dynamic pseudo-classes, so asking before and after a focus change in the
    // same test returns the first answer twice — the at-rest case is its own
    // test below for that reason, not for style.
    it('is driven by focus on the thumb', () => {
      const { container } = render(<Slider label="Sweetness" defaultValue={50} />);

      control('Sweetness').focus();

      expect(container.firstElementChild!.matches(':focus-within')).toBe(true);
    });

    it('is driven by focus on either stepper, which is not the thumb', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider label="Sweetness" defaultValue={50} steppers />);
      const root = container.firstElementChild!;

      await user.click(screen.getByRole('button', { name: 'Increase Sweetness' }));

      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Increase Sweetness' }));
      expect(root.matches(':focus-within')).toBe(true);
    });

    it('does not claim focus when nothing is focused', () => {
      const { container } = render(<Slider label="Sweetness" defaultValue={50} steppers />);

      expect(container.firstElementChild!.matches(':focus-within')).toBe(false);
    });
  });

  it('disables the control and both steppers together', () => {
    render(<Slider label="Sweetness" defaultValue={50} steppers disabled />);

    expect(control('Sweetness')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease Sweetness' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase Sweetness' })).toBeDisabled();
  });
});

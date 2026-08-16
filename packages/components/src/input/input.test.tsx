import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

/**
 * These assert the wiring Jig is responsible for — that the label, hint and
 * error reach the control as accessible relationships, and that validity is
 * left to Field rather than duplicated here. The visual side of the focus
 * treatment (the highlighted border replacing a focus ring) is a stylesheet
 * concern and belongs in a visual check, not in jsdom.
 */
describe('Input', () => {
  it('names the control with its label', () => {
    render(<Input label="Email" />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('associates the description with the control rather than leaving it loose text', () => {
    render(<Input label="Email" description="We only use this for receipts." />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
      'We only use this for receipts.'
    );
  });

  it('marks the field invalid and shows the message when an external error is passed', () => {
    render(<Input label="Email" error="That is not an email." />);

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('That is not an email.')).toBeInTheDocument();
  });

  it('leaves validity alone when no error is passed, rather than asserting the field is valid', () => {
    render(<Input label="Email" />);

    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('forwards the ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
  });

  it('accepts typing and reports the value', async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    await user.type(input, 'nate@example.com');

    expect(input).toHaveValue('nate@example.com');
  });

  it('disables the control through the field', () => {
    render(<Input label="Email" disabled />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  });

  it('keeps the native size attribute off the API so the size ramp owns the name', () => {
    render(<Input label="Email" size="lg" />);

    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('size');
  });
});

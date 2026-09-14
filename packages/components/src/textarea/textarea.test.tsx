import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './textarea';

/**
 * These assert the wiring Jig owns — the accessible relationships, the element
 * under the props, and the two numbers that become the growth envelope. The
 * growth itself is `field-sizing: content`, which jsdom does not implement; a
 * test that appeared to check it would only be checking jsdom's zero heights.
 * The envelope is asserted as the declarations that produce it instead.
 */
describe('Textarea', () => {
  it('renders a textarea, not an input', () => {
    render(<Textarea label="Note" />);

    expect(screen.getByRole('textbox', { name: 'Note' }).tagName).toBe('TEXTAREA');
  });

  it('names the control with its label', () => {
    render(<Textarea label="Release note" />);

    expect(screen.getByRole('textbox', { name: 'Release note' })).toBeInTheDocument();
  });

  it('associates the description with the control', () => {
    render(<Textarea label="Note" description="Markdown is fine." />);

    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveAccessibleDescription(
      'Markdown is fine.'
    );
  });

  it('marks the field invalid and shows the message when an external error is passed', () => {
    render(<Textarea label="Note" error="Too long." />);

    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Too long.')).toBeInTheDocument();
  });

  it('leaves validity alone when no error is passed', () => {
    render(<Textarea label="Note" />);

    expect(screen.getByRole('textbox', { name: 'Note' })).not.toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('defaults to a three-line floor and no cap', () => {
    render(<Textarea label="Note" />);

    const control = screen.getByRole('textbox', { name: 'Note' });

    expect(control.style.getPropertyValue('--jig-textarea-lines')).toBe('3');
    // Absent rather than a large number: the stylesheet falls back to
    // `max-height: none`, so an uncapped field is uncapped by omission.
    expect(control.style.getPropertyValue('--jig-textarea-max-height')).toBe('');
  });

  it('turns lines and maxLines into the two ends of the envelope', () => {
    render(<Textarea label="Note" lines={5} maxLines={9} />);

    const control = screen.getByRole('textbox', { name: 'Note' });

    expect(control.style.getPropertyValue('--jig-textarea-lines')).toBe('5');
    // One control height, plus a line for each line after the first.
    expect(control.style.getPropertyValue('--jig-textarea-max-height')).toBe(
      'calc(var(--jig-textarea-height) + 8 * 1lh)'
    );
  });

  it('keeps rows off the API, because field-sizing makes it inert', () => {
    render(<Textarea label="Note" lines={6} />);

    expect(screen.getByRole('textbox', { name: 'Note' })).not.toHaveAttribute('rows');
  });

  it('warns in development when maxLines is below lines', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Textarea label="Note" lines={6} maxLines={2} />);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('maxLines (2) is below lines (6)'));
    spy.mockRestore();
  });

  it('does not warn when the envelope is the right way round', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Textarea label="Note" lines={2} maxLines={6} />);

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('renders the leading icon as decorative, outside the accessibility tree', () => {
    const { container } = render(<Textarea label="Note" icon="pencil-simple" />);

    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    // The name still comes from the label, not the glyph.
    expect(screen.getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
  });

  it('renders no icon slot when there is no icon', () => {
    const { container } = render(<Textarea label="Note" />);

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('puts className and style on the wrapper, which is what the layout sees', () => {
    const { container } = render(
      <Textarea label="Note" className="mine" style={{ flexGrow: 1 }} />
    );

    const control = screen.getByRole('textbox', { name: 'Note' });
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper).toHaveClass('mine');
    expect(wrapper).toHaveStyle({ flexGrow: '1' });
    expect(wrapper).toContainElement(control);
    expect(control).not.toHaveClass('mine');
  });

  it('still spreads everything else onto the control', () => {
    render(<Textarea label="Note" placeholder="What changed…" maxLength={280} readOnly />);

    const control = screen.getByRole('textbox', { name: 'Note' });

    expect(control).toHaveAttribute('placeholder', 'What changed…');
    expect(control).toHaveAttribute('maxlength', '280');
    expect(control).toHaveAttribute('readonly');
  });

  it('forwards the ref to the textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Note" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Note' }));
  });

  it('accepts typing, including newlines', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Note" />);

    const control = screen.getByRole('textbox', { name: 'Note' });
    await user.type(control, 'one{enter}two');

    expect(control).toHaveValue('one\ntwo');
  });

  it('disables the control through the field', () => {
    render(<Textarea label="Note" disabled />);

    expect(screen.getByRole('textbox', { name: 'Note' })).toBeDisabled();
  });

  it('keeps the native size attribute off the API so the size ramp owns the name', () => {
    render(<Textarea label="Note" size="lg" />);

    expect(screen.getByRole('textbox', { name: 'Note' })).not.toHaveAttribute('size');
  });
});

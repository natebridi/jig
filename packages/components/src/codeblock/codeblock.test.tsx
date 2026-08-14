import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeBlock } from './codeblock';

function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
}

describe('CodeBlock', () => {
  afterEach(() => vi.restoreAllMocks());

  it('strips the indentation a template literal picks up from its JSX', () => {
    render(
      <CodeBlock>{`
        const a = 1;
          const b = 2;
      `}</CodeBlock>
    );

    // Relative indentation is preserved; the shared leading indent is not.
    expect(screen.getByText(/const a = 1;/).textContent).toBe('const a = 1;\n  const b = 2;');
  });

  it('offers copying as an action, not a toggle', () => {
    render(<CodeBlock>{'const a = 1;'}</CodeBlock>);

    const button = screen.getByRole('button', { name: 'Copy' });
    // Copying does not leave the button in a pressed state, so it must not
    // report one — that was the bug this component shipped with.
    expect(button).not.toHaveAttribute('aria-pressed');
  });

  it('confirms a successful copy by name and in a live region', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard(writeText);

    render(<CodeBlock>{'const a = 1;'}</CodeBlock>);
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith('const a = 1;');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument());
    expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard');
  });

  it('says nothing when the clipboard refuses', async () => {
    const user = userEvent.setup();
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')));

    render(<CodeBlock>{'const a = 1;'}</CodeBlock>);
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    // Claiming a copy that never happened is worse than staying quiet.
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('keeps the code reachable by keyboard', () => {
    render(<CodeBlock>{'const a = 1;'}</CodeBlock>);
    expect(screen.getByText(/const a = 1;/).closest('pre')).toHaveAttribute('tabindex', '0');
  });
});

import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Link } from './link';

/**
 * What is worth asserting here is the wiring the decisions turned on, not the
 * appearance: that a Link is always an anchor whatever it looks like, that
 * `external` sets all four things it promised rather than three, and that
 * `render` composes instead of replacing. Colours and underlines are
 * stylesheet concerns and belong in a visual check.
 */
describe('Link', () => {
  it('is an anchor whatever variant it wears', () => {
    render(
      <>
        <Link href="/a">Text</Link>
        <Link href="/b" variant="primary">Primary</Link>
      </>
    );

    // A link that looks like a button is still announced as a link, activates
    // on Enter alone, and can be middle-clicked. 0009's context turns on this.
    expect(screen.getByRole('link', { name: 'Text' }).tagName).toBe('A');
    expect(screen.getByRole('link', { name: 'Primary' }).tagName).toBe('A');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('takes different classes for the text and box variants', () => {
    // 0009 D2's outcome: only the box variants reach the Button recipe,
    // because its `inline-flex` would stop a text link wrapping mid-sentence.
    const { rerender } = render(<Link href="/a">Label</Link>);
    const text = screen.getByRole('link').className;

    rerender(<Link href="/a" variant="ghost">Label</Link>);
    const box = screen.getByRole('link').className;

    expect(text).not.toBe(box);
  });

  it('opens a new tab, secures it, and says so, when external', () => {
    render(<Link href="https://example.com" external>Base UI</Link>);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    // The announcement is the half that is easy to drop, and dropping it is
    // what makes a new tab a surprise. 0009 D6.
    expect(link).toHaveAccessibleName('Base UI (opens in a new tab)');
  });

  it('leaves target and rel alone when not external', () => {
    render(<Link href="/local">Local</Link>);

    const link = screen.getByRole('link');

    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    expect(link).toHaveAccessibleName('Local');
  });

  it('renders a decorative icon without announcing it', () => {
    render(<Link href="/a" icon="arrow-right" iconPosition="end">Continue</Link>);

    // The label names the link; an icon repeating it would be announced twice.
    expect(screen.getByRole('link')).toHaveAccessibleName('Continue');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('composes with a supplied element rather than replacing it', () => {
    // 0009 D4: `render` merges, so Jig's classes and the caller's own
    // attributes both survive. Replacing would drop one of the two.
    render(
      <Link href="/docs" variant="ghost" render={<a data-router="next" />}>
        Docs
      </Link>
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('data-router', 'next');
    expect(link).toHaveAttribute('href', '/docs');
    expect(link.className).not.toBe('');
  });

  it('leaves the box variants\' hover to the Button recipe', () => {
    // The hover colour is the text variant's alone. A box variant already
    // gets `hoverBg` from `button()`, and a colour shift on top would fight
    // it. Asserted through the class, since jsdom computes no cascade.
    const { rerender } = render(<Link href="/a">Label</Link>);
    const text = screen.getByRole('link').className;

    rerender(<Link href="/a" variant="primary">Label</Link>);

    expect(screen.getByRole('link').className).not.toBe(text);
  });

  it('forwards a ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Link href="/a" ref={ref}>Label</Link>);

    expect(ref.current?.tagName).toBe('A');
  });
});

import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SideNavSection } from './sidenavsection';
import { ListItem } from '../listitem';

describe('SideNavSection', () => {
  /**
   * 0014 D2. The role as well as the element: WebKit drops list semantics from
   * a `ul` whose `list-style` is `none`, which is every sidebar there is.
   */
  it('wraps its rows in a ul carrying an explicit list role', () => {
    render(
      <SideNavSection label="Components">
        <ListItem href="/a">Button</ListItem>
        <ListItem href="/b">Combobox</ListItem>
      </SideNavSection>
    );

    const list = screen.getByRole('list');
    expect(list.tagName).toBe('UL');
    expect(list).toHaveAttribute('role', 'list');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('is a bare list when no label is given', () => {
    render(
      <SideNavSection>
        <ListItem href="/a">Button</ListItem>
      </SideNavSection>
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows a static label without a disclosure when not collapsible', () => {
    render(<SideNavSection label="Components"><ListItem href="/a">Button</ListItem></SideNavSection>);

    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  /** 0014 D4 — the disclosure is Collapsible's, not a second implementation. */
  it('makes the label a disclosure when collapsible', async () => {
    render(
      <SideNavSection label="Components" collapsible>
        <ListItem href="/a">Button</ListItem>
      </SideNavSection>
    );

    const trigger = screen.getByRole('button', { name: /components/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('honours defaultOpen and reports changes', async () => {
    const seen: boolean[] = [];
    render(
      <SideNavSection label="Components" collapsible defaultOpen onOpenChange={(o) => seen.push(o)}>
        <ListItem href="/a">Button</ListItem>
      </SideNavSection>
    );

    expect(screen.getByRole('button', { name: /components/i })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('button', { name: /components/i }));
    expect(seen).toEqual([false]);
  });

  /** `collapsible` with nothing to press is not a disclosure. */
  it('stays static when collapsible is set without a label', () => {
    render(<SideNavSection collapsible><ListItem href="/a">Button</ListItem></SideNavSection>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('forwards a ref to the section root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SideNavSection ref={ref} label="Components"><ListItem href="/a">B</ListItem></SideNavSection>);
    expect(ref.current?.tagName).toBe('DIV');
  });
});

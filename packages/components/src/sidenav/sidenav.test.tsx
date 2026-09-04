import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SideNav } from './sidenav';
import { SideNavSection } from '../sidenavsection';
import { ListItem } from '../listitem';

describe('SideNav', () => {
  it('is a navigation landmark named by aria-label', () => {
    render(
      <SideNav aria-label="Docs">
        <SideNavSection><ListItem href="/a">Button</ListItem></SideNavSection>
      </SideNav>
    );

    const nav = screen.getByRole('navigation', { name: 'Docs' });
    expect(nav.tagName).toBe('NAV');
  });

  it('warns in development when it has no accessible name', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<SideNav><SideNavSection><ListItem href="/a">B</ListItem></SideNavSection></SideNav>);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('SideNav'));
    spy.mockRestore();
  });

  it('renders header and footer only when given', () => {
    const { rerender } = render(<SideNav aria-label="Docs">body</SideNav>);
    expect(screen.queryByText('top')).not.toBeInTheDocument();
    expect(screen.queryByText('bottom')).not.toBeInTheDocument();

    rerender(
      <SideNav aria-label="Docs" header={<span>top</span>} footer={<span>bottom</span>}>
        body
      </SideNav>
    );
    expect(screen.getByText('top')).toBeInTheDocument();
    expect(screen.getByText('bottom')).toBeInTheDocument();
  });

  it('keeps header and footer outside the scrolling middle', () => {
    render(
      <SideNav aria-label="Docs" header={<span>top</span>} footer={<span>bottom</span>}>
        <SideNavSection><ListItem href="/a">Button</ListItem></SideNavSection>
      </SideNav>
    );

    // The list scrolls; the pinned bands must not be inside whatever scrolls.
    const list = screen.getByRole('list');
    const scroller = list.closest('[class*="scrollarea"], [data-slot]') ?? list.parentElement;
    expect(scroller).not.toContainElement(screen.getByText('top'));
    expect(scroller).not.toContainElement(screen.getByText('bottom'));
  });

  it('forwards a ref to the nav element', () => {
    const ref = createRef<HTMLElement>();
    render(<SideNav ref={ref} aria-label="Docs">body</SideNav>);
    expect(ref.current?.tagName).toBe('NAV');
  });
});

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Adorn, Button, CodeBlock, Collapsible, Combobox, Dialog, Grid, Icon, IconButton, Link, ListItem, ScrollArea, Separator, SideNav, SideNavSection, Stack, ToggleButton, Token, Typography } from './index';

/**
 * Refs are plain props under React 19, so there is no forwardRef wrapper to
 * forget — but there is still a spread to get wrong. These assert the ref
 * reaches a real DOM node, which the type alone cannot show.
 */
describe('refs', () => {
  it('resolves to the rendered element', () => {
    const cases = [
      ['Button', createRef<HTMLButtonElement>(), (r: never) => <Button ref={r}>x</Button>, 'BUTTON'],
      ['IconButton', createRef<HTMLButtonElement>(), (r: never) => <IconButton ref={r} icon="gear" label="s" />, 'BUTTON'],
      ['ToggleButton', createRef<HTMLButtonElement>(), (r: never) => <ToggleButton ref={r}>x</ToggleButton>, 'BUTTON'],
      ['Stack', createRef<HTMLElement>(), (r: never) => <Stack ref={r} />, 'DIV'],
      ['Grid', createRef<HTMLElement>(), (r: never) => <Grid ref={r} />, 'DIV'],
      ['Typography', createRef<HTMLElement>(), (r: never) => <Typography ref={r} />, 'DIV'],
      ['Adorn', createRef<HTMLElement>(), (r: never) => <Adorn ref={r} />, 'SPAN'],
      ['Icon', createRef<SVGSVGElement>(), (r: never) => <Icon ref={r} icon="gear" />, 'svg'],
      ['CodeBlock', createRef<HTMLDivElement>(), (r: never) => <CodeBlock ref={r}>{'a'}</CodeBlock>, 'DIV'],
      // Token's ref follows the element its props select, which is the one
      // place 0006 D4's degrading element shows up in the type.
      ['Token', createRef<HTMLSpanElement>(), (r: never) => <Token ref={r}>x</Token>, 'SPAN'],
      ['Token as link', createRef<HTMLAnchorElement>(), (r: never) => <Token ref={r} href="/x">x</Token>, 'A'],
      ['Token with both', createRef<HTMLSpanElement>(), (r: never) => <Token ref={r} href="/x" onRemove={() => {}}>x</Token>, 'SPAN'],
      ['Link', createRef<HTMLAnchorElement>(), (r: never) => <Link ref={r} href="/x">x</Link>, 'A'],
      // Still the anchor when the element is the caller's: 0009 D4's `render`
      // composes with what it is given rather than handing the ref elsewhere.
      ['Link with render', createRef<HTMLAnchorElement>(), (r: never) => <Link ref={r} href="/x" render={<a data-router="" />}>x</Link>, 'A'],
      // A box-variant Link is still an anchor, which is the whole of 0009's
      // context: it looks like a button and is announced as a link.
      ['Link as button', createRef<HTMLAnchorElement>(), (r: never) => <Link ref={r} href="/x" variant="primary">x</Link>, 'A'],
      // The input, not the field wrapper — the element a caller would focus.
      ['Combobox', createRef<HTMLInputElement>(), (r: never) => <Combobox ref={r} label="l" items={[{ value: 'a', label: 'A' }]} />, 'INPUT'],
      ['Separator', createRef<HTMLDivElement>(), (r: never) => <Separator ref={r} />, 'DIV'],
      // The root, not the trigger — the root is the element a caller sizes.
      ['Collapsible', createRef<HTMLDivElement>(), (r: never) => <Collapsible ref={r} label="l">x</Collapsible>, 'DIV'],
      // ListItem's ref follows `as`, which is the second place polymorphism
      // shows up in a ref type after Token's degrading element (0014 D2).
      ['ListItem', createRef<HTMLLIElement>(), (r: never) => <ListItem ref={r}>x</ListItem>, 'LI'],
      ['ListItem as div', createRef<HTMLDivElement>(), (r: never) => <ListItem as="div" ref={r}>x</ListItem>, 'DIV'],
      ['SideNavSection', createRef<HTMLDivElement>(), (r: never) => <SideNavSection ref={r}>x</SideNavSection>, 'DIV'],
      // The nav itself, which is the landmark and the element a caller sizes.
      ['SideNav', createRef<HTMLElement>(), (r: never) => <SideNav ref={r} aria-label="l">x</SideNav>, 'NAV'],
      // The root, not the viewport — the root is the element a caller sizes.
      ['ScrollArea', createRef<HTMLDivElement>(), (r: never) => <ScrollArea ref={r}>x</ScrollArea>, 'DIV'],
      // The panel — the visible frame — not Base UI's positioning popup.
      ['Dialog', createRef<HTMLDivElement>(), (r: never) => <Dialog ref={r} defaultOpen title="t">x</Dialog>, 'DIV'],
    ] as const;

    for (const [name, ref, renderCase, tag] of cases) {
      const { unmount } = render(renderCase(ref as never));
      expect(ref.current, `${name} did not receive a ref`).not.toBeNull();
      expect(ref.current?.tagName, `${name} ref pointed at the wrong element`).toBe(tag);
      unmount();
    }
  });

  it('honours `as` when resolving the ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Stack as="section" ref={ref} />);
    expect(ref.current?.tagName).toBe('SECTION');
  });
});

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Adorn, Button, CodeBlock, Grid, Icon, IconButton, ScrollArea, Stack, ToggleButton, Token, Typography } from './index';

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
      // The root, not the viewport — the root is the element a caller sizes.
      ['ScrollArea', createRef<HTMLDivElement>(), (r: never) => <ScrollArea ref={r}>x</ScrollArea>, 'DIV'],
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

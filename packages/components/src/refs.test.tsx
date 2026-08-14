import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Adorn, Button, CodeBlock, Grid, IconButton, Stack, ToggleButton, Typography } from './index';
import { Icon } from './icons';

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

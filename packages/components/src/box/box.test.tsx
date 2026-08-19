import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box } from './box';
import { Grid } from '../grid';
import { Stack } from '../stack';

/**
 * jsdom does not lay anything out, so these assert what the components emit
 * rather than where boxes land: that a prop produces a class at all, that the
 * inapplicable ones stay quiet, and — the part with a real rule behind it —
 * that a Box's span outranks a Grid's distribution. Whether 3 + 3 + 9 + 9
 * actually fills the row is a visual check.
 */
describe('Box', () => {
  it('emits nothing beyond its base when given no layout props', () => {
    render(<Box data-testid="box">content</Box>);

    // One class: the base. No stray sprinkle classes from undefined props.
    expect(screen.getByTestId('box').className.trim().split(/\s+/)).toHaveLength(1);
  });

  it('produces different classes for different spans', () => {
    render(
      <>
        <Box data-testid="a" span={6}>a</Box>
        <Box data-testid="b" span={18}>b</Box>
      </>
    );

    expect(screen.getByTestId('a').className).not.toBe(screen.getByTestId('b').className);
  });

  it('treats grow as a boolean rather than requiring a string key', () => {
    render(
      <>
        <Box data-testid="on" grow>on</Box>
        <Box data-testid="off" grow={false}>off</Box>
      </>
    );

    expect(screen.getByTestId('on').className).not.toBe(screen.getByTestId('off').className);
  });

  it('accepts the responsive object form on every layout prop', () => {
    render(
      <Box data-testid="box" span={{ xs: 24, md: 8 }} grow={{ xs: false, md: true }}>
        content
      </Box>
    );

    // Two breakpoints per prop, plus the base class.
    expect(screen.getByTestId('box').className.trim().split(/\s+/).length).toBeGreaterThan(1);
  });

  it('takes spacing props like the other layout components', () => {
    render(
      <>
        <Box data-testid="plain">a</Box>
        <Box data-testid="padded" p="400">b</Box>
      </>
    );

    expect(screen.getByTestId('padded').className).not.toBe(screen.getByTestId('plain').className);
  });

  it('renders as another element when asked', () => {
    render(<Box as="li" data-testid="box">item</Box>);

    expect(screen.getByTestId('box').tagName).toBe('LI');
  });

  it('keeps its own span class when a parent Grid is also distributing', () => {
    render(
      <Grid columns={3} data-testid="grid">
        <div data-testid="distributed">a</div>
        <Box data-testid="explicit" span={16}>b</Box>
      </Grid>
    );

    // The distribution is a zero-specificity descendant rule, so the plain
    // child carries no class of its own while the Box carries a real one —
    // which is what makes the Box win in the cascade.
    expect(screen.getByTestId('distributed').className).toBe('');
    expect(screen.getByTestId('explicit').className).not.toBe('');
  });
});

describe('Grid', () => {
  it('distributes through a class on itself rather than by touching children', () => {
    render(
      <Grid columns={3} data-testid="grid">
        <div data-testid="child">a</div>
      </Grid>
    );

    expect(screen.getByTestId('grid').className).not.toBe('');
    expect(screen.getByTestId('child').className).toBe('');
  });

  it('produces different classes for different column counts', () => {
    render(
      <>
        <Grid data-testid="three" columns={3}><div /></Grid>
        <Grid data-testid="four" columns={4}><div /></Grid>
      </>
    );

    expect(screen.getByTestId('three').className).not.toBe(screen.getByTestId('four').className);
  });

  it('adds one distribution class per named breakpoint', () => {
    render(
      <>
        <Grid data-testid="fixed" columns={3}><div /></Grid>
        <Grid data-testid="responsive" columns={{ xs: 1, md: 3 }}><div /></Grid>
      </>
    );

    const count = (id: string) => screen.getByTestId(id).className.trim().split(/\s+/).length;

    expect(count('responsive')).toBe(count('fixed') + 1);
  });

  it('takes align and justify, which it previously had no way to express', () => {
    render(
      <>
        <Grid data-testid="plain"><div /></Grid>
        <Grid data-testid="aligned" align="end"><div /></Grid>
      </>
    );

    expect(screen.getByTestId('aligned').className).not.toBe(screen.getByTestId('plain').className);
  });
});

describe('layout children', () => {
  /**
   * Box, Stack and Grid all carry the same three child-side props, so the
   * thing worth asserting is that they are the *same* props — one class per
   * value, shared across the three — rather than three parallel
   * implementations that happen to agree today.
   *
   * Written out rather than parameterised over the components: they are
   * generic in their element, which makes them awkward to hold in a variable
   * and use as a JSX tag.
   */
  const classesOf = (id: string) =>
    new Set(screen.getByTestId(id).className.trim().split(/\s+/));

  const sharedByAllThree = () => {
    const box = classesOf('Box');
    const stack = classesOf('Stack');
    const grid = classesOf('Grid');
    return [...box].filter((c) => stack.has(c) && grid.has(c));
  };

  it.each([
    [
      'span',
      <>
        <Box data-testid="Box" span={8}>x</Box>
        <Stack data-testid="Stack" span={8}>x</Stack>
        <Grid data-testid="Grid" span={8}>x</Grid>
      </>,
    ],
    [
      'grow',
      <>
        <Box data-testid="Box" grow>x</Box>
        <Stack data-testid="Stack" grow>x</Stack>
        <Grid data-testid="Grid" grow>x</Grid>
      </>,
    ],
    [
      'alignSelf',
      <>
        <Box data-testid="Box" alignSelf="center">x</Box>
        <Stack data-testid="Stack" alignSelf="center">x</Stack>
        <Grid data-testid="Grid" alignSelf="center">x</Grid>
      </>,
    ],
  ])('resolves %s to one class shared by all three primitives', (_prop, tree) => {
    render(tree);

    // Exactly one: the sprinkle for this prop. The base classes differ.
    expect(sharedByAllThree()).toHaveLength(1);
  });

  it.each([
    [
      'Box',
      <>
        <Box data-testid="plain">a</Box>
        <Box data-testid="spanned" span={8}>b</Box>
      </>,
    ],
    [
      'Stack',
      <>
        <Stack data-testid="plain">a</Stack>
        <Stack data-testid="spanned" span={8}>b</Stack>
      </>,
    ],
    [
      'Grid',
      <>
        <Grid data-testid="plain">a</Grid>
        <Grid data-testid="spanned" span={8}>b</Grid>
      </>,
    ],
  ])('adds nothing to %s when no child props are given', (_name, tree) => {
    render(tree);

    const count = (id: string) => classesOf(id).size;

    expect(count('spanned')).toBe(count('plain') + 1);
  });

  it.each([
    ['Box', <Box data-testid="explicit" span={16}>b</Box>],
    ['Stack', <Stack data-testid="explicit" span={16}>b</Stack>],
    ['Grid', <Grid data-testid="explicit" span={16}>b</Grid>],
  ])('lets %s outrank a parent Grid distribution', (_name, child) => {
    render(
      <Grid columns={3}>
        <div data-testid="distributed">a</div>
        {child}
      </Grid>
    );

    // The distribution is a zero-specificity descendant rule, so the plain
    // child carries no class of its own while the layout child carries a real
    // one — which is what makes it win in the cascade.
    expect(screen.getByTestId('distributed').className).toBe('');
    expect(screen.getByTestId('explicit').className).not.toBe('');
  });

  it('does not leak an outer Grid distribution past a nested Grid', () => {
    render(
      <Grid columns={3}>
        <Grid data-testid="inner" span={12}>
          <div data-testid="grandchild">a</div>
        </Grid>
      </Grid>
    );

    // `:where(.marker) > *` is a direct-child rule, so the outer Grid reaches
    // the inner one and stops. A descendant selector would silently give the
    // grandchild a span of the *outer* grid's tracks.
    expect(screen.getByTestId('grandchild').className).toBe('');
    expect(screen.getByTestId('inner').className).not.toBe('');
  });

  it('keeps align and alignSelf apart on a container', () => {
    render(
      <>
        <Stack data-testid="children" align="center">a</Stack>
        <Stack data-testid="self" alignSelf="center">b</Stack>
      </>
    );

    // One is what the Stack does to its children, the other what it does to
    // itself. Collapsing them onto one class would make a spanning Stack
    // silently restyle its contents.
    expect(screen.getByTestId('children').className).not.toBe(
      screen.getByTestId('self').className
    );
  });
});

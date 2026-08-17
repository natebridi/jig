import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box } from './box';
import { Grid } from '../grid';

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

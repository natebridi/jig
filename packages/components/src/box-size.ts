import type { CSSProperties } from 'react';

/**
 * Box-dimension props shared by every component that accepts them. Unlike
 * spacing, these take any CSS length directly (`'320px'`, `'50%'`, `'100vh'`)
 * rather than a token scale — width and height are rarely on one — so they're
 * applied as inline styles instead of compiling to atomic classes.
 *
 * @example
 * <Stack maxWidth="640px">...</Stack>
 * <Grid height="100%" minHeight={200}>...</Grid>
 */
export interface BoxSizeProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  minHeight?: CSSProperties['minHeight'];
  maxWidth?: CSSProperties['maxWidth'];
}

const boxSizeKeys = new Set<keyof BoxSizeProps>(['width', 'height', 'minHeight', 'maxWidth']);

/**
 * Splits the box-dimension props out of a component's props, returning the
 * inline style they compile to alongside everything left over for the DOM
 * element.
 */
export function splitBoxSize<P extends object>(props: P) {
  const style: CSSProperties = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (boxSizeKeys.has(key as keyof BoxSizeProps)) {
      if (value !== undefined) {
        (style as Record<string, unknown>)[key] = value;
        /* If you're setting a maxWidth, assume you want it to be centered */
        if (key == 'maxWidth') style['marginInline'] = 'auto';
      }
    } else {
      rest[key] = value;
    }
  }

  return {
    style,
    rest: rest as Omit<P, keyof BoxSizeProps>,
  };
}

import { createRef, type RefObject } from 'react';
import { describe, expect, it } from 'vitest';
import { Adorn, Box, Button, Combobox, Grid, IconButton, Link, Separator, Stack, ToggleButton, Token, Typography } from './index';

/**
 * Compile-only assertions about the public API. Nothing here runs anything
 * meaningful — the `@ts-expect-error` directives are the test, and `tsc`
 * failing to find an error is itself a build failure (TS2578, "unused
 * @ts-expect-error"). The `typecheck` task is what enforces this file; Vitest
 * just keeps it in the suite so it cannot be quietly dropped.
 *
 * Note what is deliberately *not* asserted here: TypeScript exempts
 * hyphenated JSX attributes (`aria-*`, `data-*`) from excess property checks,
 * so omitting `aria-pressed` from a prop type cannot make passing it an error.
 * Those are guarded at runtime instead — see togglebutton.test.tsx.
 */
describe('public API types', () => {
  it('constrains icon-only buttons to carry a label', () => {
    <>
      <IconButton icon="gear" label="Settings" />
      {/* @ts-expect-error an icon-only button has no visible text to name it */}
      <IconButton icon="gear" />
      <ToggleButton isIconOnly icon="star" label="Favourite" />
      {/* @ts-expect-error same contract on the toggle */}
      <ToggleButton isIconOnly icon="star" />
      {/* @ts-expect-error an icon-only toggle with no icon is an empty square */}
      <ToggleButton isIconOnly label="Favourite" />
    </>;
    expect(true).toBe(true);
  });

  it('constrains variants and sizes to the known sets', () => {
    <>
      <Button variant="primary" size="lg">ok</Button>
      {/* @ts-expect-error not a variant */}
      <Button variant="tertiary">no</Button>
      {/* @ts-expect-error not a size */}
      <Button size="xl">no</Button>
      {/* @ts-expect-error not an icon in the curated set */}
      <Button icon="not-an-icon">no</Button>
      <Typography with="heading01" balance />
      {/* @ts-expect-error balance is a boolean, not a wrap mode */}
      <Typography balance="pretty" />
    </>;
    expect(true).toBe(true);
  });

  it("constrains Typography's tone to the semantic roles", () => {
    <>
      <Typography tone="muted" with="caption01" />
      <Typography tone="inverse" />
      {/* @ts-expect-error a tone names a role, not a hue */}
      <Typography tone="fuschia" />
      {/* @ts-expect-error nor an arbitrary colour */}
      <Typography tone="#ff0000" />
      {/* @ts-expect-error `tone` is Typography's; Adorn kept `with` (0010 D4) */}
      <Adorn tone="muted" />
      <Adorn with="muted" />
    </>;
    expect(true).toBe(true);
  });

  it("correlates a Combobox's value with its selection mode", () => {
    const items = [{ value: 'ada', label: 'Ada Lovelace' }];
    <>
      <Combobox label="Assignee" items={items} value="ada" />
      <Combobox label="Reviewers" items={items} multiple value={['ada']} />
      {/* @ts-expect-error single selection takes one value, not an array */}
      <Combobox label="Assignee" items={items} value={['ada']} />
      {/* @ts-expect-error multiple takes an array, not one value */}
      <Combobox label="Reviewers" items={items} multiple value="ada" />
      {/* @ts-expect-error filtering is internal — 0011 D4 */}
      <Combobox label="Assignee" items={items} filter={null} />
      {/* @ts-expect-error and there is no route to the query either */}
      <Combobox label="Assignee" items={items} onInputValueChange={() => {}} />
    </>;
    expect(true).toBe(true);
  });

  it('keeps a Separator to its two props', () => {
    <>
      <Separator />
      <Separator orientation="vertical" decorative />
      {/* @ts-expect-error not an orientation */}
      <Separator orientation="diagonal" />
      {/* @ts-expect-error one pixel; a heavier rule is a surface */}
      <Separator size="lg" />
      {/* @ts-expect-error spacing comes from the parent */}
      <Separator mb="400" />
      {/* @ts-expect-error polymorphism stays on layout and type components */}
      <Separator as="hr" />
    </>;
    expect(true).toBe(true);
  });

  it('requires a Link to have somewhere to go', () => {
    <>
      <Link href="/docs">Docs</Link>
      {/* @ts-expect-error a link without a target is not a link */}
      <Link>Docs</Link>
      {/* @ts-expect-error :disabled never matches an anchor — use a Button */}
      <Link href="/docs" disabled>Docs</Link>
    </>;
    expect(true).toBe(true);
  });

  it('keeps `external` and a trailing icon off the same slot', () => {
    <>
      <Link href="https://example.com" external>Base UI</Link>
      {/* Both ends is legitimate: `external` only owns the trailing one. */}
      <Link href="https://example.com" external icon="gear">Base UI</Link>
      <Link href="/docs" icon="arrow-right" iconPosition="end">Docs</Link>
      {/* @ts-expect-error `external` owns the end slot — 0009 D6's outcome */}
      <Link href="https://example.com" external icon="gear" iconPosition="end">Base UI</Link>
    </>;
    expect(true).toBe(true);
  });

  it('borrows only `with` from Typography, not the rest of its surface', () => {
    <>
      <Link href="/docs" with="caption01">Docs</Link>
      {/* @ts-expect-error `with` names a preset, not a size */}
      <Link href="/docs" with="tiny">Docs</Link>
      {/* @ts-expect-error polymorphism stays on layout and type components */}
      <Link href="/docs" as="span">Docs</Link>
      {/* @ts-expect-error spacing comes from the parent */}
      <Link href="/docs" marginTop="400">Docs</Link>
      {/* @ts-expect-error `with` is the only Typography prop Link takes */}
      <Link href="/docs" balance>Docs</Link>
    </>;
    expect(true).toBe(true);
  });

  it("constrains a Token's colour to a hue on the ramp", () => {
    <>
      <Token color="fuschia" size="lg">ok</Token>
      {/* @ts-expect-error the colour axis names a hue, not an emphasis */}
      <Token color="primary">no</Token>
      {/* @ts-expect-error and not an arbitrary one either */}
      <Token color="magenta">no</Token>
      {/* @ts-expect-error not a size */}
      <Token size="xl">no</Token>
    </>;
    expect(true).toBe(true);
  });

  it('lets a Token be a link and removable at once, and points the ref at what renders', () => {
    <>
      {/* Both together is the case 0006 D4 decided to support rather than
          forbid — the anchor shrinks to the label and the button sits beside
          it. This asserts the type does not refuse it. */}
      <Token href="/tags/design" onRemove={() => {}}>Design</Token>
      <Token href="/tags/design" ref={createRef<HTMLAnchorElement>()}>Design</Token>
      <Token onRemove={() => {}} ref={createRef<HTMLSpanElement>()}>Design</Token>
      {/* @ts-expect-error a link-only Token renders an anchor, not a span */}
      <Token href="/tags/design" ref={createRef<HTMLSpanElement>()}>Design</Token>
    </>;
    expect(true).toBe(true);
  });

  it('constrains grid columns to the twelve-column grid', () => {
    <>
      <Grid columns={12} />
      <Grid columns={{ xs: 1, md: 6 }} />
      {/* @ts-expect-error thirteen columns used to silently produce no class */}
      <Grid columns={13} />
      {/* Every layout primitive is a layout child too: the same three props on
          all three, so a container nested in a container needs no wrapper. */}
      <Box span={16} grow alignSelf="center" />
      <Stack span={16} grow alignSelf="center" />
      <Grid span={16} grow alignSelf="center" />
      <Stack span={{ xs: 24, md: 8 }} />
      <Grid span={{ xs: 24, md: 8 }} />
      {/* @ts-expect-error the grid is 24 tracks wide, so 25 is not a span */}
      <Stack span={25} />
      {/* @ts-expect-error and the same ceiling holds for a nested Grid */}
      <Grid span={25} />
      {/* @ts-expect-error grow is a boolean, not a flex-grow number */}
      <Grid grow={2} />
      {/* @ts-expect-error alignSelf takes the layout align vocabulary */}
      <Stack alignSelf="space-between" />
      {/* @ts-expect-error and so did an arbitrary number */}
      <Grid columns={0} />
    </>;
    expect(true).toBe(true);
  });

  it('constrains responsive props to the declared breakpoints and scale', () => {
    <>
      <Stack spacing={{ xs: '100', xl: '900' }} mb="500" />
      {/* @ts-expect-error xxl is not a breakpoint */}
      <Stack spacing={{ xxl: '100' }} />
      {/* @ts-expect-error 950 is not a step on the scale */}
      <Stack spacing="950" />
      {/* @ts-expect-error and neither is it one for margin */}
      <Stack mb="950" />
    </>;
    expect(true).toBe(true);
  });

  it('constrains `as` to elements the component can legitimately render', () => {
    <>
      <Stack as="section" />
      <Typography as="h1" with="heading01" />
      <Adorn as="strong" with="danger" />
      {/* @ts-expect-error a Stack is not an inline phrase element */}
      <Stack as="span" />
      {/* @ts-expect-error Typography does not render interactive elements */}
      <Typography as="button" />
      {/* @ts-expect-error Adorn is inline-only */}
      <Adorn as="div" />
    </>;
    expect(true).toBe(true);
  });

  it('constrains Adorn to the semantic colours that remain', () => {
    <>
      <Adorn with="muted" />
      {/* @ts-expect-error weight moved to `as="strong"` */}
      <Adorn with="semibold" />
      {/* @ts-expect-error slant moved to `as="em"` */}
      <Adorn with="italic" />
    </>;
    expect(true).toBe(true);
  });

  it('no longer accepts the removed fluid type props', () => {
    <>
      {/* @ts-expect-error fluid sizing was removed; `with` is the only size driver */}
      <Typography sizeMin="100" sizeMax="600" />
    </>;
    expect(true).toBe(true);
  });

  it('accepts a ref as a plain prop, without forwardRef', () => {
    <>
      <Stack ref={(node) => { node?.scrollIntoView(); }} />
      <Typography ref={(node) => { node?.getBoundingClientRect(); }} />
      <Button ref={(node) => { node?.focus(); }} />
    </>;
    expect(true).toBe(true);
  });

  /**
   * The point of PolymorphicProps over a hand-declared `as` union: the props
   * and the ref follow the element. Every positive case here was a type error
   * under the previous pattern, which typed all four components as
   * `HTMLAttributes<HTMLElement>` with a `Ref<HTMLElement>`.
   */
  it('correlates element-specific props with `as`', () => {
    <>
      <Typography as="label" htmlFor="field" with="body01" />
      <Typography as="blockquote" cite="https://example.com" />
      <Stack as="ol" start={3} reversed />
      <Grid as="ol" start={1} />

      {/* @ts-expect-error htmlFor is a <label> attribute, not a <p> one */}
      <Typography as="p" htmlFor="field" />
      {/* @ts-expect-error cite is a <blockquote> attribute */}
      <Typography as="p" cite="https://example.com" />
      {/* @ts-expect-error start belongs to <ol>, not <section> */}
      <Stack as="section" start={3} />
    </>;
    expect(true).toBe(true);
  });

  it('correlates the ref type with `as`', () => {
    // Written as ref *objects*, not `Ref<T> = null`: `null` inhabits every
    // Ref type, so a null-typed ref proves nothing about the negative cases.
    const label: RefObject<HTMLLabelElement | null> = { current: null };
    const paragraph: RefObject<HTMLParagraphElement | null> = { current: null };
    const list: RefObject<HTMLOListElement | null> = { current: null };
    const generic: RefObject<HTMLElement | null> = { current: null };

    <>
      <Typography as="label" ref={label} />
      <Typography as="p" ref={paragraph} />
      <Stack as="ol" ref={list} />

      {/* @ts-expect-error a <p> does not accept an HTMLLabelElement ref */}
      <Typography as="p" ref={label} />
      {/* @ts-expect-error an <ol> ref has to be narrower than HTMLElement */}
      <Stack as="ol" ref={generic} />
    </>;
    expect(true).toBe(true);
  });

  it('no longer accepts the removed box-size props', () => {
    <>
      <Stack style={{ maxWidth: '640px', marginInline: 'auto' }} />
      {/* @ts-expect-error box dimensions moved to `style` */}
      <Stack maxWidth="640px" />
      {/* @ts-expect-error centering moved to `style` */}
      <Stack centered />
      {/* @ts-expect-error box dimensions moved to `style` */}
      <Grid minHeight={200} />
    </>;
    expect(true).toBe(true);
  });
});

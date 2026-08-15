import type { ComponentPropsWithoutRef, ComponentRef, ElementType, Ref } from 'react';

/**
 * Props for a component that renders as one of a *restricted* set of elements.
 *
 * `E` is deliberately constrained by each component to its own union of
 * legitimate tags rather than left open as `ElementType`. Arbitrary
 * polymorphism would let a Stack render as a `<span>` or Adorn as a `<div>`,
 * and would promise a flexibility the implementation never had.
 *
 * What this adds over declaring `as`, `HTMLAttributes<HTMLElement>` and `ref`
 * by hand is *correlation*: the props and the ref follow the chosen element.
 * `Typography as="label"` accepts `htmlFor`, `as="blockquote"` accepts `cite`,
 * `Stack as="ol"` accepts `start` and `reversed`, and each gets a precise ref
 * (`HTMLLabelElement`, `HTMLQuoteElement`, `HTMLOListElement`) instead of a
 * blanket `HTMLElement`. All of those were type errors under the previous
 * hand-declared pattern.
 *
 * `Own` wins on collision — `Omit`ting it from the element's attributes is
 * what lets Stack define its own `spacing` without `HTMLAttributes` fighting
 * it. `as` is omitted from the same side so it cannot be doubly declared.
 *
 * @example
 * export type StackProps<E extends StackElement = 'div'> =
 *   PolymorphicProps<E, StackOwnProps>;
 *
 * export function Stack<E extends StackElement = 'div'>(props: StackProps<E>) {}
 */
export type PolymorphicProps<E extends ElementType, Own> = Own &
  Omit<ComponentPropsWithoutRef<E>, keyof Own | 'as'> & {
    as?: E;
    ref?: Ref<ComponentRef<E>>;
  };

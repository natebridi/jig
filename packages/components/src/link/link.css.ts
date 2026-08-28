import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { typeStyles } from "../typography/typography.css";
import { linkHover, linkHoverFallback } from "./link-hover.css";
import { focusRing } from "../focus-ring";

/**
 * The text link.
 *
 * Deliberately *not* the Button recipe. 0009 D2 shares that recipe with Link,
 * and 0009 D3 then decided the text variant inherits its type from whatever
 * encloses it — while the recipe's base sets a font size, a family, padding, a
 * radius and `display: inline-flex`, every one of which contradicts that. The
 * last is the one that would actually break rather than merely look wrong: an
 * inline-flex anchor cannot fragment across lines, so a text link long enough
 * to wrap would shove the line instead of breaking inside it.
 *
 * So the five box variants go through `button()` and this recipe serves
 * `variant="text"` alone. What it declares is only what inheritance cannot
 * give it — the underline, the focus ring, and the colour the user agent would
 * otherwise paint blue.
 */
export const textLink = recipe({
  base: {
    // Both defeat a UA style rather than expressing a preference: an anchor
    // arrives coloured `-webkit-link` and underlined whatever we do. The
    // underline is put back on the label below, not here — see `textLabel`.
    color: "inherit",
    font: "inherit",
    textDecorationLine: "none",
    /**
     * The hover colour comes from the parent, not from this rule.
     *
     * A text link inherits its resting colour, so the hover has to vary with
     * whatever it inherited — a muted link should not brighten to the same
     * ink as a primary one. Whatever set the colour sets `linkHover` beside
     * it via `linkHoverFor`; the fallback covers the case where nothing did,
     * which is body copy, which is `primary`.
     */
    ":hover": {
      color: fallbackVar(linkHover, linkHoverFallback),
    },
    // Rounds the focus ring's corners rather than boxing the word squarely.
    // Too small to read as a shape of its own.
    borderRadius: "2px",
    ...focusRing,
  },
  variants: {
    /**
     * A Typography preset, for a link with no typographic parent to inherit
     * from. The same objects Typography's own `style` variant is built from,
     * imported rather than restated (0009 D3) — and they carry no colour, so
     * naming a preset still leaves the colour inherited.
     *
     * Emitted after the base, so these win over its `font: inherit`. That
     * ordering *is* the decision: 0009 D3's outcome settles that an explicit
     * `with` beats the inherited type.
     */
    with: typeStyles,
  },
});

/**
 * The underline, carried by a span around the label rather than by the anchor.
 *
 * The anchor also contains the external marker and the separator space in
 * front of it, and an underline on the anchor runs under both — stopping
 * mid-gap because an SVG takes no text decoration, which reads as the rule
 * overshooting the word. Underlining the label alone ends it where the words
 * end. It is also what the prop means: `underline` decorates the label, not
 * the anchor's whole contents.
 *
 * On by default, and `false` means off in every state — there is no hover
 * underline behind it. 0009 D5, whose outcome records that
 * `underline={false}` in running text leaves a link with no visual
 * distinction at all, and that this is the caller's call to make.
 */
export const textLabel = styleVariants({
  true: {
    textDecorationLine: "underline",
    textDecorationThickness: "1px",
    textUnderlineOffset: "2px",
  },
  false: { textDecorationLine: "none" },
});

/**
 * What a box-variant link needs on top of the Button recipe.
 *
 * One declaration: an anchor arrives underlined and a button does not, so the
 * recipe never had to say this. `underline` does not reach here — 0009 D5's
 * outcome scopes it to the text variant, on the grounds that an underline
 * inside a filled control is a second affordance on something that already
 * reads as pressable.
 */
export const boxLink = style({
  textDecoration: "none",
});

/**
 * The external marker.
 *
 * Sized at the label's own scale rather than at `buttonIconSize`'s 1.4em: this
 * glyph sits *inside* running text, where an icon half again the size of the
 * words around it reads as a mistake rather than as emphasis. On a box variant
 * the label already carries the button's font size, so tracking the label
 * keeps the two in step there too.
 */
export const externalMarker = style({
  width: "1em",
  height: "1em",
  flex: "none",
  // Nudged onto the text baseline. The box variants are inline-flex and align
  // it for free; in running text there is no flex container to do it.
  verticalAlign: "-0.1em",
});

/*
 * No margin on the marker: a real space is rendered before it instead, which
 * has to be a text node of its own so that the accessible name comes out as
 * "Base UI (opens in a new tab)" rather than "Base UI(opens in a new tab)" —
 * the name algorithm concatenates inline elements without a separator and
 * trims each one, so a leading space inside the hidden span is discarded.
 *
 * It costs nothing on the box variants: a whitespace-only text node in a flex
 * container is not rendered, so there the Button recipe's `gap` still owns the
 * spacing. In running text the space is the spacing.
 */

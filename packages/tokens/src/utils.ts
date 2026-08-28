const toColorTokens = (colors: Record<string, string>) =>
  Object.keys(colors).reduce((acc, key) => {
      return Object.assign({}, acc, {
          [key]: {
              $type: 'color',
              $value: colors[key]
          }
      });
  }, {});

export const buttonSet = (c: string, lightOrDark: string) => {
  const colors: Record<string, string> = (lightOrDark == 'light') ? {
    'base-bg': `{color.${c}.450}`,
    'hover-bg': `{color.${c}.500}`,
    'active-bg': `{color.${c}.550}`,
    'disabled-bg': `{color.warm.150}`,
    'disabled-text': `{color.warm.300}`,
    'text': `{color.${c}.50}`
  } : {
    'base-bg': `{color.${c}.500}`,
    'hover-bg': `{color.${c}.550}`,
    'active-bg': `{color.${c}.600}`,
    'disabled-bg': `{color.gray.600}`,
    'disabled-text': `{color.gray.700}`,
    'text': `{color.${c}.100}`
  };

  return toColorTokens(colors);
}

/**
 * The surface shared by every field-like control — input, select, combobox,
 * textarea. One set rather than one per component, so the fourth control to be
 * built cannot quietly pick a different shade of border.
 *
 * It carries colours a button never needed: a border, a placeholder, and an
 * invalid state. `active-border` is the focus treatment — a control that draws
 * its own border highlights that border rather than spreading `focusRing`, so
 * this tracks the primary button's fill in each theme and the two read as the
 * same blue. `invalid-border` tracks the danger button's fill the same way.
 *
 * Decided in apps/docs/decisions/0002-text-input.html (D4).
 */
export const controlSet = (lightOrDark: string) => {
  const colors: Record<string, string> = (lightOrDark == 'light') ? {
    'base-bg': `{color.white}`,
    'text': `{color.warm.600}`,
    'placeholder': `{color.gray.400}`,
    'border': `{color.warm.200}`,
    'hover-border': `{color.warm.300}`,
    'active-border': `{color.blue.450}`,
    'invalid-border': `{color.red.450}`,
    'disabled-bg': `{color.warm.150}`,
    'disabled-text': `{color.warm.300}`
  } : {
    'base-bg': `{color.gray.600}`,
    'text': `{color.gray.100}`,
    'placeholder': `{color.gray.300}`,
    'border': `{color.gray.500}`,
    'hover-border': `{color.gray.400}`,
    'active-border': `{color.blue.500}`,
    'invalid-border': `{color.red.500}`,
    'disabled-bg': `{color.gray.650}`,
    'disabled-text': `{color.gray.400}`
  };

  return toColorTokens(colors);
}

/**
 * The ghost button draws no fill of its own until it is interacted with, so it
 * carries no base or disabled background — those stay transparent, which is a
 * property of the recipe rather than a colour worth tokenising.
 */
export const ghostButtonSet = (lightOrDark: string) => {
  const colors: Record<string, string> = (lightOrDark == 'light') ? {
    'hover-bg': `{color.warm.100}`,
    'active-bg': `{color.warm.150}`,
    'disabled-text': `{color.warm.300}`,
    'text': `{color.warm.600}`
  } : {
    'hover-bg': `{color.gray.600}`,
    'active-bg': `{color.gray.550}`,
    'disabled-text': `{color.gray.500}`,
    'text': `{color.gray.100}`
  };

  return toColorTokens(colors);
}

/**
 * A neutral veil — the translucent fill the smoke button is built from.
 *
 * Literal rather than an alias, for the same reason `surfaces.scrim` is: an
 * alias cannot add an alpha channel and nothing in the palette is translucent.
 * Chroma is zero so the veil darkens or lightens what it covers instead of
 * tinting it a hue, which is what lets one set sit over any surface.
 */
const veil = (lightness: number, alpha: number) => ({
  $type: 'color' as const,
  $value: {
    colorSpace: 'oklch' as const,
    components: [lightness, 0, 0] as [number, number, number],
    alpha
  }
});

/**
 * Smoked glass: a translucent fill that the recipe blurs, so whatever the
 * button sits on shows through frosted rather than hidden.
 *
 * It carries a base and a disabled background where `ghostButtonSet` carries
 * neither — that is the difference between the two variants. Ghost is absent
 * until you touch it; smoke is always a pane, and reads as a control at rest
 * without committing to an opaque fill over the content behind it.
 *
 * Ink in light and light in dark. The alphas were set by eye against a
 * saturated backdrop: below about 0.08 the label loses its footing over
 * mid-tone content, and much above these the pane stops reading as glass and
 * starts reading as a solid grey button. Dark runs a touch heavier because a
 * white veil lifts a dark backdrop less than a black one darkens a light one.
 * They do not move when the ramps are retuned and have to be rechecked by eye.
 */
export const smokeButtonSet = (lightOrDark: string) => {
  const ink = lightOrDark == 'light' ? 0.12 : 1;
  const alphas: Record<string, number> = (lightOrDark == 'light') ? {
    'base-bg': 0.1,
    'hover-bg': 0.16,
    'active-bg': 0.22,
    'disabled-bg': 0.05
  } : {
    'base-bg': 0.14,
    'hover-bg': 0.2,
    'active-bg': 0.26,
    'disabled-bg': 0.07
  };

  const text: Record<string, string> = (lightOrDark == 'light') ? {
    'text': `{color.warm.600}`,
    'disabled-text': `{color.warm.300}`
  } : {
    'text': `{color.gray.100}`,
    'disabled-text': `{color.gray.500}`
  };

  return Object.assign(
    Object.fromEntries(Object.entries(alphas).map(([key, alpha]) => [key, veil(ink, alpha)])),
    toColorTokens(text)
  );
}

/**
 * The hues a Token can be coloured with, and the order they are generated in.
 *
 * A Token's colour carries meaning rather than emphasis — a red token is not a
 * more important token, it is a different kind of thing — so `color` names a
 * hue instead of reusing the button vocabulary. Decided in
 * apps/docs/decisions/0006-token.html (D2).
 */
export const TOKEN_HUES = [
  'warm', 'cool', 'blue', 'teal', 'green', 'lime',
  'yellow', 'orange', 'red', 'fuschia', 'purple', 'gray'
] as const;

/**
 * One Token's soft fill, for one hue in one theme.
 *
 * Three tokens rather than a button set's six: a Token is a rendered value, not
 * a control, so there is no active or disabled state to paint (0006 D3 shipped
 * a single visual weight). `hover-bg` is one step in on the ramp and belongs to
 * the interactive parts only — the whole-pill link takes it as a fill, and the
 * remove button takes it behind itself (0006 D4).
 */
export const tokenSet = (c: string, lightOrDark: string) => {
  const colors: Record<string, string> = (lightOrDark == 'light') ? {
    'base-bg': `{color.${c}.100}`,
    'hover-bg': `{color.${c}.150}`,
    'text': `{color.${c}.550}`
  } : {
    'base-bg': `{color.${c}.650}`,
    'hover-bg': `{color.${c}.600}`,
    'text': `{color.${c}.200}`
  };

  return toColorTokens(colors);
}

/** Every hue's set, keyed by hue name. */
export const tokenSets = (lightOrDark: string) =>
  Object.fromEntries(TOKEN_HUES.map((hue) => [hue, tokenSet(hue, lightOrDark)]));

/**
 * The drawn scrollbar.
 *
 * Two tokens, not three. A `track` was proposed alongside these and dropped:
 * 0007 D1 chose to leave the reserved gutter empty at rest, so no rail is ever
 * painted and nothing would have read it. Add one if a surface later needs a
 * visible channel, rather than shipping a token with no consumer.
 *
 * A thumb is an object you drag, so it sits a step stronger than
 * `color.control.border` — which is drawn to recede around an input, and was
 * the alternative 0007 D3 weighed this against.
 */
export const scrollbarSet = (lightOrDark: string) => {
  const colors: Record<string, string> = (lightOrDark == 'light') ? {
    'thumb': `{color.warm.300}`,
    'thumb-hover': `{color.warm.400}`
  } : {
    'thumb': `{color.gray.450}`,
    'thumb-hover': `{color.gray.400}`
  };

  return toColorTokens(colors);
}

/**
 * The slider's marks.
 *
 * `indicator` is the filled portion of the track and the thumb, which are one
 * visual idea — the value, drawn. It reads as the page's ink rather than as an
 * accent: dark on light, light on dark.
 *
 * Named rather than borrowed. The value matches `surfaces.inverse` and
 * `text.primary` today, but a slider mark is neither a surface nor text — and
 * `surfaces.inverse` is already spoken for in the same stylesheet, where the
 * value bubble uses it correctly as inverted chrome. One token serving both
 * meant that retuning tooltips would have moved the slider.
 */
export const sliderSet = (lightOrDark: string) => {
  const colors: Record<string, string> = (lightOrDark == 'light') ? {
    'indicator': `{color.warm.600}`,
    'disabled-track': `{color.warm.150}`,
    'disabled-thumb': `{color.warm.300}`
  } : {
    'indicator': `{color.gray.100}`,
    'disabled-track': `{color.gray.650}`,
    'disabled-thumb': `{color.gray.400}`
  };

  return toColorTokens(colors);
}

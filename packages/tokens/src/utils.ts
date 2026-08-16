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

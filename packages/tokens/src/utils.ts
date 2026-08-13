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
    'text': `{color.${c}.100}`
  } : {
    'base-bg': `{color.${c}.450}`,
    'hover-bg': `{color.${c}.500}`,
    'active-bg': `{color.${c}.550}`,
    'disabled-bg': `{color.gray.600}`,
    'disabled-text': `{color.gray.700}`,
    'text': `{color.${c}.100}`
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

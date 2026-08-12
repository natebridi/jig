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

  return Object.keys(colors).reduce((acc, key) => {
      return Object.assign({}, acc, {
          [key]: {
              $type: 'color',
              $value: colors[key]
          }
      });
  }, {});
}

export const buttonSet = (c: string) => {
    const colors: Record<string, string> = {
        'base-bg': `{color.${c}.500}`,
        'hover-bg': `{color.${c}.600}`,
        'active-bg': `{color.${c}.700}`,
        'disabled-bg': `{color.${c}.500}`,
        'text': `{color.gray.900}`
    }
    return Object.keys(colors).reduce((acc, key) => {
        return Object.assign({}, acc, {
            [key]: {
                $type: 'color',
                $value: colors[key]
            }
        });
    }, {});
}
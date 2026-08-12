type ColorComponents = [
    number,
    number,
    number
];

export type ColorTokenValue = {
    colorSpace: 'oklch' | 'oklab';
    components: ColorComponents;
    alpha?: number;
}

export type DimensionTokenValue = {
    value: number;
    unit: 'px' | 'rem';
}

export type Token = {
    '$type': 'color' | 'dimension' | 'fontWeight' | 'fontFamily' | 'number';
    '$value': ColorTokenValue | DimensionTokenValue | string | string[] | number;
}

export type TokenSet = {
    [key: string]: Token | TokenSet | ThemeTokenSet;
}

export interface ThemeTokenSet {
    color: {
        focus: Token;
        surfaces: {
            body: Token;
            card: Token;
            popover: Token;
        }
        text: {
            primary: Token;
            secondary: Token;
        },
        button: {
            primary: TokenSet;
            secondary: TokenSet;
            danger: TokenSet;
        }
    }
}

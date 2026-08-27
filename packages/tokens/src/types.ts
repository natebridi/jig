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

/**
 * One shadow layer. A `shadow` token's `$value` is either one of these or an
 * array of them, innermost first — layering is what makes an elevation read as
 * light falling on a surface rather than as a grey halo.
 */
export type ShadowTokenValue = {
    color: ColorTokenValue | string;
    offsetX: DimensionTokenValue;
    offsetY: DimensionTokenValue;
    blur: DimensionTokenValue;
    spread: DimensionTokenValue;
    inset?: boolean;
}

export type Token = {
    '$type': 'color' | 'dimension' | 'fontWeight' | 'fontFamily' | 'number' | 'shadow';
    '$value': ColorTokenValue | DimensionTokenValue | ShadowTokenValue | ShadowTokenValue[] | string | string[] | number;
}

export type TokenSet = {
    [key: string]: Token | TokenSet | ThemeTokenSet;
}

/** A flat set of tokens keyed by role — `surfaces`, `text`, and the like. */
export type TokenGroup = {
    [role: string]: Token;
}

/**
 * A theme's colour semantics.
 *
 * `focus`, `surfaces` and `text` are the document-level roles every theme owes
 * the system, so they are named here. Everything else is a per-component set —
 * `button` today, and whatever the next component needs — which is why this
 * stays open rather than enumerating them.
 *
 * The previous version listed Button's four variants inline. At forty
 * components that becomes a hand-synchronised monolith that has to be edited
 * in lockstep with every new component, and which still cannot check that
 * light and dark agree. The *names* are enforced instead by
 * `REQUIRED_SEMANTICS` and the parity check in `validate.ts`, which run over
 * the generated documents and can see things the type never could.
 */
export type ThemeColors = {
    focus: Token;
    surfaces: TokenGroup;
    text: TokenGroup;
} & {
    [component: string]: Token | TokenGroup | TokenSet;
}

export interface ThemeTokenSet {
    color: ThemeColors;
}

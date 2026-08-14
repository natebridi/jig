# Changesets

Run `pnpm changeset` alongside any change to `@jig-ui/react`'s public surface,
and describe the change the way a consumer would experience it.

`@jig-ui/tokens` and `@jig-ui/styles` are `private`, so they are never
published — but a change to either one reaches consumers through the token
custom properties and the stylesheet that `@jig-ui/react` bundles. Those need a
changeset against `@jig-ui/react`.

## What counts as public

The package is `0.x`, so the API is explicitly still moving. Even so, these are
the things a consumer can depend on, and a change to any of them needs a
changeset:

| Surface | Public? |
| --- | --- |
| Component names, props and prop value sets | Yes |
| The `Responsive`, `SpacingProps` and `BoxSizeProps` types | Yes |
| Export map subpaths (`.`, `./tokens`, `./icons`, `./styles.css`, `./reset.css`) | Yes |
| Token custom property **names** (`--color-text-primary`) | Yes |
| The `@layer jig.tokens, jig.base, jig.components` order | Yes |
| `data-theme="light" \| "dark"` | Yes |
| Default variants (`Button` is `primary`, `Stack` spacing is `300`) | Yes |
| Token **values** — a colour ramp being retuned | Patch; it is a redesign, not an API break |
| Removing an icon from the curated set | Minor while `0.x`, major after `1.0` |
| Generated class names (`._1911sz73`) | **No.** Never target these. |
| Anything in `dist` not named by the export map | **No.** |

## Versioning

While at `0.x`, minor bumps carry breaking changes and patches carry everything
else — which is what `0.x` means under semver, and is honest about an API that
is still settling. Do not go to `1.0.0` until the surface above is one you are
willing to keep.

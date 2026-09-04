import { globalStyle, style } from "@vanilla-extract/css";
import { color, spacing } from "@jig-ui/styles/tokens";
import { viewport as scrollViewport } from "../scrollarea/scrollarea.css";

/**
 * The nav.
 *
 * A flex column with three bands: a pinned header, a scrolling middle, and a
 * pinned footer — the arrangement Dialog already uses (0008 D3) and which the
 * playground demonstrates. `min-height: 0` is what lets the middle actually
 * shrink; without it a flex child refuses to go below its content height and
 * the scroll never engages.
 *
 * No width of its own: a sidebar's width belongs to the layout around it, and
 * box dimensions go through `style` rather than props.
 */
export const nav = style({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  height: "stretch",
  color: color.text.primary,
});

export const header = style({
  flex: "none",
  padding: spacing[400],
});

/**
 * The scrolling middle. `flex: 1` with `min-height: 0` so it takes the
 * leftover height and is allowed to be shorter than its content.
 */
export const body = style({
  flex: 1,
  minHeight: 0,
  paddingInline: spacing[100],
});

/** The gap between sections, owned by the nav rather than by each section. */
export const sections = style({
  display: "flex",
  flexDirection: "column",
  gap: spacing[400],
  paddingBlock: spacing[300],
});

export const footer = style({
  flex: "none",
  padding: spacing[400],
});

/**
 * Lets the rows be narrower than their longest label.
 *
 * Base UI's ScrollArea puts a `min-width: fit-content` wrapper inside the
 * viewport, which is what makes horizontal scrolling work when content really
 * is wider. A nav row does not want that: its label is `white-space: nowrap`
 * so that it can ellipsise, and against a fit-content ancestor that nowrap
 * wins — the list grows to the longest label, the row's trailing slot is
 * pushed out of sight, and nothing ever truncates.
 *
 * Scoped to SideNav rather than changed in ScrollArea, because wanting the
 * horizontal scroll is the common case and this is the exception. Whether
 * ScrollArea should offer a one-axis mode is left as a question in 0014's
 * As built.
 */
globalStyle(`.${body} .${scrollViewport} > div[role="presentation"]`, {
  // `!important` because Base UI sets `min-width: fit-content` as an *inline*
  // style on this wrapper, which no class selector can outrank. Confirmed by
  // reading the rendered attribute rather than inferred — see 0014's As built.
  minWidth: "0 !important",
});

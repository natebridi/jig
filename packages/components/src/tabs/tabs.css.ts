import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { color, radius, spacing, type } from "@jig-ui/styles/tokens";
import { focusRing } from "../focus-ring";
import { icon } from "../icon/icon.css";

/**
 * The root carries nothing.
 *
 * Decided in apps/docs/decisions/0019-tabs.html (D1): `Tabs` is a behavioural
 * wrapper, so it contributes no layout, spacing, border or background. That is
 * what lets a caller put something that is neither a tab nor a panel inside it
 * — a menu beside the strip, a banner above the panels — and have it land
 * where they wrote it. There is deliberately no `root` style to import.
 */

/**
 * The strip.
 *
 * Scrolls rather than wraps (0019 D4). `flex: none` on each tab is the half of
 * that which is easy to miss: without it the tabs shrink to fit and nothing
 * ever overflows, so the scroller would never scroll.
 *
 * The rule sits on the strip rather than under each tab, so it reads as one
 * edge the tabs sit on — which is also what gives the indicator something to
 * sit against.
 */
const listBase = style({
  position: "relative",
  display: "flex",
  // Nothing at rest, and no gap: the tabs' own padding is the spacing, so the
  // hit areas meet and the rule below them is unbroken.
  gap: 0,
  // 0019 D4. Only the axis that can overflow scrolls; the cross axis stays
  // visible so the indicator is not clipped by its own scroller.
  overscrollBehaviorInline: "contain",
  // A thin native bar rather than ScrollArea's reveal-on-hover one. See the
  // note in tabs.tsx: ScrollArea's mask and reserved gutter are vertical-only
  // by 0007 §04, so wrapping in it would buy neither.
  scrollbarWidth: "thin",
  scrollbarColor: `${color.scrollbar.thumb} transparent`,
});

export const list = styleVariants({
  horizontal: [
    listBase,
    {
      flexDirection: "row",
      overflowX: "auto",
      overflowY: "visible",
      borderBottom: `1px solid ${color.line}`,
    },
  ],
  vertical: [
    listBase,
    {
      flexDirection: "column",
      overflowY: "auto",
      overflowX: "visible",
      borderInlineEnd: `1px solid ${color.line}`,
    },
  ],
});

/**
 * The sliding indicator (0019 D2).
 *
 * Every number here is Base UI's: it publishes the active tab's measured
 * offset and size on this element as `--active-tab-*`, and the transition on
 * `translate` and the size is the whole of what Jig adds. Because the
 * indicator is a child of the scroller and the offsets are measured against
 * it, the bar scrolls with the tabs for free — the open question 0019 D4
 * recorded turns out to need no code.
 *
 * Each reference carries a `0px` fallback, for the reason `combobox.css.ts`
 * records: those four properties do not exist until Base UI has measured, and
 * an unset variable invalidates the whole declaration rather than just that
 * value. `width` would fall back to `auto` and `translate` to `none` — the bar
 * happens to be invisible either way, but by accident. `0px` says so, and the
 * packed-consumer test enforces that every runtime-set variable is spelled out
 * this way.
 */
const indicatorBase = style({
  position: "absolute",
  background: color.text.primary,
  // Nothing here is interactive; the tab underneath it is.
  pointerEvents: "none",
  transitionProperty: "translate, width, height",
  transitionDuration: "180ms",
  transitionTimingFunction: "ease",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transitionDuration: "0ms",
    },
  },
});

export const indicator = styleVariants({
  horizontal: [
    indicatorBase,
    {
      insetBlockEnd: 0,
      insetInlineStart: 0,
      height: "2px",
      width: "var(--active-tab-width, 0px)",
      translate: "var(--active-tab-left, 0px) 0",
    },
  ],
  vertical: [
    indicatorBase,
    {
      insetInlineEnd: 0,
      insetBlockStart: 0,
      width: "2px",
      height: "var(--active-tab-height, 0px)",
      translate: "0 var(--active-tab-top, 0px)",
    },
  ],
});

/**
 * A tab.
 *
 * Draws no border of its own, so focus is the shared ring rather than a border
 * highlight — the checklist's rule, decided in 0002 D4. The radius rounds the
 * ring and the hover fill at the top corners only; the bottom two sit on the
 * strip's rule.
 */
export const tab = style({
  // Load-bearing for 0019 D4: see `listBase`.
  flex: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: spacing[300],
  padding: `${spacing[400]} ${spacing[500]}`,
  margin: 0,
  appearance: "none",
  background: "transparent",
  border: "none",
  borderRadius: `${radius[400]} ${radius[400]} 0 0`,
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[300]}`,
  fontWeight: `${type.weight[500]}`,
  lineHeight: 1.4,
  // The label never wraps: a tab that grows to two lines breaks the strip's
  // single row, which is the shape 0019 D4 chose to scroll rather than wrap.
  whiteSpace: "nowrap",
  color: color.text.secondary,
  cursor: "pointer",
  transition: "color 120ms ease, background 120ms ease",
  ...focusRing,
  ":hover": {
    background: color.button.ghost.hoverBg,
    color: color.text.primary,
  },
  ":active": {
    background: color.button.ghost.activeBg,
  },
  selectors: {
    // Base UI's own attribute, so the selected state is read from the DOM it
    // manages rather than mirrored into a prop.
    "&[data-active]": {
      color: color.text.primary,
    },
    "&[data-disabled]": {
      color: color.button.ghost.disabledText,
      background: "transparent",
      cursor: "default",
      pointerEvents: "none",
    },
  },
});

/**
 * The slots either side of the label (0019 D3).
 *
 * Both are inside the button, so neither may hold anything interactive — the
 * one rule that does *not* carry over from ListItem, where `end` sits outside
 * the row's control and may. `flex: none` keeps an icon or a token at its own
 * size while the label takes the room.
 */
export const slot = style({
  flex: "none",
  display: "inline-flex",
  alignItems: "center",
});

/**
 * Icons in a tab are set slightly larger than the label, for the reason
 * Button's are: Phosphor's artwork fills its viewBox where text leaves room
 * for ascenders. In `em`, so it tracks the label rather than a fixed size.
 *
 * A globalStyle rather than a prop, because the caller composes the icon
 * themselves — `start={<Icon icon="bell" />}` — and the size is the parent's
 * to own. `:where` keeps it at zero specificity so a caller who passes an
 * explicit `size` still wins.
 */
globalStyle(`:where(.${slot}) .${icon}`, {
  width: "1.4em",
  height: "1.4em",
});

/**
 * A panel.
 *
 * Air above it so it reads as belonging to the strip rather than colliding
 * with the rule. Base UI gives a panel with no focusable content its own tab
 * stop, so it takes the ring too.
 */
export const panel = style({
  paddingBlockStart: spacing[500],
  ...focusRing,
});

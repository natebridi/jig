import { globalStyle, style } from "@vanilla-extract/css";
import { color, spacing, type } from "@jig-ui/styles/tokens";
import { trigger as collapsibleTrigger } from "../collapsible/collapsible.css";

/** The section wrapper. Sections stack; the nav owns the space between them. */
export const section = style({
  display: "block",
});

/**
 * The list.
 *
 * `role="list"` is set in the markup as well as the element being a `ul`, and
 * that redundancy is deliberate: WebKit drops list semantics from a `ul` whose
 * `list-style` is `none`, which is every sidebar ever built. Decided in
 * 0014 D2, and the reason `list-style: none` is written here rather than
 * assumed.
 */
export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-100)"
});

/**
 * A static section label, for a section that does not collapse.
 *
 * `caption01` and muted — a section heading in a sidebar is a signpost, not a
 * heading in the document-outline sense. Indented to the row's own inline
 * padding so it sits in the same column as the labels below it.
 */
export const heading = style({
  display: "block",
  fontFamily: type.family.sans,
  fontSize: type.caption01.size,
  fontWeight: type.caption01.weight,
  lineHeight: type.caption01.lineHeight,
  color: color.text.muted,
  padding: `${spacing[300]} ${spacing[500]}`,
});

/**
 * What the collapsing variant adds to Collapsible's trigger.
 *
 * 0014 D4 reused Collapsible rather than building a second disclosure, and its
 * outcome recorded the cost this rule pays: Collapsible's trigger has no
 * horizontal padding by design (0013 D1), which is right for prose and leaves
 * a section header hanging outside the column its rows sit in. The section
 * supplies that padding rather than Collapsible changing for one consumer.
 *
 * A descendant rule because Collapsible's `className` lands on its root and it
 * exposes no hook for the trigger — the same route button.css.ts takes to
 * position the Icon inside a Button. Two classes, so it beats the recipe's own
 * base without `!important`.
 */
globalStyle(`.${section} .${collapsibleTrigger.classNames.base}`, {
  paddingInline: spacing[500],
  color: color.text.muted,
});

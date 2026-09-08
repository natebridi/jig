import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { color, spacing, type } from "@jig-ui/styles/tokens";
import { mediaQueries, type Breakpoint } from "../breakpoints";
import { typeStyles } from "../typography/typography.css";

/**
 * The root, carrying `role="table"`.
 *
 * The type set by `with` is inherited by every row and cell; a cell that names
 * its own preset overrides it (0018 D1). That inheritance is why three separate
 * components share one type setting with no prop threading — the context added
 * in 0018 D3 carries structure, not styling.
 */
export const list = recipe({
  base: {
    display: "block",
    width: "stretch",
    minWidth: 0,
    color: color.text.primary,
  },
  variants: {
    with: typeStyles,
  },
  defaultVariants: {
    with: "body01",
  },
});

/** Both rowgroups are layout-transparent; the rows do the work. */
export const rowgroup = style({ display: "block" });

/**
 * A row.
 *
 * Flex in the column layout, block in the stacked one — which applies is
 * carried by the markers below, because the choice is responsive.
 *
 * 0018 D2 replaced the shared grid template with flex so that columns can be
 * given widths. The consequence, recorded there: alignment is no longer
 * structural. Rows lay out independently and line up only because every row's
 * nth cell resolves to the same width, which `columnWidths` is what guarantees.
 */
export const row = style({
  columnGap: spacing[500],
});

/** The header row, which the stacked layout moves off-screen. */
export const headerRow = style({});

/**
 * A cell.
 *
 * `flex: 1 1 0` is the default share; `columnWidths` overrides it per column,
 * applied inline by the cell itself from its own index (0018 D2's outcome —
 * the context makes generated `nth-child` rules unnecessary).
 *
 * `min-width: 0` is load-bearing: a flex item's automatic minimum size is its
 * content, so a cell holding a long unbroken string would refuse to shrink and
 * push the row wide.
 */
export const cell = recipe({
  base: {
    flex: "1 1 0",
    minWidth: 0,
  },
  variants: {
    /**
     * The same `typeStyles` map the list's `with` uses, emitted after it in the
     * stylesheet so a cell's own preset wins over the one it inherited — 0009
     * D3's rule that an explicit prop at the call site outranks an ambient
     * value, applied one level down (0018 D1).
     */
    with: typeStyles,
  },
});

/**
 * The column heading. 0017 D4: the list's preset at weight 600, not a quieter
 * preset. Deliberately not the *cell's* preset — 0018 D1's outcome records that
 * a column whose cells override `with` will have a heading that does not match
 * them, and that this is accepted rather than overlooked.
 */
export const columnHeader = style({
  flex: "1 1 0",
  minWidth: 0,
  fontWeight: type.weight[600],
});

/** The label a cell shows beside its value when stacked. */
export const cellLabel = style({
  fontWeight: type.weight[600],
});

const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * The two layouts, as marker classes per breakpoint — `Grid`'s `distribute`
 * pattern. Declared in breakpoint order so a larger breakpoint's rule follows a
 * smaller one; media queries add no specificity, so source order resolves
 * `layout={{ xs: 'stacked', md: 'columns' }}`.
 */
export const layouts = {} as Record<Breakpoint, Record<"columns" | "stacked", string>>;

for (const breakpoint of BREAKPOINTS) {
  layouts[breakpoint] = {} as Record<"columns" | "stacked", string>;

  for (const mode of ["columns", "stacked"] as const) {
    const marker = style({});
    layouts[breakpoint][mode] = marker;

    const at = (rules: Record<string, unknown>) =>
      breakpoint === "xs" ? rules : { "@media": { [mediaQueries[breakpoint]]: rules } };

    /*
     * Both branches declare the *same* set of properties.
     *
     * They have to: `layout={{ xs: 'stacked', md: 'columns' }}` applies both
     * markers to the same element, and the wider one only wins on properties it
     * actually sets. An earlier version set `display` alone in the columns
     * branch, so the stacked branch's off-screen clip survived into the wide
     * layout and the header row vanished at every width. Keep these in step.
     */
    if (mode === "columns") {
      globalStyle(`:where(.${marker}) .${headerRow}`, at({
        display: "flex",
        position: "static",
        width: "auto",
        height: "auto",
        margin: 0,
        overflow: "visible",
        clipPath: "none",
        whiteSpace: "normal",
      }));
      /*
       * The rule belongs to the row, not to its cells: a border on each cell is
       * cut into one segment per column by the `column-gap` between them.
       */
      globalStyle(`:where(.${marker}) .${row}`, at({
        display: "flex",
        padding: 0,
        borderBottom: `1px solid ${color.line}`,
      }));
      globalStyle(
        `:where(.${marker}) .${cell.classNames.base}, :where(.${marker}) .${columnHeader}`,
        at({
          display: "block",
          gridTemplateColumns: "none",
          columnGap: 0,
          padding: `${spacing[400]} 0`,
          borderBottom: "none",
        })
      );
      globalStyle(`:where(.${marker}) .${cellLabel}`, at({ display: "none" }));
    } else {
      /*
       * The header row goes off-screen rather than to `display: none`, which
       * would take the `columnheader` elements out of the accessibility tree
       * and leave an ARIA table whose cells have no headers to associate with.
       */
      globalStyle(`:where(.${marker}) .${headerRow}`, at({
        display: "block",
        position: "absolute",
        width: "1px",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
      }));
      globalStyle(`:where(.${marker}) .${row}`, at({
        display: "block",
        padding: `${spacing[400]} 0`,
        borderBottom: `1px solid ${color.line}`,
      }));
      globalStyle(`:where(.${marker}) .${cell.classNames.base}`, at({
        display: "grid",
        gridTemplateColumns: "minmax(0, 10rem) minmax(0, 1fr)",
        columnGap: spacing[500],
        padding: `${spacing[200]} 0`,
        borderBottom: "none",
      }));
      globalStyle(`:where(.${marker}) .${cellLabel}`, at({ display: "block" }));
    }
  }
}

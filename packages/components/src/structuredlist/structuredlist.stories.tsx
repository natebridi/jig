import type { Meta, StoryObj } from '@storybook/react-vite';
import { StructuredList, StructuredListCell, StructuredListRow } from './structuredlist';
import { Token } from '../token';
import { Link } from '../link';
import { Icon } from '../icon';
import { Typography } from '../typography';
import { Stack } from '../stack';

const meta = {
  title: 'Components/StructuredList',
  component: StructuredList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Columns of content, laid out as a table on a wide screen and stacked with their labels on a narrow one. Layout only — nothing here is focusable or selectable. Carries ARIA table roles rather than table elements, so the structure a screen reader hears is identical in both layouts. Decided in `apps/docs/decisions/0017-structured-list.html`.',
      },
    },
  },
} satisfies Meta<typeof StructuredList>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = (
  <>
    <StructuredListRow>
      <StructuredListCell>Starter</StructuredListCell>
      <StructuredListCell>10,000</StructuredListCell>
      <StructuredListCell>Free</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Team</StructuredListCell>
      <StructuredListCell>1,000,000</StructuredListCell>
      <StructuredListCell>$29 / month</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Enterprise</StructuredListCell>
      <StructuredListCell>Unmetered</StructuredListCell>
      <StructuredListCell>Talk to us</StructuredListCell>
    </StructuredListRow>
  </>
);

export const Default: Story = {
  args: { headers: ['Plan', 'Requests', 'Price'], children: plans },
};

/**
 * `columnWidths` gives the columns widths, declared once on the list. `'auto'`
 * fills the space left over, a bare length is fixed, and anything with a space
 * in it is used as a flex shorthand. Rows are flex, so this is what keeps the
 * columns aligned (0018 D2).
 */
export const ColumnWidths: Story = {
  args: {
    headers: ['Plan', 'Requests', 'Price'],
    children: plans,
    columnWidths: ['9rem', 'auto', '8rem'],
    layout: 'columns',
  },
};

/**
 * `with` on a cell overrides the list's preset — the type a column wants is
 * usually a property of the column rather than the whole list (0018 D1).
 */
export const PerCellType: Story = {
  args: {
    headers: ['Key', 'Value', 'Type'],
    columnWidths: ['12rem', 'auto', '6rem'],
    layout: 'columns',
    children: (
      <>
        <StructuredListRow>
          <StructuredListCell with="caption02">build.target</StructuredListCell>
          <StructuredListCell>es2022</StructuredListCell>
          <StructuredListCell with="caption01">string</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow>
          <StructuredListCell with="caption02">build.sourcemap</StructuredListCell>
          <StructuredListCell>true</StructuredListCell>
          <StructuredListCell with="caption01">boolean</StructuredListCell>
        </StructuredListRow>
      </>
    ),
  },
};

/**
 * A cell takes its stacked label from the column heading, so `label` is only
 * needed to override it — here the first column reads "Tier" when stacked while
 * its heading says "Plan".
 */
export const LabelOverride: Story = {
  args: {
    headers: ['Plan', 'Requests', 'Price'],
    layout: 'stacked',
    children: (
      <StructuredListRow>
        <StructuredListCell label="Tier">Starter</StructuredListCell>
        <StructuredListCell>10,000</StructuredListCell>
        <StructuredListCell>Free</StructuredListCell>
      </StructuredListRow>
    ),
  },
};

/**
 * The default is `{ xs: 'stacked', md: 'columns' }` — resize the preview to
 * cross the `md` breakpoint at 768px and watch it reflow.
 */
export const Responsive: Story = {
  args: { headers: ['Plan', 'Requests', 'Price'], children: plans },
};

export const AlwaysStacked: Story = {
  args: { headers: ['Plan', 'Requests', 'Price'], children: plans, layout: 'stacked' },
};

export const AlwaysColumns: Story = {
  args: { headers: ['Plan', 'Requests', 'Price'], children: plans, layout: 'columns' },
};

/**
 * A cell holds anything, which is the reason 0017 D2 chose composed children
 * over data — a Token, a Link and an Icon go in without being described first.
 */
export const RichCells: Story = {
  args: {
    headers: ['Service', 'Status', 'Docs'],
    children: (
      <>
        <StructuredListRow>
          <StructuredListCell>API</StructuredListCell>
          <StructuredListCell><Token color="green">Operational</Token></StructuredListCell>
          <StructuredListCell><Link href="#api">Reference</Link></StructuredListCell>
        </StructuredListRow>
        <StructuredListRow>
          <StructuredListCell>Webhooks</StructuredListCell>
          <StructuredListCell><Token color="orange">Degraded</Token></StructuredListCell>
          <StructuredListCell><Link href="#hooks">Reference</Link></StructuredListCell>
        </StructuredListRow>
        <StructuredListRow>
          <StructuredListCell><Icon icon="gear" /> Batch</StructuredListCell>
          <StructuredListCell><Token color="gray">Paused</Token></StructuredListCell>
          <StructuredListCell><Link href="#batch" external>Reference</Link></StructuredListCell>
        </StructuredListRow>
      </>
    ),
  },
};

/**
 * The header row is optional. Without it the list is columns of values with
 * nothing naming them, which suits a two-column spec panel — and the stacked
 * layout still shows each cell's own `label`.
 */
export const NoHeaders: Story = {
  args: {
    children: (
      <>
        <StructuredListRow>
          <StructuredListCell label="Material">Anodised aluminium</StructuredListCell>
          <StructuredListCell label="Finish">Matte</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow>
          <StructuredListCell label="Weight">1.2 kg</StructuredListCell>
          <StructuredListCell label="Depth">18 mm</StructuredListCell>
        </StructuredListRow>
      </>
    ),
  },
};

/**
 * `with` sets the type for the whole list and the headings take it at weight
 * 600 — so a quieter list stays internally consistent rather than needing a
 * second prop.
 */
export const TypeStyles: Story = {
  args: { headers: ['Plan', 'Requests', 'Price'], children: plans },
  render: (args) => (
    <Stack spacing="700">
      <Stack spacing="300">
        <Typography with="caption01" tone="muted">with=&quot;caption01&quot;</Typography>
        <StructuredList {...args} with="caption01" />
      </Stack>
      <Stack spacing="300">
        <Typography with="caption01" tone="muted">with=&quot;body01&quot; (default)</Typography>
        <StructuredList {...args} />
      </Stack>
      <Stack spacing="300">
        <Typography with="caption01" tone="muted">with=&quot;body02&quot;</Typography>
        <StructuredList {...args} with="body02" />
      </Stack>
    </Stack>
  ),
};

/**
 * The cost 0017 D3 accepted: `layout` is keyed to the viewport, not to the
 * list's own width. In a narrow container the default still says `columns`,
 * and the caller has to say otherwise.
 */
export const InANarrowContainer: Story = {
  args: { headers: ['Plan', 'Requests', 'Price'], children: plans },
  render: (args) => (
    <Stack direction="row" spacing="600" align="start">
      <div style={{ width: '17rem' }}>
        <Typography with="caption01" tone="muted" mb="300">default — stays in columns</Typography>
        <StructuredList {...args} />
      </div>
      <div style={{ width: '17rem' }}>
        <Typography with="caption01" tone="muted" mb="300">layout=&quot;stacked&quot;</Typography>
        <StructuredList {...args} layout="stacked" />
      </div>
    </Stack>
  ),
};

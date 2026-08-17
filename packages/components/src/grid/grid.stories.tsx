import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './grid';
import { Box } from '../box';
import { Typography } from '../typography';
import { color, spacing } from '../tokens';

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: color.surfaces.card, padding: spacing[400], textAlign: 'center' }}>
    <Typography with="body01">{children}</Typography>
  </div>
);

const cells = (count: number) =>
  Array.from({ length: count }, (_, i) => <Cell key={i}>{i + 1}</Cell>);

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: { children: cells(6), spacing: '400' },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = { args: { columns: 3 } };
export const FourColumns: Story = { args: { columns: 4 } };

export const Responsive: Story = {
  args: { columns: { xs: 2, md: 4 } },
  parameters: {
    docs: { description: { story: 'Two columns below md, four from md up. Resize the canvas to see it.' } },
  },
};

export const ExplicitSpans: Story = {
  args: {
    children: (
      <>
        <Box span={3}><Cell>3</Cell></Box>
        <Box span={3}><Cell>3</Cell></Box>
        <Box span={9}><Cell>9</Cell></Box>
        <Box span={9}><Cell>9</Cell></Box>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The grid is always 24 columns. A Box says how many of them a child takes, so unequal rows need no template — 3 + 3 + 9 + 9 = 24.',
      },
    },
  },
};

export const SpanOverridesDistribution: Story = {
  args: {
    columns: 3,
    children: (
      <>
        <Cell>8, distributed</Cell>
        <Box span={16}><Cell>16, explicit</Cell></Box>
        <Cell>8, distributed</Cell>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A Box with its own span always beats the distribution `columns` set, so the two can be mixed in one Grid.',
      },
    },
  },
};

export const CollapsingRow: Story = {
  args: {
    children: (
      <>
        <Box span={{ xs: 24, md: 3 }}><Cell>Measure</Cell></Box>
        <Box span={{ xs: 24, md: 3 }}><Cell>Quantity</Cell></Box>
        <Box span={{ xs: 24, md: 9 }}><Cell>Ingredient</Cell></Box>
        <Box span={{ xs: 24, md: 9 }}><Cell>Preparation</Cell></Box>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'An uneven row collapses by giving each child a responsive span. Rows with *equal* children collapse more cheaply through `columns={{ xs: 1, md: 3 }}` instead.',
      },
    },
  },
};

export const PaddedAndSized: Story = {
  args: { columns: 3, p: '500', style: { maxWidth: '480px' } },
  parameters: {
    docs: {
      description: {
        story:
          'p/px/py/pt/pr/pb/pl take the same scale and responsive object shape as the margin props. Box dimensions rarely fall on a token scale, so they are not props — pass them through `style`, which Grid merges onto the rendered element.',
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './grid';
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

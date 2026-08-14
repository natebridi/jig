import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './stack';
import { Button } from '../button';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Button variant="secondary">One</Button>
        <Button variant="secondary">Two</Button>
        <Button variant="secondary">Three</Button>
      </>
    ),
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = { args: { direction: 'column', spacing: '300' } };
export const Row: Story = { args: { direction: 'row', spacing: '300' } };

export const Responsive: Story = {
  args: { direction: { xs: 'column', md: 'row' }, spacing: '400' },
  parameters: {
    docs: { description: { story: 'Every Stack prop takes either a bare value or an object keyed by breakpoint, applied mobile-first.' } },
  },
};

export const Alignment: Story = {
  args: { direction: 'column', spacing: '300', align: 'center' },
  parameters: {
    docs: { description: { story: 'align defaults to "start", which makes children shrink to their content. Use "stretch" for children that should fill the width.' } },
  },
};

export const PaddedAndSized: Story = {
  args: { direction: 'row', spacing: '300', p: '500', maxWidth: '360px', style: { background: 'rgba(127, 127, 127, 0.15)' } },
  parameters: {
    docs: {
      description: {
        story:
          'p/px/py/pt/pr/pb/pl take the same scale and responsive object shape as the margin props. width, height, minHeight and maxWidth take any CSS length directly (\'360px\', \'50%\', \'100vh\') rather than a token scale, since box dimensions rarely fall on one.',
      },
    },
  },
};

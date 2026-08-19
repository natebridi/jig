import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './stack';
import { Button } from '../button';
import { Grid } from '../grid';
import { Typography } from '../typography';
import { color, spacing } from '@jig-ui/styles/tokens';

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
  args: {
    direction: 'row',
    spacing: '300',
    p: '500',
    style: { maxWidth: '360px', background: 'rgba(127, 127, 127, 0.15)' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'p/px/py/pt/pr/pb/pl take the same scale and responsive object shape as the margin props. Box dimensions rarely fall on a token scale, so they are not props — pass them through `style`, which Stack merges onto the rendered element.',
      },
    },
  },
};

export const InAGrid: Story = {
  render: () => (
    <Grid columns={2} spacing="400">
      <Stack span={16} spacing="200" align="stretch" style={{ background: color.surfaces.card, padding: spacing[400] }}>
        <Typography with="heading05">span 16</Typography>
        <Typography with="body01">A Stack is a container and a grid child at once — no wrapping Box.</Typography>
      </Stack>
      <Stack span={8} spacing="200" align="stretch" style={{ background: color.surfaces.card, padding: spacing[400] }}>
        <Typography with="heading05">span 8</Typography>
        <Typography with="body01">Its own span wins over the Grid’s distribution.</Typography>
      </Stack>
    </Grid>
  ),
  parameters: {
    docs: { description: { story: '`span` says how many of the parent Grid’s 24 columns the Stack occupies, overriding the distribution `columns` set — the same rule `Box`’s `span` follows. It is inert outside a Grid.' } },
  },
};

export const AsAStackChild: Story = {
  render: () => (
    <Stack direction="row" spacing="300" align="stretch" style={{ width: '100%' }}>
      <Stack grow spacing="200" style={{ background: color.surfaces.card, padding: spacing[400] }}>
        <Typography with="heading05">grow</Typography>
        <Typography with="body01">Takes the space left over.</Typography>
      </Stack>
      <Stack alignSelf="center" spacing="200" style={{ background: color.surfaces.card, padding: spacing[400] }}>
        <Typography with="heading05">alignSelf</Typography>
        <Typography with="body01">Centres itself.</Typography>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'The other half of the same idea: a Stack inside a Stack takes `grow` and `alignSelf`, exactly as a `Box` would. All three primitives — Box, Stack and Grid — carry the same three child-side props, so a container never needs a wrapper to say where it sits.' } },
  },
};

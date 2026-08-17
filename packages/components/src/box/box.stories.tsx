import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './box';
import { Stack } from '../stack';
import { Grid } from '../grid';
import { Input } from '../input';
import { IconButton } from '../iconbutton';
import { Typography } from '../typography';
import { color, spacing } from '../tokens';

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: color.surfaces.card, padding: spacing[400], textAlign: 'center' }}>
    <Typography with="body01">{children}</Typography>
  </div>
);

const meta = {
  title: 'Layout/Box',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The case that prompted the component: a field that should take the space a
 * trailing button does not. Previously a `<div style={{ flex: 1 }}>`.
 */
export const GrowInAStack: Story = {
  render: () => (
    <Stack direction="row" spacing="300" align="end">
      <Box grow>
        <Input label="Step" />
      </Box>
      <IconButton icon="trash" label="Remove step" />
    </Stack>
  ),
};

export const SpanInAGrid: Story = {
  render: () => (
    <Grid spacing="300">
      <Box span={6}><Cell>6</Cell></Box>
      <Box span={18}><Cell>18</Cell></Box>
    </Grid>
  ),
};

/**
 * Stack's `align` defaults to `start`, so a column of children shrink-wraps.
 * `alignSelf` is how one child opts into filling without changing the row.
 */
export const AlignSelf: Story = {
  render: () => (
    <Stack spacing="300">
      <Cell>start, like its siblings</Cell>
      <Box alignSelf="stretch"><Cell>alignSelf=&quot;stretch&quot;</Cell></Box>
      <Cell>start again</Cell>
    </Stack>
  ),
};

/**
 * One Box serves both containers. A prop that does not apply to the parent is
 * inert rather than an error — `grow` does nothing in a Grid, `span` does
 * nothing in a Stack.
 */
export const InertProps: Story = {
  render: () => (
    <Stack spacing="300">
      <Typography with="caption01">span has no effect here — this is a Stack</Typography>
      <Stack direction="row" spacing="300">
        <Box span={12}><Cell>span 12</Cell></Box>
        <Box grow><Cell>grow</Cell></Box>
      </Stack>
    </Stack>
  ),
};

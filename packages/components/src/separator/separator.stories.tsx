import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';
import { Stack } from '../stack';
import { Typography } from '../typography';
import { ToggleButton } from '../togglebutton';
import { ToggleButtonGroup } from '../togglebuttongroup';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A rule that divides content. Announced as a separator by default; pass `decorative` where the structure is already carried by a heading, a list or a labelled group. Decided in `apps/docs/decisions/0012-separator.html`.',
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BetweenSections: Story = {
  render: () => (
    <Stack spacing="500">
      <Typography as="h2" with="heading04">Ingredients</Typography>
      <Typography as="p" tone="muted">Two hundred grams of flour, and a pinch of salt.</Typography>
      <Separator />
      <Typography as="h2" with="heading04">Method</Typography>
      <Typography as="p" tone="muted">Combine, rest for an hour, and roll thin.</Typography>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The headings already mark this boundary, so `decorative` would be defensible here too — the rule is announced by default because losing a boundary is harder to notice than hearing one.',
      },
    },
  },
};

/**
 * A vertical separator has no height of its own. It stretches to the flex or
 * grid row it sits in, which is why every example here is inside a `Stack`.
 */
export const Vertical: Story = {
  render: () => (
    <Stack direction="row" spacing="300" align="center">
      <Typography>Draft</Typography>
      <Separator orientation="vertical" decorative />
      <Typography tone="muted">Edited 3 minutes ago</Typography>
      <Separator orientation="vertical" decorative />
      <Typography tone="muted">2 collaborators</Typography>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`decorative` here because the metadata reads perfectly well as a sequence — announcing “separator” between each item would be noise.',
      },
    },
  },
};

export const InAToolbar: Story = {
  render: () => (
    <Stack direction="row" spacing="300" align="center">
      <ToggleButtonGroup aria-label="Theme">
        <ToggleButton value="light" isIconOnly icon="sun" label="Light" />
        <ToggleButton value="dark" isIconOnly icon="moon" label="Dark" />
      </ToggleButtonGroup>
      <Separator orientation="vertical" decorative />
      <ToggleButtonGroup aria-label="Favourite">
        <ToggleButton value="star" isIconOnly icon="star" label="Star" />
        <ToggleButton value="heart" isIconOnly icon="heart" label="Heart" />
      </ToggleButtonGroup>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The two groups are already named, so the rule between them is decoration. This is the case `decorative` exists for, and the one where the default is most often wrong.',
      },
    },
  },
};

/**
 * Deliberately shows what happens when the rule has no row to take its length
 * from — the failure a caller will otherwise meet with no explanation.
 */
export const VerticalNeedsARow: Story = {
  render: () => (
    <Stack spacing="500">
      <Typography as="p" tone="muted">Inside a row, it stretches:</Typography>
      <Stack direction="row" spacing="300" align="center">
        <Typography>Before</Typography>
        <Separator orientation="vertical" decorative />
        <Typography>After</Typography>
      </Stack>
      <Typography as="p" tone="muted">
        In a block parent there is nothing to stretch to, so it renders as nothing — the
        gap below holds a vertical Separator with no row:
      </Typography>
      <div>
        <Separator orientation="vertical" decorative />
      </div>
    </Stack>
  ),
};

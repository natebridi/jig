import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './icon';
import { icons } from './generated';
import { Stack } from '../stack';
import { Typography } from '../typography';
import { Button } from '../button';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { icon: 'check-circle', size: '2rem' },
  parameters: {
    docs: {
      description: {
        component:
          'A curated set from Phosphor, rendered through one component. Sizes to `1em` by default so icons match surrounding text, and inherits `currentColor`. Decorative unless given a `label`.',
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Weights: Story = {
  render: (args) => (
    <Stack direction="row" spacing="500" align="center">
      <Icon {...args} icon="check-circle" weight="regular" />
      <Icon {...args} icon="check-circle" weight="fill" />
      <Icon {...args} icon="warning" weight="regular" />
      <Icon {...args} icon="warning" weight="fill" />
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'Two weights ship: `regular` for the default state and `fill` for active, selected or pressed.' } },
  },
};

export const SizesWithText: Story = {
  render: () => (
    <Stack spacing="300">
      <Typography as="p" with="caption01">
        <Icon icon="info" /> Scales with caption01
      </Typography>
      <Typography as="p" with="body01">
        <Icon icon="info" /> Scales with body01
      </Typography>
      <Typography as="p" with="heading03">
        <Icon icon="info" /> Scales with heading03
      </Typography>
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'No size is set on any of these. The default of `1em` makes an icon track the type it sits in.' } },
  },
};

export const InAButton: Story = {
  render: () => (
    <Stack direction="row" spacing="300" align="center">
      <Button variant="primary">
        <Icon icon="copy" /> Copy
      </Button>
      <Button variant="secondary">
        Continue <Icon icon="arrow-right" />
      </Button>
      <Button variant="ghost" aria-label="Delete">
        <Icon icon="trash" label="Delete" />
      </Button>
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'Icons beside a text label stay decorative. The icon-only button passes `label`, which is what puts the icon into the accessibility tree.' } },
  },
};

export const ThirdPartyArtwork: Story = {
  render: () => (
    // Artwork outside the curated set: pass its own viewBox and the SVG content.
    <Icon size="2rem" viewBox="0 0 24 24" label="A star from another set">
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
    </Icon>
  ),
  parameters: {
    docs: { description: { story: 'Any SVG can use the same sizing, colour and accessibility contract by passing its content as children.' } },
  },
};

export const AllIcons: Story = {
  render: () => (
    <Stack direction="row" spacing="500" align="center" style={{ flexWrap: 'wrap' }}>
      {(Object.keys(icons) as (keyof typeof icons)[]).map((name) => (
        <Stack key={name} spacing="100" align="center">
          <Icon icon={name} size="1.75rem" />
          <Typography with="caption01">{name}</Typography>
        </Stack>
      ))}
    </Stack>
  ),
};

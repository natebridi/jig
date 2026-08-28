import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Button } from './button';
import { Stack } from '../stack';

const meta = {
  title: 'Components/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Danger: Story = { args: { variant: 'danger' } };

export const Ghost: Story = {
  args: { variant: 'ghost' },
  parameters: {
    docs: { description: { story: 'Draws no fill until hovered. Used for utility actions sitting on another surface, such as CodeBlock’s copy control.' } },
  },
};

/**
 * The blur only shows over something worth blurring, so the smoke stories put
 * the buttons on a busy backdrop rather than on Storybook's flat canvas —
 * against a flat surface the variant is indistinguishable from a soft tint.
 *
 * Fine stripes over a colour sweep rather than a photograph: the stripes are
 * the part that makes the blur visible (they dissolve under the pane and stay
 * sharp beside it) and the sweep is what proves the fill is neutral, since a
 * tinted one would shift hue as it crossed.
 */
const OnBusyBackdrop = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      padding: '3rem',
      borderRadius: '0.75rem',
      backgroundImage: [
        'repeating-linear-gradient(70deg, oklch(0% 0 0 / 0.3) 0 7px, oklch(100% 0 0 / 0.3) 7px 14px)',
        'linear-gradient(115deg, oklch(45% 0.15 265), oklch(60% 0.2 20) 35%, oklch(85% 0.16 85) 60%, oklch(50% 0.14 160))',
      ].join(', '),
    }}
  >
    {children}
  </div>
);

export const Smoke: Story = {
  args: { variant: 'smoke' },
  render: (args) => (
    <OnBusyBackdrop>
      <Button {...args} />
    </OnBusyBackdrop>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A translucent pane over a backdrop blur. Like ghost it never hides what it covers, but unlike ghost it is visible at rest — for controls laid over imagery, video, or a scrolling surface. The fill is neutral, so it darkens in the light theme and lightens in the dark one rather than tinting whatever is behind it.',
      },
    },
  },
};

export const SmokeStates: Story = {
  render: (args) => (
    <OnBusyBackdrop>
      <Stack direction="row" spacing="300" align="center">
        <Button {...args} variant="smoke">Smoke</Button>
        <Button {...args} variant="smoke" icon="copy">With icon</Button>
        <Button {...args} variant="smoke" disabled>Disabled</Button>
      </Stack>
    </OnBusyBackdrop>
  ),
  parameters: {
    docs: { description: { story: 'Smoke keeps a fill when disabled, where ghost clears its own — a disabled control that dissolves into a photograph reads as absent rather than unavailable.' } },
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="smoke">Smoke</Button>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </Stack>
  ),
};

export const WithIcon: Story = {
  args: { icon: 'copy', children: 'Copy' },
};

export const IconAtEnd: Story = {
  args: { icon: 'arrow-right', iconPosition: 'end', children: 'Continue' },
};

export const IconSizing: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <Button {...args} icon="copy" size="sm">Small</Button>
      <Button {...args} icon="copy" size="md">Medium</Button>
      <Button {...args} icon="copy" size="lg">Large</Button>
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'The icon is sized in `em`, so it scales with each size variant along with the gap — nothing to set per button.' } },
  },
};

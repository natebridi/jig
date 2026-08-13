import type { Meta, StoryObj } from '@storybook/react-vite';
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

export const Disabled: Story = { args: { disabled: true } };

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} variant="ghost">Ghost</Button>
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

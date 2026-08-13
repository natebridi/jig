import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { IconButton } from './iconbutton';
import { Stack } from '../stack';

const meta = {
  title: 'Components/Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { icon: 'trash', label: 'Delete' },
  parameters: {
    docs: {
      description: {
        component:
          'A button whose entire content is one icon. Padding is square rather than the wide horizontal padding a text label wants, and `label` is required because nothing visible names the button.',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <IconButton {...args} variant="ghost" />
      <IconButton {...args} variant="primary" />
      <IconButton {...args} variant="secondary" />
      <IconButton {...args} variant="danger" />
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'Defaults to `ghost`, since an icon-only control is usually a utility action beside something else.' } },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <IconButton {...args} size="sm" />
      <IconButton {...args} size="md" />
      <IconButton {...args} size="lg" />
    </Stack>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <IconButton {...args} icon="star" label="Favourite" weight="regular" />
      <IconButton {...args} icon="star" label="Favourite" weight="fill" />
    </Stack>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const IsNamedForScreenReaders: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The accessible name comes from `label`; the icon itself is decorative,
    // so the button must not be announced twice or left anonymous.
    const btn = canvas.getByRole('button', { name: 'Delete' });
    await expect(btn).toHaveAttribute('type', 'button');
    await expect(canvas.queryByRole('img')).toBeNull();
  },
};

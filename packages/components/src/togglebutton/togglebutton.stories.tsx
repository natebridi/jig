import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ToggleButton } from './togglebutton';
import { IconButton } from '../iconbutton';
import { Stack } from '../stack';

const meta = {
  title: 'Components/Buttons/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  args: { children: 'Bold' },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StartsPressed: Story = { args: { defaultPressed: true } };

export const Disabled: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <ToggleButton {...args} disabled>Off + disabled</ToggleButton>
      <ToggleButton {...args} defaultPressed disabled>On + disabled</ToggleButton>
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'A disabled toggle keeps its fill when pressed — otherwise it would look identical in both states while aria-pressed said otherwise. The muted text colour is what carries "disabled".' } },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <ToggleButton {...args} size="sm">Small</ToggleButton>
      <ToggleButton {...args} size="md">Medium</ToggleButton>
      <ToggleButton {...args} size="lg">Large</ToggleButton>
    </Stack>
  ),
};

export const WithIcon: Story = {
  args: { icon: 'star', children: 'Favourite' },
  parameters: {
    docs: { description: { story: 'The icon renders at `regular` while unpressed and switches to `fill` when pressed, so the state reads even without the background change.' } },
  },
};

export const WithPressedIcon: Story = {
  args: { icon: 'eye', pressedIcon: 'eye-slash', children: 'Hide' },
  parameters: {
    docs: { description: { story: 'Pass `pressedIcon` when the two states are different things rather than the same thing switched on.' } },
  },
};

export const ThemeToggle: Story = {
  args: { icon: 'moon', pressedIcon: 'sun', children: 'Dark mode' },
};

export const IconOnly: Story = {
  args: { isIconOnly: true, icon: 'star', label: 'Favourite' },
  parameters: {
    docs: { description: { story: 'Takes IconButton\'s square padding from the same recipe variant. `label` and `icon` are both required in this form — the type will not let you build an anonymous or empty one.' } },
  },
};

export const IconOnlySizes: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <ToggleButton {...args} isIconOnly icon="star" label="Favourite" size="sm" />
      <ToggleButton {...args} isIconOnly icon="star" label="Favourite" size="md" />
      <ToggleButton {...args} isIconOnly icon="star" label="Favourite" size="lg" />
    </Stack>
  ),
};

export const MatchesIconButton: Story = {
  render: (args) => (
    <Stack spacing="300">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stack key={size} direction="row" spacing="300" align="center">
          <IconButton icon="star" label="Favourite" size={size} />
          <ToggleButton {...args} isIconOnly icon="star" label="Favourite" size={size} />
          <ToggleButton {...args} isIconOnly icon="star" label="Favourite" size={size} defaultPressed />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'IconButton beside an unpressed and a pressed icon-only ToggleButton at each size. Both read the same `iconOnly` variant, so the dimensions cannot drift apart.' } },
  },
};

export const TogglesOnClick: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Bold' });

    await step('starts unpressed', async () => {
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    await step('a click presses it', async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    });

    await step('a second click releases it', async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

export const IgnoresClicksWhenDisabled: Story = {
  args: { defaultPressed: true, disabled: true },
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' });

    // The disabled button sets pointer-events: none, which user-event treats as
    // "not clickable" and refuses outright. Turning that guard off makes it
    // deliver the click anyway, which is the only way to assert the toggle
    // ignores it rather than merely that it could not be reached.
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    await user.click(toggle);

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  },
};

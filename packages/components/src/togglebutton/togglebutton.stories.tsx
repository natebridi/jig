import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ToggleButton } from './togglebutton';
import { Stack } from '../stack';

const meta = {
  title: 'Components/ToggleButton',
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

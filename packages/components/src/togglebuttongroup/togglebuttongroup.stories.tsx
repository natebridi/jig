import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ToggleButtonGroup } from './togglebuttongroup';
import { ToggleButton } from '../togglebutton';
import { Stack } from '../stack';
import { Typography } from '../typography';

const meta = {
  title: 'Components/Buttons/ToggleButtonGroup',
  component: ToggleButtonGroup,
  tags: ['autodocs'],
  args: { 'aria-label': 'View' },
  parameters: {
    docs: {
      description: {
        component:
          'The children are plain `ToggleButton`s — there is no separate item component. Each needs a `value` identifying it within the group. The group carries no visual treatment of its own yet: buttons look exactly as they do standalone, and spacing or a connected appearance is a later decision.',
      },
    },
  },
} satisfies Meta<typeof ToggleButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  args: { defaultValue: ['week'] },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const MultiSelect: Story = {
  args: { multiple: true, defaultValue: ['starred'], 'aria-label': 'Filters' },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton value="starred" icon="star">Starred</ToggleButton>
      <ToggleButton value="unread" icon="eye" pressedIcon="eye-slash">Unread</ToggleButton>
      <ToggleButton value="liked" icon="heart">Liked</ToggleButton>
    </ToggleButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The icon still swaps to the `fill` weight when pressed, and to `pressedIcon` where one is given — read from the group\'s state rather than the button\'s own.',
      },
    },
  },
};

export const IconOnly: Story = {
  args: { defaultValue: ['list'], 'aria-label': 'Layout' },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton value="list" isIconOnly icon="list" label="List" />
      <ToggleButton value="calendar" isIconOnly icon="calendar" label="Calendar" />
      <ToggleButton value="starred" isIconOnly icon="star" label="Starred" />
    </ToggleButtonGroup>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['week'] },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
    </ToggleButtonGroup>
  ),
  parameters: {
    docs: {
      description: { story: 'The group\'s `disabled` wins over each button\'s own.' },
    },
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical', defaultValue: ['week'] },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
    </ToggleButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`orientation` sets which arrow keys move focus and what is reported to assistive technology, and lays the buttons out in a column. Nothing else about the appearance changes.',
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [view, setView] = useState<'day' | 'week' | 'month'>('week');
    return (
      <Stack spacing="300" align="start">
        {/* Not spreading `args` here: Storybook types them against the meta's
            default `Value` of `string`, which conflicts with the narrower type
            argument this story is demonstrating. */}
        <ToggleButtonGroup<'day' | 'week' | 'month'>
          aria-label="View"
          value={[view]}
          onValueChange={(value) => value[0] && setView(value[0])}
        >
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
        <Typography with="caption01">Showing: {view}</Typography>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The value is an array even in single-select, so a single selection reads `value[0]`. The type argument narrows `onValueChange` — it does not check each button\'s `value`, which React cannot do for children.',
      },
    },
  },
};

/**
 * One tab stop for the whole group, then arrow keys within it.
 */
export const RovingFocus: Story = {
  args: { defaultValue: ['week'] },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
    </ToggleButtonGroup>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('tab reaches the group once', async () => {
      await userEvent.tab();
      await expect(canvas.getByRole('button', { name: 'Day' })).toHaveFocus();
    });

    await step('arrow keys move within it', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getByRole('button', { name: 'Week' })).toHaveFocus();
    });

    await step('pressing selects and releases the others', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getByRole('button', { name: 'Week' })).toHaveAttribute('aria-pressed', 'true');
      await expect(canvas.getByRole('button', { name: 'Day' })).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

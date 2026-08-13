import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tooltip } from './tooltip';
import { Button } from '../button';
import { Stack } from '../stack';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Saved automatically',
    children: <Button variant="secondary">Hover me</Button>,
  },
  parameters: {
    docs: { description: { component: 'Wraps a single child, which acts as the trigger. Positioned with native CSS anchor positioning and rendered in the top layer, so no ancestor’s overflow can clip it.' } },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  render: (args) => (
    <Stack direction="row" spacing="600" align="center">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Tooltip {...args} key={side} placement={side} content={`Placed on the ${side}`}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const LongContent: Story = {
  args: { content: 'Long descriptions wrap at a readable measure rather than running off the edge of the viewport.' },
};

export const AnyFocusableTrigger: Story = {
  args: {
    content: 'Any focusable element can be a trigger.',
    children: (
      <span tabIndex={0} style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
        a plain span
      </span>
    ),
  },
};

export const OpensOnHover: Story = {
  args: { delay: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button', { name: 'Hover me' }));

    // findByRole polls, where an instrumented expect inside waitFor gives up on
    // its first attempt. A closed tooltip is display:none and so absent from
    // the accessibility tree — finding it by role *is* the proof it opened.
    //
    // Deliberately not asserting toBeVisible: the 120ms entry fade starts at
    // opacity 0, so visibility trails "open" by a frame, and an animation clock
    // that is throttled (a backgrounded preview, for one) never advances it.
    const tooltip = await canvas.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Saved automatically');
  },
};

export const DescribesItsTrigger: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Hover me' });
    // The bubble stays wired to the trigger whether or not it is showing.
    await expect(trigger).toHaveAttribute('aria-describedby');
  },
};

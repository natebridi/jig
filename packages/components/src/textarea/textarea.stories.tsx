import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './textarea';
import { Input } from '../input';
import { Stack } from '../stack';

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { label: 'Release note', placeholder: 'What changed…' },
  parameters: {
    docs: {
      description: {
        component:
          'A multi-line text field, styled as `Input` is. It grows with its value through `field-sizing: content` — `lines` sets the floor, `maxLines` the cap. Dragging the grip hands the height to the user permanently; see **Resizing**.',
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Markdown is fine.' },
};

export const WithIcon: Story = {
  args: { icon: 'pencil-simple' },
  parameters: {
    docs: {
      description: {
        story:
          'The glyph is decorative and non-interactive, and aligns to the **first line** rather than the middle of the box — so it stays put as the field grows.',
      },
    },
  },
};

export const Invalid: Story = {
  args: { error: 'A release note is required.', defaultValue: '' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Nothing to see here.' },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack spacing="400">
      <Textarea {...args} size="sm" label="Small" />
      <Textarea {...args} size="md" label="Medium" />
      <Textarea {...args} size="lg" label="Large" />
    </Stack>
  ),
};

/**
 * `lines` is a floor, not a height. Type past it and the control grows; it
 * cannot shrink below the count you set.
 */
export const Lines: Story = {
  render: (args) => (
    <Stack spacing="400">
      <Textarea {...args} lines={1} label="lines = 1" />
      <Textarea {...args} lines={3} label="lines = 3 (default)" />
      <Textarea {...args} lines={6} label="lines = 6" />
    </Stack>
  ),
};

/**
 * With `maxLines` the field stops growing and scrolls instead, which is what
 * keeps a pasted changelog from walking the rest of the form off the screen.
 */
export const Capped: Story = {
  args: {
    lines: 2,
    maxLines: 5,
    label: 'lines = 2, maxLines = 5',
    defaultValue: Array.from({ length: 9 }, (_, i) => `Line ${i + 1}`).join('\n'),
  },
};

/**
 * The one behaviour you cannot read off the props.
 *
 * `resize: vertical` is always on. Dragging the grip writes an inline height,
 * and an explicit height re-imposes fixed sizing — so **the first drag ends the
 * automatic growth for good**, and nothing in the platform clears it. That is
 * deliberate: someone who drags a field to a height has said what they want.
 *
 * The drag is still clamped by `lines` and `maxLines`, so it can only pick a
 * height inside the envelope. Drag the field below, then keep typing.
 */
export const Resizing: Story = {
  args: {
    lines: 3,
    maxLines: 10,
    label: 'Drag me, then type',
    defaultValue: 'Drag the grip in the bottom-right corner, then add more lines.',
  },
};

/**
 * The reason the block padding is derived rather than taken off the spacing
 * ramp. A one-line Textarea is exactly a control height, so its first line of
 * text sits where the Input's text sits — at every size.
 */
export const AlignsWithInput: Story = {
  args: { label: undefined, placeholder: 'Note' },
  render: (args) => (
    <Stack spacing="400" align="start">
      <Stack direction="row" spacing="300" align="start">
        <Input size="sm" placeholder="Input sm" />
        <Textarea {...args} size="sm" lines={1} placeholder="Textarea sm" />
      </Stack>
      <Stack direction="row" spacing="300" align="start">
        <Input size="md" placeholder="Input md" />
        <Textarea {...args} size="md" lines={1} placeholder="Textarea md" />
      </Stack>
      <Stack direction="row" spacing="300" align="start">
        <Input size="lg" placeholder="Input lg" />
        <Textarea {...args} size="lg" lines={1} placeholder="Textarea lg" />
      </Stack>
    </Stack>
  ),
};

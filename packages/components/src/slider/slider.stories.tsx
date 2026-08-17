import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './slider';
import { Stack } from '../stack';
import { Input } from '../input';
import { Button } from '../button';

const meta = {
  title: 'Components/Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { label: 'Sweetness', defaultValue: 60 },
  parameters: {
    docs: {
      description: {
        component:
          'The thumb is edge-aligned and that is not configurable — it insets at the extremes so the control occupies exactly its declared width, which is what lets it line up with the fields around it.',
      },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Adjusts the sugar in the final mix.' },
};

/**
 * The value bubble appears while dragging **and** while focused, so a keyboard
 * user arrowing the value gets the same readout as someone dragging. Tab to the
 * thumb to see it without touching the pointer.
 */
export const ValueBubble: Story = {
  args: { description: 'Tab to the thumb, then press the arrow keys.' },
};

export const Steppers: Story = {
  args: { steppers: true, step: 5, description: 'Minus and plus move by exactly one step.' },
};

export const Disabled: Story = {
  args: { disabled: true, steppers: true },
  parameters: {
    docs: {
      description: {
        story:
          'The indicator drops to the track colour rather than dimming, so the tell is the absence of fill. At a 2px track a lightness shift alone was not distinguishable.',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack spacing="500">
      <Slider {...args} size="sm" label="Small" steppers />
      <Slider {...args} size="md" label="Medium" steppers />
      <Slider {...args} size="lg" label="Large" steppers />
    </Stack>
  ),
};

/**
 * The reason the row height comes from `size.control`: a slider, an input and a
 * button at the same size share a row without anything being nudged.
 */
export const AlignsWithOtherControls: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="end">
      <Input label="Name" size="md" />
      <div style={{ flex: 1 }}>
        <Slider {...args} label="Sweetness" size="md" />
      </div>
      <Button size="md">Save</Button>
    </Stack>
  ),
};

export const Formatted: Story = {
  args: {
    label: 'Budget',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 250,
    format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
    steppers: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(40);
    return (
      <Stack spacing="400" align="start">
        <Slider {...args} value={value} onValueChange={setValue} steppers />
        <Button variant="secondary" size="sm" onClick={() => setValue(0)}>
          Reset to zero
        </Button>
      </Stack>
    );
  },
};

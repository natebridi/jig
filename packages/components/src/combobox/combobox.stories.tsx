import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Combobox } from './combobox';
import { Stack } from '../stack';
import { Input } from '../input';

const people = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'alan', label: 'Alan Turing' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'katherine', label: 'Katherine Johnson' },
];

const byTeam = [
  { label: 'Engineering', items: [people[0]!, people[1]!] },
  { label: 'Design', items: [people[2]!] },
  { label: 'Research', items: [people[3]!] },
];

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: { label: 'Assignee', items: people, placeholder: 'Search people…' },
  parameters: {
    docs: {
      description: {
        component:
          'A filterable field. Options arrive as data rather than as children, so the wiring between label, description and error cannot be left out. Filtering is Base UI’s, over `items`. Decided in `apps/docs/decisions/0011-combobox.html`.',
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Grouped: Story = {
  args: { items: byTeam },
  parameters: {
    docs: {
      description: {
        story:
          'A group is `{ label, items }` inside the same `items` prop — the shape Base UI reads natively, so there is no mapping layer between what you pass and what does the filtering. Flat and grouped entries can be mixed in one array.',
      },
    },
  },
};

export const Multiple: Story = {
  // `satisfies Meta<typeof Combobox>` erases the generic to `unknown`, so a
  // spread of `args` cannot narrow the single/multiple union. The props are
  // written out here rather than spread — see the doc's As built.
  render: () => {
    const [value, setValue] = useState<string[]>(['ada']);
    return (
      <Combobox
        label="Reviewers"
        placeholder={'Search people\u2026'}
        items={people}
        multiple
        value={value}
        onValueChange={(next) => setValue(next)}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Selections render inside the field as chips wearing `Token`’s styles, at the height 0006 derived from `size.control` for exactly this. The field grows as chips wrap — the accepted cost of showing what is selected without opening the list.',
      },
    },
  },
};

export const GroupedMultiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['ada', 'grace']);
    return (
      <Combobox
        label="Reviewers"
        placeholder={'Search people\u2026'}
        items={byTeam}
        multiple
        value={value}
        onValueChange={(next) => setValue(next)}
      />
    );
  },
};

const measures = [
  'tsp', 'Tbsp', 'Clove', 'Sprig', 'Oz', 'Cup', 'Bundle', 'Oz (Imperial)',
  'Pinch', 'Dash', 'Gram', 'Kilogram', 'Millilitre', 'Litre', 'Pound',
].map((m) => ({ value: m.toLowerCase(), label: m }));

export const LongList: Story = {
  args: { label: 'Measure', items: measures, placeholder: '' },
  parameters: {
    docs: {
      description: {
        story:
          'The popup caps at 20rem or the space available below the field, whichever is smaller, and the list scrolls inside it.',
      },
    },
  },
};

export const WiderPopup: Story = {
  args: {
    label: 'Measure',
    items: measures,
    placeholder: '',
    popupMinWidth: '18rem',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The popup matches the field by default. `popupMinWidth` sets a floor, for when the options are longer than the control is wide.',
      },
    },
  },
};

/**
 * A Combobox holding a single chip has to match an Input of the same size —
 * Token's height is derived from `size.control` for exactly this. It only
 * grows once the chips wrap to a second line.
 */
export const MatchesInputHeight: Story = {
  render: () => (
    <Stack direction="column" spacing="500">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stack key={size} direction="row" spacing="400" align="end">
          <Input size={size} label={`Input ${size}`} defaultValue="Text" />
          <Combobox
            size={size}
            label={`Combobox ${size}`}
            items={people}
            multiple
            defaultValue={['ada']}
          />
        </Stack>
      ))}
    </Stack>
  ),
};

export const WithDescription: Story = {
  args: { description: 'Only people with write access appear here.' },
};

export const WithError: Story = {
  args: { error: 'Pick an assignee before saving.' },
  parameters: {
    docs: {
      description: {
        story:
          'Passing `error` marks the field invalid and shows the message unconditionally — for a server response or a form library, which the browser’s own constraint validation cannot re-derive.',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="column" spacing="400">
      <Combobox {...args} size="sm" label="Small" />
      <Combobox {...args} size="md" label="Medium" />
      <Combobox {...args} size="lg" label="Large" />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The height comes from `size.control`, so a Combobox lines up with a Button and an Input of the same size.',
      },
    },
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const NoResults: Story = {
  args: { emptyMessage: 'Nobody by that name' },
  parameters: {
    docs: { description: { story: 'Type something that matches nothing to see the empty state.' } },
  },
};

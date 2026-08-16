import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';
import { Button } from '../button';
import { Stack } from '../stack';

const meta = {
  title: 'Components/Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Email', placeholder: 'you@example.com' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'We only use this to send receipts.' },
};

export const Invalid: Story = {
  args: { error: 'That does not look like an email address.', defaultValue: 'nate@example' },
  parameters: {
    docs: {
      description: {
        story:
          'Passing `error` marks the field invalid and shows the message. Leave it off and the browser’s own constraint validation drives the state instead — see **Native validation**.',
      },
    },
  },
};

export const NativeValidation: Story = {
  args: { type: 'email', required: true, description: 'Submit an empty form to see the browser’s message.' },
  render: (args) => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack spacing="400" align="start">
        <Input {...args} />
        <Button type="submit" size="sm">Submit</Button>
      </Stack>
    </form>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'nate@example.com' },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack spacing="400">
      <Input {...args} size="sm" label="Small" />
      <Input {...args} size="md" label="Medium" />
      <Input {...args} size="lg" label="Large" />
    </Stack>
  ),
};

/**
 * The reason the control height is a token. Each row pairs an Input with a
 * Button at the same size — they should be exactly the same height, which is
 * what a search bar needs and what padding-derived heights could not give.
 */
export const AlignsWithButton: Story = {
  args: { label: undefined, placeholder: 'Search' },
  render: (args) => (
    <Stack spacing="400" align="start">
      <Stack direction="row" spacing="300" align="center">
        <Input {...args} size="sm" />
        <Button size="sm">Search</Button>
      </Stack>
      <Stack direction="row" spacing="300" align="center">
        <Input {...args} size="md" />
        <Button size="md">Search</Button>
      </Stack>
      <Stack direction="row" spacing="300" align="center">
        <Input {...args} size="lg" />
        <Button size="lg">Search</Button>
      </Stack>
    </Stack>
  ),
};

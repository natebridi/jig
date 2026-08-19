import type { Meta, StoryObj } from '@storybook/react-vite';
import { Token } from './token';
import { Input } from '../input';
import { Stack } from '../stack';

const meta = {
  title: 'Components/Token',
  component: Token,
  tags: ['autodocs'],
  args: { children: 'Design' },
} satisfies Meta<typeof Token>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args) => (
    <Stack direction="row" spacing="200" style={{ flexWrap: 'wrap' }}>
      <Token {...args} color="warm">warm</Token>
      <Token {...args} color="cool">cool</Token>
      <Token {...args} color="blue">blue</Token>
      <Token {...args} color="teal">teal</Token>
      <Token {...args} color="green">green</Token>
      <Token {...args} color="lime">lime</Token>
      <Token {...args} color="yellow">yellow</Token>
      <Token {...args} color="orange">orange</Token>
      <Token {...args} color="red">red</Token>
      <Token {...args} color="fuschia">fuschia</Token>
      <Token {...args} color="purple">purple</Token>
      <Token {...args} color="gray">gray</Token>
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'A Token’s colour names a hue, not an emphasis — it says which kind of thing the value is, not how urgent it is. `warm` is the default.' } },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <Token {...args} size="sm">Small</Token>
      <Token {...args} size="md">Medium</Token>
      <Token {...args} size="lg">Large</Token>
    </Stack>
  ),
};

export const WithIcon: Story = {
  args: { icon: 'user', color: 'blue', children: 'Nate Bridi' },
};

export const AsLink: Story = {
  args: { href: '#design', color: 'teal' },
  parameters: {
    docs: { description: { story: 'With no remove button to sit beside it, the whole pill is the `<a>` — one tab stop, and the entire pill is the target. It takes the hue’s hover fill.' } },
  },
};

export const Removable: Story = {
  args: { onRemove: () => {}, color: 'blue' },
  parameters: {
    docs: { description: { story: 'The remove button stretches to the pill’s top, right and bottom edges, so the target is the corner of the pill rather than the glyph. Its accessible name is derived from the label.' } },
  },
};

export const LinkAndRemovable: Story = {
  args: { href: '#design', onRemove: () => {}, color: 'blue' },
  parameters: {
    docs: { description: { story: 'A `<button>` cannot nest inside an `<a>`, so the anchor shrinks to the label and the pill becomes a container. The label underlines on hover rather than the pill filling, because only the label is clickable.' } },
  },
};

export const AgainstAField: Story = {
  render: () => (
    <Stack spacing="400">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stack key={size} direction="row" spacing="300" align="center">
          <Input size={size} placeholder={`Input ${size}`} />
          <Token size={size} color="blue" onRemove={() => {}}>Design</Token>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'Each Token size is the matching Input’s height less its two borders and one `spacing.100` of air on each side — 2.68px — so it nests inside a field of the same size. Shown side by side because `Input` takes no children; the multi-value field that would hold a row of these is a later proposal. See apps/docs/decisions/0006-token.html (D1).' } },
  },
};

export const Truncates: Story = {
  args: {
    color: 'purple',
    children: 'A label long enough that it has to be cut off somewhere',
    style: { maxWidth: '14rem' },
  },
  parameters: {
    docs: { description: { story: 'Labels truncate rather than wrap — a two-line token cannot fit a control of fixed height. The width is the caller’s, through `style`.' } },
  },
};

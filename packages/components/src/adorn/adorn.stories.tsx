import type { Meta, StoryObj } from '@storybook/react-vite';
import { Adorn } from './adorn';
import { Typography } from '../typography';

const meta = {
  title: 'Components/Adorn',
  component: Adorn,
  tags: ['autodocs'],
  args: { children: 'adorned', with: 'semibold' },
  parameters: {
    docs: { description: { component: 'Inline emphasis inside a run of text. Renders a span by default; use `as` for a different element.' } },
  },
} satisfies Meta<typeof Adorn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Styles: Story = {
  render: () => (
    <Typography as="p" with="body01">
      This is <Adorn with="semibold">semibold</Adorn>, this is <Adorn with="bold">bold</Adorn>, this
      is <Adorn with="italic">italic</Adorn>, this is <Adorn with="code">code</Adorn>, and this
      is <Adorn with="danger">danger</Adorn>.
    </Typography>
  ),
};

export const Nested: Story = {
  render: () => (
    <Typography as="p" with="body01">
      This is <Adorn with="danger"><Adorn with="italic">critical</Adorn></Adorn>.
    </Typography>
  ),
};

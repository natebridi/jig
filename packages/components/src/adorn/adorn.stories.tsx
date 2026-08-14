import type { Meta, StoryObj } from '@storybook/react-vite';
import { Adorn } from './adorn';
import { Typography } from '../typography';

const meta = {
  title: 'Components/Adorn',
  component: Adorn,
  tags: ['autodocs'],
  args: { children: 'adorned', with: 'accent' },
  parameters: {
    docs: {
      description: {
        component:
          'Inline semantic colour inside a run of text. Renders a span by default; use `as` to change what the text *means* — weight and slant come from `as="strong"` and `as="em"` rather than from a visual-only prop.',
      },
    },
  },
} satisfies Meta<typeof Adorn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colours: Story = {
  render: () => (
    <Typography as="p" with="body01">
      This is <Adorn with="muted">muted</Adorn>, this is <Adorn with="accent">accent</Adorn>, this
      is <Adorn with="danger">danger</Adorn>, and this is <Adorn with="code">code</Adorn>.
    </Typography>
  ),
};

/**
 * Emphasis is the element's job. `as="strong"` and `as="em"` carry the styling
 * *and* announce the emphasis to assistive technology, which a visual-only
 * prop could not do.
 */
export const Emphasis: Story = {
  render: () => (
    <Typography as="p" with="body01">
      This is <Adorn as="strong">important</Adorn>, this is <Adorn as="em">stressed</Adorn>, and
      this is <Adorn as="strong" with="danger">both</Adorn>.
    </Typography>
  ),
};

export const Nested: Story = {
  render: () => (
    <Typography as="p" with="body01">
      This is <Adorn with="danger"><Adorn as="em">critical</Adorn></Adorn>.
    </Typography>
  ),
};

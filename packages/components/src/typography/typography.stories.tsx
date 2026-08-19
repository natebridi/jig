import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  args: { children: 'Testing copy, and this is the type scale' },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

const displays = ['display01', 'display02', 'display03', 'display04', 'display05', 'display06'] as const;
const headings = ['heading01', 'heading02', 'heading03', 'heading04', 'heading05', 'heading06'] as const;
const body = ['body01', 'body02', 'caption01', 'caption02'] as const;

export const Default: Story = {};

export const Displays: Story = {
  render: (args) => (
    <>
      {displays.map((style) => (
        <Typography {...args} key={style} with={style} mb="300">{style}</Typography>
      ))}
    </>
  ),
};

export const Headings: Story = {
  render: (args) => (
    <>
      {headings.map((style) => (
        <Typography {...args} key={style} with={style} mb="300">{style}</Typography>
      ))}
    </>
  ),
};

export const BodyAndCaptions: Story = {
  render: (args) => (
    <>
      {body.map((style) => (
        <Typography {...args} key={style} with={style} mb="300">{style}</Typography>
      ))}
    </>
  ),
};

export const Spacing: Story = {
  render: () => (
    <>
      <Typography as="h3" with="heading04" mb="500">Heading, mb 500</Typography>
      <Typography as="p" with="body01" mb="200">Paragraph, mb 200.</Typography>
      <Typography as="p" with="body01" mb="200">Another paragraph, mb 200.</Typography>
      <Typography as="p" with="body01">Last paragraph, no margin at all.</Typography>
    </>
  ),
  parameters: {
    docs: { description: { story: 'Margin props for uneven rhythm a uniform Stack gap cannot express. Note they are additive with gap — inside a Stack, change the Stack instead.' } },
  },
};

export const ResponsiveSpacing: Story = {
  render: () => (
    <>
      <Typography as="p" with="body01" mb={{ xs: '100', md: '700' }}>
        Responsive margin — mb 100 below md, mb 700 from md up. Resize the canvas to see it.
      </Typography>
      <Typography as="p" with="caption01">The element that follows it.</Typography>
    </>
  ),
};

export const Balance: Story = {
  render: () => (
    <div style={{ maxWidth: '26rem' }}>
      <Typography as="h3" with="heading04" mb="500">
        A heading long enough to wrap, left to fill each line before it breaks
      </Typography>
      <Typography as="h3" with="heading04" balance>
        A heading long enough to wrap, with its line lengths evened out instead
      </Typography>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'The same heading twice, at the same width. `balance` stops the last line being a single orphaned word. It is for short text that wraps to a few lines — browsers cap the effect at a handful of lines, so it does nothing to a paragraph.' } },
  },
};

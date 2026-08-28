import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './typography';
import { Link } from '../link';

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

export const Tones: Story = {
  render: () => (
    <>
      {(['primary', 'secondary', 'muted', 'accent', 'danger'] as const).map((tone) => (
        <Typography key={tone} as="p" tone={tone} mb="300">
          {tone} &mdash; the register this prose is in
        </Typography>
      ))}
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A register rather than a colour: `danger` is not red, it is *danger*, and it resolves to a different red in each theme. Setting a tone also sets the hover colour of any `Link` inside it \u2014 see the Prose story. `inverse` is deliberately absent here; it has its own story, on the surface it requires.',
      },
    },
  },
};

/**
 * `inverse` is rendered on `color.surfaces.inverse` rather than on the default
 * canvas, and only ever should be. It is the one tone that is a context rather
 * than a register, and a story showing it on the body surface would be a story
 * teaching the mistake. 0010 D3's outcome makes this part of the build.
 */
export const InverseTone: Story = {
  render: () => (
    <>
      <div
        style={{
          background: 'var(--color-surfaces-inverse)',
          padding: '1.17rem',
          borderRadius: '4.3px',
        }}
      >
        <Typography as="p" tone="inverse">
          Legible here, and only here.
        </Typography>
      </div>
      <Typography as="p" with="caption01" tone="muted" mt="400">
        On the body surface the same tone renders text the colour of the page. Nothing
        can check that for you &mdash; whether the background behind is inverted is not
        knowable from the component.
      </Typography>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`tone="inverse"` paints light ink for a dark panel. It is the only tone with a precondition, and the precondition cannot be checked in code \u2014 any ancestor may have painted the background. Use it on `color.surfaces.inverse`, and nowhere else.',
      },
    },
  },
};

export const ProseWithLinks: Story = {
  render: () => (
    <>
      {(['primary', 'secondary', 'muted', 'danger'] as const).map((tone) => (
        <Typography key={tone} as="p" tone={tone} mb="300">
          {tone.charAt(0).toUpperCase() + tone.slice(1)} prose, with{' '}
          <Link href="#">a link in it</Link> to hover.
        </Typography>
      ))}
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The reason the axis exists. A `Link` inherits the colour of the text around it, and setting a tone sets the hover partner beside that colour \u2014 so a link in muted prose hovers to muted\u2019s own step, not to body copy\u2019s. Nothing is passed at either end.',
      },
    },
  },
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

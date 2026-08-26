import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './scrollarea';
import { Button } from '../button';
import { Stack } from '../stack';
import { Typography } from '../typography';
import { color, radius, spacing } from '@jig-ui/styles/tokens';

const paragraphs = [
  'A scroll area is a region that is smaller than what it holds. The native scrollbar is hidden and one is drawn in its place, because a platform scrollbar is sized, coloured and timed by the operating system rather than by the design system.',
  'At rest it shows no chrome at all. The bar appears on hover, on focus within the area, and while scrolling — try tabbing into this one.',
  'What says the content is cropped in the meantime is the gradient mask at the two edges. It is clamped by the distance actually scrolled, so it collapses to nothing as you reach either end.',
  'The height is the caller’s. A scroll area scrolls because something constrains it: a max-height, or a flex parent with min-height zero.',
  'Scroll to the bottom and the lower fade disappears, because there is nothing further down for it to point at.',
];

const Body = () => (
  <Stack spacing="300">
    {paragraphs.map((text) => (
      <Typography key={text} as="p" with="body01">{text}</Typography>
    ))}
  </Stack>
);

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea style={{ maxHeight: '14rem', maxWidth: '32rem' }}>
      <Body />
    </ScrollArea>
  ),
  parameters: {
    docs: { description: { story: 'Hover it, tab into it, or scroll it — the bar is painted only for those three. The gutter it occupies is reserved either way, so nothing reflows when it appears.' } },
  },
};

export const NoOverflow: Story = {
  render: () => (
    <ScrollArea style={{ maxHeight: '14rem', maxWidth: '32rem' }}>
      <Typography as="p" with="body01">Short enough to fit.</Typography>
    </ScrollArea>
  ),
  parameters: {
    docs: { description: { story: 'Nothing to scroll: no bar is rendered, no mask is drawn, and the viewport stays out of the tab order. Base UI unmounts a scrollbar whose axis does not overflow.' } },
  },
};

export const PinnedHeaderAndActions: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '18rem',
        maxWidth: '32rem',
        background: color.surfaces.card,
        border: `1px solid ${color.control.border}`,
        borderRadius: radius[400],
        overflow: 'hidden',
      }}
    >
      <Typography as="h3" with="heading05" style={{ padding: spacing[500], flex: 'none' }}>
        Terms of service
      </Typography>

      {/* `min-height: 0` is what makes a flex child actually shrink — without
          it the body grows to its content and nothing scrolls. */}
      <ScrollArea style={{ flex: 1, minHeight: 0, padding: `0 ${spacing[500]}` }}>
        <Body />
      </ScrollArea>

      <Stack direction="row" spacing="300" justify="end" style={{ padding: spacing[500], flex: 'none' }}>
        <Button variant="secondary">Decline</Button>
        <Button variant="primary">Accept</Button>
      </Stack>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'The arrangement this component exists for, and what Dialog will compose. The title and the actions stay put while the body moves; the mask marks the seam at both ends. See apps/docs/decisions/0007-scroll-area.html.' } },
  },
};

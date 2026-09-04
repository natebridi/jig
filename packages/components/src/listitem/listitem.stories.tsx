import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListItem } from './listitem';
import { Icon } from '../icon';
import { IconButton } from '../iconbutton';
import { Token } from '../token';
import { Typography } from '../typography';
import { Stack } from '../stack';

const meta = {
  title: 'Components/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  args: { children: 'Getting started' },
  parameters: {
    docs: {
      description: {
        component:
          'A row: `start`, a label, and `end`. The whole row is the link when `href` is set — everything except the `end` slot, which sits outside it so it can hold a button. `start` takes non-interactive content only; nesting a button inside a link is invalid HTML. Decided in `apps/docs/decisions/0014-sidebar-navigation.html`.',
      },
    },
  },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const List = ({ children }: { children: React.ReactNode }) => (
  <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, maxWidth: '18rem' }}>
    {children}
  </ul>
);

export const Default: Story = {
  render: (args) => <List><ListItem {...args} /></List>,
};

export const AsALink: Story = {
  render: (args) => (
    <List>
      <ListItem {...args} href="/docs/install" start={<Icon icon="star" />} />
    </List>
  ),
};

/**
 * The rule the component is built around: `start` renders inside the anchor so
 * it must not be interactive, and `end` is a sibling so it can be. Tab through
 * this — the link and the button are both reachable.
 */
export const InteractiveEndSlot: Story = {
  render: () => (
    <List>
      <ListItem
        href="/docs/install"
        start={<Icon icon="star" />}
        end={<IconButton icon="trash" label="Remove Installation" size="sm" variant="ghost" />}
      >
        Installation
      </ListItem>
      <ListItem href="/docs/theming" start={<Icon icon="bell" />} end={<Token color="blue" size="sm">new</Token>}>
        Theming
      </ListItem>
    </List>
  ),
};

/**
 * `selectedIcon` reserves its gutter on every row whether or not that row is
 * the selected one, so the labels hold one column as the selection moves. Set
 * it consistently across a list — the gutter is per row, and nothing in the
 * type can enforce that.
 */
export const Selected: Story = {
  render: () => (
    <List>
      <ListItem href="/a" selectedIcon="check" start={<Icon icon="star" />}>Installation</ListItem>
      <ListItem href="/b" selectedIcon="check" start={<Icon icon="gear" />} selected>Theming</ListItem>
      <ListItem href="/c" selectedIcon="check" start={<Icon icon="bell" />}>Tokens</ListItem>
    </List>
  ),
};

export const SelectedWithoutAnIcon: Story = {
  render: () => (
    <List>
      <ListItem href="/a" start={<Icon icon="star" />}>Installation</ListItem>
      <ListItem href="/b" start={<Icon icon="gear" />} selected>Theming</ListItem>
    </List>
  ),
};

/**
 * The ramp is padding, not height — so a taller `start` makes the row taller
 * rather than overflowing a fixed box. The last row shows it with an avatar
 * stand-in.
 */
export const Sizes: Story = {
  render: () => (
    <List>
      <ListItem href="/a" size="sm" start={<Icon icon="star" />}>Small</ListItem>
      <ListItem href="/b" size="md" start={<Icon icon="star" />}>Medium</ListItem>
      <ListItem href="/c" size="lg" start={<Icon icon="star" />}>Large</ListItem>
      <ListItem
        href="/d"
        start={
          <span style={{ width: '1.75rem', height: '1.75rem', borderRadius: '999px', background: 'currentColor', opacity: 0.15 }} />
        }
      >
        With an avatar
      </ListItem>
    </List>
  ),
};

export const AsAButton: Story = {
  render: () => (
    <List>
      <ListItem onClick={() => {}} start={<Icon icon="gear" />}>Opens a dialog</ListItem>
      <ListItem onClick={() => {}} start={<Icon icon="trash" />} disabled>Disabled</ListItem>
    </List>
  ),
};

/**
 * Outside a list, pass `as="div"`. A caller who does owns `aria-setsize` and
 * `aria-posinset` from then on — a real `li` in a `ul` gets position and count
 * computed by the browser, and a div chain does not.
 */
export const OutsideAList: Story = {
  render: () => (
    <Stack spacing="200" style={{ maxWidth: '18rem' }}>
      <Typography as="p" tone="muted" with="caption01">A settings row, not a nav list:</Typography>
      <ListItem as="div" start={<Icon icon="moon" />} end={<Token color="gray" size="sm">Auto</Token>}>
        Appearance
      </ListItem>
    </Stack>
  ),
};

export const Truncation: Story = {
  render: () => (
    <List>
      <ListItem href="/a" start={<Icon icon="star" />} end={<Token color="blue" size="sm">12</Token>}>
        A label long enough that it has to be cut off somewhere
      </ListItem>
    </List>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SideNav } from './sidenav';
import { SideNavSection } from '../sidenavsection';
import { ListItem } from '../listitem';
import { Icon } from '../icon';
import { IconButton } from '../iconbutton';
import { Input } from '../input';
import { Typography } from '../typography';

const meta = {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A sidebar navigation region. Renders a `<nav>` named by `aria-label`; `header` and `footer` are pinned and the middle scrolls. It has no width of its own — give it one with `style` or a parent grid column. Decided in `apps/docs/decisions/0014-sidebar-navigation.html`.',
      },
    },
  },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const docs = (
  <>
    <SideNavSection label="Getting started" collapsible defaultOpen>
      <ListItem href="/install" selectedIcon="check" start={<Icon icon="star" />}>Installation</ListItem>
      <ListItem href="/theming" selectedIcon="check" start={<Icon icon="moon" />} selected>Theming</ListItem>
    </SideNavSection>
    <SideNavSection label="Components" collapsible defaultOpen>
      <ListItem href="/button" selectedIcon="check" start={<Icon icon="gear" />}>Button</ListItem>
      <ListItem href="/combobox" selectedIcon="check" start={<Icon icon="list" />}>Combobox</ListItem>
      <ListItem href="/collapsible" selectedIcon="check" start={<Icon icon="minus" />}>Collapsible</ListItem>
    </SideNavSection>
    <SideNavSection label="Reference">
      <ListItem href="/tokens" selectedIcon="check" start={<Icon icon="info" />}>Tokens</ListItem>
    </SideNavSection>
  </>
);

export const Default: Story = {
  args: { 'aria-label': 'Documentation', children: docs },
  render: (args) => (
    <div style={{ height: '30rem', display: 'flex' }}>
      <SideNav {...args} style={{ width: '17rem' }} />
    </div>
  ),
};

export const WithHeaderAndFooter: Story = {
  args: {
    'aria-label': 'Documentation',
    children: docs,
    header: <Input size="sm" placeholder="Search the docs" aria-label="Search the docs" />,
    footer: (
      <ListItem
        as="div"
        size="sm"
        start={<Icon icon="user" />}
        end={<IconButton icon="gear" label="Account settings" size="sm" variant="ghost" />}
      >
        Nate Bridi
      </ListItem>
    ),
  },
  render: (args) => (
    <div style={{ height: '30rem', display: 'flex' }}>
      <SideNav {...args} style={{ width: '17rem' }} />
    </div>
  ),
};

/**
 * The middle scrolls while the header and footer stay put — the arrangement
 * Dialog uses. Shortened here so the overflow is visible.
 */
export const Scrolling: Story = {
  args: {
    'aria-label': 'Documentation',
    header: <Typography with="heading05">Jig</Typography>,
    footer: <Typography with="caption01" tone="muted">v0.1.0</Typography>,
    children: (
      <SideNavSection label="Components">
        {Array.from({ length: 20 }, (_, i) => (
          <ListItem key={i} href={`/c/${i}`} selectedIcon="check" selected={i === 3}>
            Component {i + 1}
          </ListItem>
        ))}
      </SideNavSection>
    ),
  },
  render: (args) => (
    <div style={{ height: '22rem', display: 'flex' }}>
      <SideNav {...args} style={{ width: '17rem' }} />
    </div>
  ),
};

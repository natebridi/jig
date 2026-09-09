import type { Meta, StoryObj } from '@storybook/react-vite';
import { SideNavSection } from './sidenavsection';
import { ListItem } from '../listitem';
import { Icon } from '../icon';
import { Stack } from '../stack';

const meta = {
  title: 'Components/Navigation/SideNavSection',
  component: SideNavSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A labelled group of rows. Wraps them in a `<ul role="list">` — the role as well as the element, because WebKit drops list semantics from a `ul` styled with `list-style: none`. With `collapsible` the label becomes a `Collapsible` trigger. Decided in `apps/docs/decisions/0014-sidebar-navigation.html`.',
      },
    },
  },
} satisfies Meta<typeof SideNavSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = (
  <>
    <ListItem href="/docs/button" start={<Icon icon="star" />} selectedIcon="check">Button</ListItem>
    <ListItem href="/docs/combobox" start={<Icon icon="gear" />} selectedIcon="check" selected>Combobox</ListItem>
    <ListItem href="/docs/token" start={<Icon icon="bell" />} selectedIcon="check">Token</ListItem>
  </>
);

export const Default: Story = {
  args: { label: 'Components', children: rows },
  render: (args) => <div style={{ maxWidth: '17rem' }}><SideNavSection {...args} /></div>,
};

export const Collapsing: Story = {
  args: { label: 'Components', collapsible: true, defaultOpen: true, children: rows },
  render: (args) => <div style={{ maxWidth: '17rem' }}><SideNavSection {...args} /></div>,
};

/**
 * A section with no label is a bare list — which is how a run of ungrouped
 * rows still gets its list semantics rather than sitting loose in the nav.
 */
export const Unlabelled: Story = {
  args: { children: rows },
  render: (args) => <div style={{ maxWidth: '17rem' }}><SideNavSection {...args} /></div>,
};

export const SeveralSections: Story = {
  args: { children: rows },
  render: () => (
    <Stack spacing="400" style={{ maxWidth: '17rem' }}>
      <SideNavSection label="Getting started" collapsible defaultOpen>
        <ListItem href="/a" selectedIcon="check">Installation</ListItem>
        <ListItem href="/b" selectedIcon="check" selected>Theming</ListItem>
      </SideNavSection>
      <SideNavSection label="Components" collapsible>
        <ListItem href="/c" selectedIcon="check">Button</ListItem>
        <ListItem href="/d" selectedIcon="check">Combobox</ListItem>
      </SideNavSection>
      <SideNavSection label="Reference">
        <ListItem href="/e" selectedIcon="check">Tokens</ListItem>
      </SideNavSection>
    </Stack>
  ),
};

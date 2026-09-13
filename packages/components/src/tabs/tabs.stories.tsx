import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from './tabs';
import { Icon } from '../icon';
import { Token } from '../token';
import { Stack } from '../stack';
import { Typography } from '../typography';
import { Button } from '../button';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A set of tabs and their panels, in four parts: `Tabs`, `TabList`, `Tab`, `TabPanel`. `Tabs` draws nothing — it is a behavioural wrapper, so anything you put in it that is not a list or a panel renders where you wrote it. Activation is manual (arrow keys move focus, Enter or Space selects) and focus loops at the ends. Decided in `apps/docs/decisions/0019-tabs.html`.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="usage">
      <TabList aria-label="Component documentation">
        <Tab value="usage">Usage</Tab>
        <Tab value="props">Props</Tab>
        <Tab value="changelog">Changelog</Tab>
      </TabList>

      <TabPanel value="usage">
        <Typography with="body01">Import the component and give each tab a value.</Typography>
      </TabPanel>
      <TabPanel value="props">
        <Typography with="body01">Every prop, and what it defaults to.</Typography>
      </TabPanel>
      <TabPanel value="changelog">
        <Typography with="body01">What changed, most recent first.</Typography>
      </TabPanel>
    </Tabs>
  ),
};

/**
 * `start` and `end` take an icon, a `Token`, a count — anything that is not
 * interactive. Both render inside the tab's own button, so a control in either
 * would be a button inside a button (0019 D3). Icons are sized by the tab.
 */
export const Slots: Story = {
  render: () => (
    <Tabs defaultValue="alerts">
      <TabList aria-label="Inbox">
        <Tab value="team" start={<Icon icon="user" />}>Team</Tab>
        <Tab value="alerts" start={<Icon icon="bell" />} end={<Token color="blue">12</Token>}>
          Alerts
        </Tab>
        <Tab value="archive" start={<Icon icon="trash" />} disabled>Archive</Tab>
      </TabList>

      <TabPanel value="team">
        <Typography with="body01">Who is on the team.</Typography>
      </TabPanel>
      <TabPanel value="alerts">
        <Typography with="body01">Twelve alerts you have not read.</Typography>
      </TabPanel>
      <TabPanel value="archive">
        <Typography with="body01">Nothing here.</Typography>
      </TabPanel>
    </Tabs>
  ),
};

/**
 * More tabs than fit scroll on one line rather than wrapping (0019 D4), so the
 * strip keeps one height and nothing below it moves as tabs are added. Resize
 * the frame to see it.
 */
export const Overflow: Story = {
  render: () => (
    <div style={{ maxWidth: '22rem' }}>
      <Tabs defaultValue="overview">
        <TabList aria-label="Sections">
          {[
            ['overview', 'Overview'],
            ['tokens', 'Tokens'],
            ['changelog', 'Changelog'],
            ['usage', 'Usage'],
            ['testing', 'Testing'],
            ['themes', 'Themes'],
            ['support', 'Support'],
          ].map(([value, label]) => (
            <Tab key={value} value={value as string}>
              {label}
            </Tab>
          ))}
        </TabList>

        <TabPanel value="overview">
          <Typography with="body01">The strip scrolls; this panel does not move.</Typography>
        </TabPanel>
      </Tabs>
    </div>
  ),
};

/** Arrow keys move along the column, and the indicator runs down the edge. */
export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="usage" orientation="vertical">
      <Stack direction="row" spacing="500">
        <TabList aria-label="Component documentation">
          <Tab value="usage">Usage</Tab>
          <Tab value="props">Props</Tab>
          <Tab value="changelog">Changelog</Tab>
        </TabList>

        <TabPanel value="usage">
          <Typography with="body01">Import the component and give each tab a value.</Typography>
        </TabPanel>
        <TabPanel value="props">
          <Typography with="body01">Every prop, and what it defaults to.</Typography>
        </TabPanel>
        <TabPanel value="changelog">
          <Typography with="body01">What changed, most recent first.</Typography>
        </TabPanel>
      </Stack>
    </Tabs>
  ),
};

/**
 * `Tabs` contributes no layout of its own, which is what lets a button sit
 * beside the strip and a message sit above the panels. Both are plain children
 * of the root (0019 D1).
 */
export const AlongsideOtherContent: Story = {
  render: () => (
    <Tabs defaultValue="usage">
      <Stack direction="row" spacing="400" align="end">
        <TabList aria-label="Component documentation">
          <Tab value="usage">Usage</Tab>
          <Tab value="props">Props</Tab>
        </TabList>
        <Button variant="ghost" size="sm" icon="plus">New</Button>
      </Stack>

      <Typography with="caption02" tone="muted">Draft — not published yet.</Typography>

      <TabPanel value="usage">
        <Typography with="body01">Import the component and give each tab a value.</Typography>
      </TabPanel>
      <TabPanel value="props">
        <Typography with="body01">Every prop, and what it defaults to.</Typography>
      </TabPanel>
    </Tabs>
  ),
};

/** Controlled, so the owner decides what the tabs do. */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('usage');
    return (
      <Stack spacing="500">
        <Typography with="caption02" tone="muted">Showing: {value}</Typography>
        <Tabs value={value} onValueChange={(next) => next && setValue(next)}>
          <TabList aria-label="Component documentation">
            <Tab value="usage">Usage</Tab>
            <Tab value="props">Props</Tab>
          </TabList>

          <TabPanel value="usage">
            <Typography with="body01">Import the component and give each tab a value.</Typography>
          </TabPanel>
          <TabPanel value="props">
            <Typography with="body01">Every prop, and what it defaults to.</Typography>
          </TabPanel>
        </Tabs>
      </Stack>
    );
  },
};

import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tab, TabList, TabPanel, Tabs } from './tabs';
import { Icon } from '../icon';

/**
 * What is worth asserting is the tab contract — the roles and pairing a screen
 * reader hears, the single tab stop, manual activation, and the two slot rules
 * 0019 D3 settled. The indicator's geometry is not tested: it is Base UI's
 * measurement, and jsdom has no layout to measure.
 */
const Basic = ({ onValueChange = () => {} }: { onValueChange?: (v: string | null) => void }) => (
  <Tabs defaultValue="usage" onValueChange={onValueChange}>
    <TabList aria-label="Component docs">
      <Tab value="usage">Usage</Tab>
      <Tab value="props">Props</Tab>
      <Tab value="api" disabled>API</Tab>
    </TabList>

    <TabPanel value="usage">How to use it</TabPanel>
    <TabPanel value="props">Every prop</TabPanel>
    <TabPanel value="api">The API</TabPanel>
  </Tabs>
);

describe('Tabs', () => {
  it('pairs each tab with its panel and names the strip', () => {
    render(<Basic />);

    expect(screen.getByRole('tablist', { name: 'Component docs' })).toBeInTheDocument();

    const usage = screen.getByRole('tab', { name: 'Usage' });
    expect(usage).toHaveAttribute('aria-selected', 'true');

    const shown = screen.getByRole('tabpanel');
    expect(shown).toHaveTextContent('How to use it');
    expect(usage).toHaveAttribute('aria-controls', shown.id);
    expect(shown).toHaveAttribute('aria-labelledby', usage.id);
  });

  it('unmounts the hidden panels', () => {
    // `keepMounted` stays unexposed at Base UI's default (0019, settled), so
    // a panel's content is gone rather than hidden.
    render(<Basic />);

    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.queryByText('Every prop')).not.toBeInTheDocument();
  });

  it('keeps one tab stop and moves focus with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Props' })).toHaveFocus();

    // The roving tabindex is the single tab stop: tabbing again leaves the
    // strip rather than walking to the next tab.
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Props' })).not.toHaveFocus();
  });

  it('activates on press, not on focus', async () => {
    // `activateOnFocus` is fixed at Base UI's default, false (0019, settled).
    const user = userEvent.setup();
    render(<Basic />);

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Props' })).toHaveAttribute('aria-selected', 'false');

    await user.keyboard('{Enter}');
    expect(screen.getByRole('tab', { name: 'Props' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Every prop');
  });

  it('loops focus at the ends, disabled tabs included', async () => {
    // `loopFocus` is fixed at Base UI's default, true (0019, settled). This
    // diverges from ToggleButtonGroup, which exposes it.
    const user = userEvent.setup();
    render(<Basic />);

    await user.tab();
    await user.keyboard('{ArrowLeft}');
    // Backwards from the first tab wraps to the last one — and a disabled tab
    // is focusable, which is the composite-widget convention rather than an
    // oversight: skipping it would hide from a keyboard user that it exists.
    // It still cannot be activated; see the test below.
    expect(screen.getByRole('tab', { name: 'API' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveFocus();
  });

  it('reports the new value without Base UI event details', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);

    await user.click(screen.getByRole('tab', { name: 'Props' }));
    expect(onValueChange).toHaveBeenCalledWith('props');
  });

  it('stays put when controlled and the owner does not move it', async () => {
    const user = userEvent.setup();
    render(
      <Tabs value="usage">
        <TabList aria-label="Docs">
          <Tab value="usage">Usage</Tab>
          <Tab value="props">Props</Tab>
        </TabList>
        <TabPanel value="usage">How to use it</TabPanel>
        <TabPanel value="props">Every prop</TabPanel>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Props' }));
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveAttribute('aria-selected', 'true');
  });

  it('follows a controlled owner that does move it', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState<'usage' | 'props'>('usage');
      return (
        <Tabs value={value} onValueChange={(next) => next && setValue(next as 'usage' | 'props')}>
          <TabList aria-label="Docs">
            <Tab value="usage">Usage</Tab>
            <Tab value="props">Props</Tab>
          </TabList>
          <TabPanel value="usage">How to use it</TabPanel>
          <TabPanel value="props">Every prop</TabPanel>
        </Tabs>
      );
    };
    render(<Controlled />);

    await user.click(screen.getByRole('tab', { name: 'Props' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Every prop');
  });

  it('leaves a disabled tab unselectable', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(screen.getByRole('tab', { name: 'API' }));
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders the start and end slots inside the tab button', () => {
    // 0019 D3: both slots are inside the button, which is why neither may hold
    // anything interactive. Asserting the containment is asserting the reason.
    render(
      <Tabs defaultValue="alerts">
        <TabList aria-label="Docs">
          <Tab value="alerts" start={<Icon icon="bell" />} end={<span>12</span>}>
            Alerts
          </Tab>
        </TabList>
        <TabPanel value="alerts">Nothing new</TabPanel>
      </Tabs>,
    );

    // `end` joins the accessible name, separated — see the note in tabs.tsx.
    const button = screen.getByRole('tab', { name: 'Alerts 12' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveTextContent('12');
    expect(button.querySelector('svg')).not.toBeNull();
  });

  it('adds nothing of its own to the root', () => {
    // 0019 D1's outcome: Tabs is a behavioural wrapper with no styling, and
    // children that are neither a list nor a panel render where they are
    // written.
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="usage" ref={ref}>
        <TabList aria-label="Docs">
          <Tab value="usage">Usage</Tab>
        </TabList>
        <p>A persistent message</p>
        <TabPanel value="usage">How to use it</TabPanel>
      </Tabs>,
    );

    expect(ref.current?.className).toBe('');
    expect(screen.getByText('A persistent message')).toBeInTheDocument();
  });

  it('resolves refs to the rendered elements', () => {
    const listRef = createRef<HTMLDivElement>();
    const tabRef = createRef<HTMLButtonElement>();
    const panelRef = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="usage">
        <TabList ref={listRef} aria-label="Docs">
          <Tab ref={tabRef} value="usage">Usage</Tab>
        </TabList>
        <TabPanel ref={panelRef} value="usage">How to use it</TabPanel>
      </Tabs>,
    );

    expect(listRef.current?.tagName).toBe('DIV');
    expect(tabRef.current?.tagName).toBe('BUTTON');
    expect(panelRef.current?.tagName).toBe('DIV');
  });
});

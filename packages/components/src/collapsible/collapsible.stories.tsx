import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Collapsible } from './collapsible';
import { Stack } from '../stack';
import { Typography } from '../typography';
import { Separator } from '../separator';
import { Button } from '../button';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  args: {
    label: 'Shipping and returns',
    children: 'Orders ship within two business days. Returns are free within thirty days.',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A button that shows and hides a panel below it. `with` sets the trigger\'s type from the Typography presets; the indicator swaps `plus` for `minus` rather than rotating. A closed panel is not in the DOM, so pass `hiddenUntilFound` for content a reader would expect to search for. Decided in `apps/docs/decisions/0013-collapsible.html`.',
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OpenToStart: Story = {
  args: { defaultOpen: true },
};

/**
 * `with` names a Typography preset, so the trigger can be body copy, a section
 * heading, or a caption without changing anything else about the control.
 */
export const TypeStyles: Story = {
  render: (args) => (
    <Stack spacing="500">
      <Collapsible {...args} with="body01" label="body01 — the default" />
      <Collapsible {...args} with="heading05" label="heading05 — a section" />
      <Collapsible {...args} with="caption01" label="caption01 — an aside" />
    </Stack>
  ),
};

/**
 * The FAQ shape. `Separator` draws the rules rather than the Collapsible —
 * 0013 D1 kept dividers out of the component so a single collapsible in a form
 * does not inherit one.
 */
export const AsAnFAQ: Story = {
  render: () => (
    <Stack spacing="400">
      <Typography as="h2" with="heading04">Frequently asked</Typography>
      <Separator />
      <Collapsible label="How long does delivery take?" with="heading05" hiddenUntilFound>
        <Typography as="p" tone="muted">
          Two business days to mainland addresses, three to the islands.
        </Typography>
      </Collapsible>
      <Separator />
      <Collapsible label="Can I return an opened item?" with="heading05" hiddenUntilFound>
        <Typography as="p" tone="muted">
          Yes, within thirty days, as long as the original packaging comes back with it.
        </Typography>
      </Collapsible>
      <Separator />
      <Collapsible label="Do you ship internationally?" with="heading05" hiddenUntilFound>
        <Typography as="p" tone="muted">
          To fourteen countries. Duties are calculated at checkout.
        </Typography>
      </Collapsible>
      <Separator />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Every panel here passes `hiddenUntilFound`, which is the case it exists for: a reader pressing Ctrl-F on a support page expects the words on it to be findable. Without it a closed panel is not in the document at all.',
      },
    },
  },
};

export const NoIndicator: Story = {
  args: { indicator: false },
  parameters: {
    docs: {
      description: {
        story:
          'For a trigger that already reads as one. There is no way to substitute a different glyph — the indicator is the component\'s, like every other icon Jig places.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * `onOpenChange` fires before the change is applied, so `details.cancel()`
 * vetoes it. This is what the details object is for (0013 D5) — try closing
 * the panel while the box is ticked.
 */
export const VetoingAClose: Story = {
  render: (args) => {
    const [dirty, setDirty] = useState(true);
    return (
      <Stack spacing="500">
        <Typography as="label" with="body01">
          <input type="checkbox" checked={dirty} onChange={(e) => setDirty(e.target.checked)} />{' '}
          Pretend the form below has unsaved changes
        </Typography>
        <Collapsible
          {...args}
          label="Delivery address"
          defaultOpen
          onOpenChange={(open, details) => {
            if (!open && dirty) details.cancel();
          }}
        >
          <Typography as="p" tone="muted">
            While the box above is ticked, this panel refuses to collapse.
          </Typography>
        </Collapsible>
      </Stack>
    );
  },
};

/**
 * Pass `open` and `onOpenChange` to drive it from elsewhere — a route, a form,
 * or another control.
 */
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Stack spacing="500" align="start">
        <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? 'Collapse from outside' : 'Expand from outside'}
        </Button>
        <Collapsible {...args} open={open} onOpenChange={setOpen} />
      </Stack>
    );
  },
};

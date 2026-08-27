import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dialog } from './dialog';
import { Button } from '../button';
import { Stack } from '../stack';
import { Typography } from '../typography';

const terms = [
  'These terms govern your use of the service, and replace any version you agreed to before today.',
  'Content you create remains yours. You grant only the licence needed to store it, display it back to you, and share it with people you choose.',
  'The service is provided as it is. Where the law allows, there is no warranty beyond that.',
  'We may change these terms. Material changes are announced before they take effect, and continuing to use the service is how you accept them.',
  'Either party may end the agreement at any time. Your data stays exportable for thirty days afterwards.',
];

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="danger">Delete recipe</Button>}
      title="Discard changes?"
      description="Your edits to this recipe will be lost."
      size="sm"
      actions={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Discard</Button>
        </>
      }
    >
      Sixteen ingredients and two substitutions will be lost.
    </Dialog>
  ),
};

export const Scrolling: Story = {
  render: () => (
    <Dialog
      trigger={<Button>Read the terms</Button>}
      title="Terms of service"
      description="Updated 24 August 2026."
      actions={
        <>
          <Button variant="secondary">Decline</Button>
          <Button>Accept</Button>
        </>
      }
    >
      <Stack spacing="300">
        {terms.concat(terms).map((line, i) => (
          <Typography key={i} as="p" with="body01">{line}</Typography>
        ))}
      </Stack>
    </Dialog>
  ),
  parameters: {
    docs: { description: { story: 'The title and the actions stay put while the body moves, so the affirmative action is never below the fold. The body is a `ScrollArea`, so its mask marks the crop and its scrollbar appears on hover, focus or scroll.' } },
  },
};

export const NoFrame: Story = {
  render: () => (
    <Dialog trigger={<Button variant="secondary">Preview</Button>} aria-label="Preview" closePlacement="outside">
      <div style={{ aspectRatio: '4 / 3', background: 'linear-gradient(135deg, #1563de, #ab12b6)', borderRadius: 4 }} />
    </Dialog>
  ),
  parameters: {
    docs: { description: { story: 'Every frame prop is optional. With no title, description or actions the dialog is a plain panel around its children — and `closePlacement="outside"` lifts the close button onto the scrim so the content reaches the frame’s own edges. `aria-label` supplies the accessible name that `title` would otherwise have given.' } },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing="300">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dialog
          key={size}
          trigger={<Button variant="secondary">{size}</Button>}
          title={`A ${size} dialog`}
          description="22rem, 30rem and 42rem, each capped to the viewport less its margin."
          size={size}
          actions={<Button>Done</Button>}
        >
          Width is a named ramp rather than a per-call-site decision. See apps/docs/decisions/0008-dialog.html (D4).
        </Dialog>
      ))}
    </Stack>
  ),
};

export const Controlled: Story = {
  render: function Controlled() {
    const [open, setOpen] = useState(false);

    return (
      <Stack spacing="300" align="start">
        <Button onClick={() => setOpen(true)}>Open from state</Button>
        <Typography with="caption01">open: {String(open)}</Typography>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Controlled"
          description="The trigger need not be adjacent — routing or form state can drive this."
          actions={<Button onClick={() => setOpen(false)}>Close</Button>}
        >
          Escape, the close button and an outside press all report through `onOpenChange`.
        </Dialog>
      </Stack>
    );
  },
};

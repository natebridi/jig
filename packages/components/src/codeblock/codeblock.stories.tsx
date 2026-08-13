import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, userEvent, within } from 'storybook/test';
import { CodeBlock } from './codeblock';

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  // `label` is set per-story rather than here: exactOptionalPropertyTypes
  // rejects passing `label: undefined` to switch it back off.
  args: {
    children: `
      import { Button } from '@jig-ui/react';

      export function Example() {
        return <Button variant="primary">Click me</Button>;
      }
    `,
  },
  parameters: {
    docs: { description: { component: 'Indentation the snippet picks up from the JSX around it is stripped, while relative indentation is kept.' } },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'app.tsx' } };

export const WithoutLabel: Story = {
  args: { children: `pnpm add @jig-ui/react` },
};

export const LongLine: Story = {
  args: {
    label: 'a-very-long-line.sh',
    children: `echo "this single line is far too wide for the block, so the code area scrolls horizontally instead of wrapping or spilling out of the card"`,
  },
  parameters: {
    docs: { description: { story: 'The code area scrolls on its own; the block never grows past its container. The scroll container is focusable so the overflow is reachable by keyboard.' } },
  },
};

export const CopiesToClipboard: Story = {
  args: { label: 'app.tsx' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The preview iframe never takes real document focus from a synthetic
    // click, and writeText rejects on an unfocused document. Stubbing it keeps
    // the assertion on our own behaviour rather than on the browser's
    // clipboard: the dedented source goes out, and the label acknowledges it.
    const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));

    await expect(writeText).toHaveBeenCalledTimes(1);
    const copied = writeText.mock.calls[0]?.[0] as string;
    // Dedented: the snippet's JSX indentation is gone, its own is kept.
    await expect(copied.startsWith("import { Button }")).toBe(true);
    await expect(copied).toContain('\n  return <Button');

    // findByRole polls; an instrumented expect inside waitFor would not.
    await canvas.findByRole('button', { name: 'Copied' });
  },
};

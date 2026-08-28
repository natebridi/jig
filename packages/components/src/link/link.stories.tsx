import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './link';
import { Stack } from '../stack';
import { Typography } from '../typography';
import { role } from './link.stories.css';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: { href: '#', children: 'View the build log' },
  parameters: {
    docs: {
      description: {
        component:
          'Navigation, at any of six weights. `text` is the ordinary link in a sentence; the other five are Button’s variants, so a call to action can look like a button while still being an anchor — announced as a link, activated on Enter, middle-clickable. Decided in `apps/docs/decisions/0009-link.html`.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InProse: Story = {
  render: (args) => (
    <Typography as="p" with="body01" style={{ maxWidth: '38ch' }}>
      The build finished in 42 seconds. <Link {...args}>View the log</Link> for the full
      output, or <Link {...args}>re-run it</Link> against the previous commit.
    </Typography>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The text variant declares no colour, family, size or weight of its own — it takes them from whatever encloses it. A link inside a heading is heading-sized without being told.',
      },
    },
  },
};

export const InheritsItsType: Story = {
  render: (args) => (
    <Stack direction="column" spacing="400">
      <Typography as="h3" with="heading03">
        A heading with <Link {...args}>a link</Link> in it
      </Typography>
      <Typography as="p" with="body01">
        Body copy with <Link {...args}>a link</Link> in it
      </Typography>
      <Typography as="p" with="caption01">
        A caption with <Link {...args}>a link</Link> in it
      </Typography>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'One component, three sizes, no `size` prop involved. This is what `variant="text"` inheriting rather than declaring buys.',
      },
    },
  },
};

export const WithPreset: Story = {
  args: { with: 'caption01', children: 'What’s new' },
  parameters: {
    docs: {
      description: {
        story:
          'For a standalone link with no typographic parent to inherit from, `with` names a Typography preset. Passed explicitly, it beats the inherited type.',
      },
    },
  },
};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <Link {...args} variant="text">Text</Link>
      <Link {...args} variant="primary">Primary</Link>
      <Link {...args} variant="secondary">Secondary</Link>
      <Link {...args} variant="danger">Danger</Link>
      <Link {...args} variant="ghost">Ghost</Link>
      <Link {...args} variant="smoke">Smoke</Link>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The five box variants wear Button’s recipe, so they track it — `smoke` arrived there and appeared here without being added.',
      },
    },
  },
};

export const Underline: Story = {
  render: (args) => (
    <Stack direction="column" spacing="400">
      <Typography as="p" with="body01" style={{ maxWidth: '42ch' }}>
        Underlined by default, because with an inherited colour the underline is the only
        thing distinguishing <Link {...args}>this link</Link> from the words around it.
      </Typography>
      <Stack direction="row" spacing="400">
        <Link {...args} underline={false}>Docs</Link>
        <Link {...args} underline={false}>Changelog</Link>
        <Link {...args} underline={false}>Status</Link>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`underline={false}` means never — there is no hover underline behind it. It is for somewhere the link is already obviously a link, such as the nav row above; in running text it leaves a link with no visual distinction at all.',
      },
    },
  },
};

export const External: Story = {
  // `external` and `iconPosition` are the discriminants of LinkProps' union,
  // so they are destructured out rather than spread — see the note in the
  // decision doc's As built.
  render: ({ external: _external, iconPosition: _iconPosition, ...args }) => (
    <Stack direction="column" spacing="400">
      <Typography as="p" with="body01">
        Built on <Link {...args} href="https://base-ui.com" external>Base UI</Link>, and
        released under MIT.
      </Typography>
      <Link {...args} href="https://base-ui.com" external variant="secondary">
        Read the docs
      </Link>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`external` is the whole convention in one prop: the glyph, `target="_blank"`, `rel="noopener noreferrer"`, and a visually hidden “(opens in a new tab)” so the announcement matches the behaviour. The marker is sized to the label rather than to the button icon size, so it sits in running text without towering over it.',
      },
    },
  },
};

export const HoverByRole: Story = {
  render: ({ external: _external, iconPosition: _iconPosition, ...args }) => (
    <Stack direction="column" spacing="400">
      {(['primary', 'secondary', 'muted', 'danger'] as const).map((r) => (
        <Typography key={r} as="p" with="body01" className={role[r]}>
          {r.charAt(0).toUpperCase() + r.slice(1)} text, with <Link {...args}>a link in it</Link> to hover.
        </Typography>
      ))}
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A text link inherits its resting colour, so its hover has to vary with what it inherited — a muted link brightening to the same ink as a primary one would read as a different link. Whatever sets the colour sets the hover pair beside it, through `linkHoverFor`. Hover each of these: every one moves *away* from the surface, so the hovered state never has less contrast than the resting one.',
      },
    },
  },
};

export const WithIcon: Story = {
  render: ({ external: _external, iconPosition: _iconPosition, ...args }) => (
    <Stack direction="row" spacing="300" align="center">
      <Link {...args} variant="primary" icon="arrow-right" iconPosition="end">
        Open dashboard
      </Link>
      <Link {...args} icon="arrow-right" iconPosition="end">Continue</Link>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" spacing="300" align="center">
      <Link {...args} variant="secondary" size="sm">Small</Link>
      <Link {...args} variant="secondary" size="md">Medium</Link>
      <Link {...args} variant="secondary" size="lg">Large</Link>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '`size` drives the box variants only. On `variant="text"` it does nothing — that type comes from the parent, or from `with`.',
      },
    },
  },
};

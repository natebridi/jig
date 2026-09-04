import '@jig-ui/react/styles.css'
import { Button, IconButton, Icon, Typography, Adorn, Stack, Box, Grid, Tooltip, CodeBlock, ToggleButton, ToggleButtonGroup, Input, Slider, Token, ScrollArea, Dialog, Collapsible, ListItem, SideNav, SideNavSection, Link, Combobox, Separator } from '@jig-ui/react'
import { color, elevation, spacing } from '@jig-ui/react/tokens'
import './debug.css'

const Item = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      backgroundColor: color.surfaces.card,
      padding: '16px',
      borderRadius: '4px',
      textAlign: 'center',
    }}
  >
    {children}
  </div>
);

export function App() {

  return (
    <div
        style={{
          minHeight: '100vh',
          backgroundColor: color.surfaces.body,
        }}
      >
      <div className="style-debug">
        <div id='debug-mode' />
        <div id='debug-size' />
      </div>

      <Stack px="500" py="800" spacing="800" align="stretch" style={{ maxWidth: '74rem', marginInline: 'auto' }}>

        <Grid columns={24}>
          <Box span={{ xs: 24, md: 8 }} alignSelf='center' mb="600">
            <Typography as="h1" with="display01" mb="300">Guilloche</Typography>
            <Typography as="p" with="display05" pl="300" balance>Shader for patterns etched in metal</Typography>
          </Box>
          <Stack spacing="500" py="600" align="center" span={{ xs: 24, md: 16 }}>
            <Box style={{ aspectRatio: '5/3', width: '30rem', backgroundColor: color.surfaces.inverse }} />
            <ToggleButtonGroup>
              <ToggleButton value="style1" pressedIcon='eye'>Golden sun</ToggleButton>
              <ToggleButton value="style2" pressedIcon='eye'>Silver burst</ToggleButton>
              <ToggleButton value="style3" pressedIcon='eye'>Ocean drop</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Grid>

        <Stack direction="row" align="center" justify="center">
          <Typography with="body02">Build your guilloché <Icon icon="arrow-right" /></Typography>
        </Stack>

        <Grid>
          <Stack span={{ xs: 24, sm: 8 }} alignSelf="center" spacing="400" mb={{ xs: '500', sm: '100' }}>
            <Typography with="heading05"><Icon icon="check-circle" color={color.yellow[400]} /> Drop-in ready</Typography>
            <Typography with="body01">Simple script import and a custom web component, no dependencies</Typography>
          </Stack>
          <Box span={{ xs: 24, sm: 16 }}>
            <CodeBlock label="javascript">
              {`const thing = 1;
// here is some code;`}
            </CodeBlock>
          </Box>
        </Grid>

        <Stack spacing="600" align="stretch">
          <Input label="Title" size="lg" />

          {/* Equal children, so `columns` distributes and collapsing is one prop. */}
          <Grid columns={{ xs: 1, sm: 3 }} spacing="300">
            <Input label="Servings" />
            <Input label="Total time" />
            <Input label="Active time" />
          </Grid>

          <Stack align="stretch">
            {/* Content-width trailing control, so this is a Stack rather than a Grid. */}
            <Stack direction="row" spacing="300" align="end">
              <Box grow>
                <Input label="Step" />
              </Box>
              <IconButton icon="trash" label="Remove step" size="md" />
            </Stack>
            {/* Stack's align default is `start`, but this column is stretched — so
                the button opts back out for itself rather than the row changing. */}
            <Box alignSelf="start">
              <Button icon="plus" variant="ghost" size="sm">Add step</Button>
            </Box>
          </Stack>

          <Stack align="stretch">
            {[0, 1].map((row) => (
              <Stack key={row} direction="row" spacing="300" align="end">
                <Box grow>
                  {/* Uneven spans, so each child carries its own breakpoint.
                      3 + 3 + 9 + 9 = 24. */}
                  <Grid spacing="300">
                    <Box span={{ xs: 24, md: 9 }}><Combobox label="Measure" size="md" popupMinWidth={160} items={
                      [
                        {
                          label: 'Liquid', items: [
                            { value: 'tsp', label: 'tsp' },
                            { value: 'tbsp', label: 'Tbsp' },
                            { value: 'clove', label: 'Clove' },
                            { value: 'sprig', label: 'Sprig' },
                            { value: 'oz', label: 'Oz' },
                          ]
                        },
                        {
                          label: 'Dry', items: [
                            { value: 'os', label: 'Oz (Imperial)' },
                            { value: 'cup', label: 'Cup' },
                            { value: 'bun', label: 'Bundle' },
                            { value: 'gal', label: 'Gallon (Standard)' },
                          ]
                        }
                      ]} />
                    </Box>
                    <Box span={{ xs: 24, md: 3 }}><Input size="md" label="Quantity" /></Box>
                    <Box span={{ xs: 24, md: 3 }}><Input label="Ingredient" /></Box>
                    <Box span={{ xs: 24, md: 9 }}><Input label="Preparation" /></Box>
                  </Grid>
                </Box>
                <IconButton icon="trash" label="Remove ingredient" size="md" />
              </Stack>
            ))}
            <Box alignSelf="start">
              <Button icon="plus" variant="ghost" size="sm">Add ingredient</Button>
            </Box>
          </Stack>

          <Grid spacing="300">
            <Box span={{ xs: 24, md: 12 }}>
              <Slider label="Sweetness" description="Adjusts the sugar in the final mix." steppers />
            </Box>
            <Box span={{ xs: 24, md: 12 }}>
              <Slider label="Spice" min={0} max={1} step={.01} defaultValue={0.5} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
            </Box>
          </Grid>

          <Grid spacing="300">
            <Box span={{ xs: 24, md: 6 }}><Input label="Source" /></Box>
            <Box span={{ xs: 24, md: 18 }}><Input label="Source URL" /></Box>
          </Grid>

          {/* Every layout primitive is also a layout child: a Grid nested in a
              Grid claims a span of the outer one, and a Stack inside a Stack
              grows, with no Box in between to carry the number. */}
          <Grid spacing="300">
            <Grid span={{ xs: 24, md: 16 }} columns={2} spacing="300" data-testid="grid-span-16">
              <Input label="Nested A" />
              <Input label="Nested B" />
            </Grid>
            <Stack span={{ xs: 24, md: 8 }} direction="row" spacing="200" align="stretch" data-testid="stack-grow-row">
              <Input label="Grows" style={{ flexGrow: 1 }} />
            </Stack>
          </Grid>

          {/* A Stack spanning directly, with no Box around it to carry the number. */}
          <Grid spacing="300">
            <Stack span={{ xs: 24, md: 16 }} spacing="200" align="stretch" data-testid="stack-span-16">
              <Input label="Notes" />
              <Input label="More notes" />
            </Stack>
            <Stack span={{ xs: 24, md: 8 }} spacing="200" align="stretch" data-testid="stack-span-8">
              <Input label="Yield" />
              <Input label="Time" />
            </Stack>
          </Grid>
        </Stack>


        <Stack spacing="400">
          <Typography as="h2" with="heading04">Buttons</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing="400">
            <Button variant="primary" icon="warning">Primary</Button>
            <Button variant="primary">Primary</Button>
            <IconButton variant="primary" label="Trash" icon="trash" />
            <Separator orientation="vertical" />
            <IconButton variant="ghost" label="Trash" icon="trash" />
            <Separator orientation="vertical" />
            <ToggleButton isIconOnly icon="heart" label="Trash" />
            <Button variant="primary" disabled>Disabled</Button>
            <Separator orientation="vertical" />
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost" icon="calendar" size="sm">Ghost</Button>
          </Stack>
        </Stack>

        <Stack spacing="400">
          <Typography as="h2" with="heading04">Elevation</Typography>
          <Stack direction="row" spacing="400">
            <Box style={{ width: '5rem', height: '5rem', boxShadow: elevation.lo, backgroundColor: color.surfaces.card }} />
            <Box style={{ width: '5rem', height: '5rem', boxShadow: elevation.med, backgroundColor: color.surfaces.card }} />
            <Box style={{ width: '5rem', height: '5rem', boxShadow: elevation.hi, backgroundColor: color.surfaces.card }} />
          </Stack>
        </Stack>

        <Stack spacing="400">
          <Typography as="h2" with="heading04">Tooltips</Typography>
          <Stack spacing="400">
            <Stack direction="row" spacing="500" align="center">
              {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                <Tooltip key={side} content={`Placed on the ${side}`} placement={side}>
                  <Button variant="secondary">{side}</Button>
                </Tooltip>
              ))}
            </Stack>
            <Stack direction="row" spacing="500" align="center">
              <Tooltip content="Long descriptions wrap at a readable measure rather than running off the edge of the viewport.">
                <Button variant="primary">Long content</Button>
              </Tooltip>

              <Separator orientation="vertical" />

              <Tooltip content="Any focusable element can be a trigger." placement="bottom">
                <span tabIndex={0} style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                  a plain span
                </span>
              </Tooltip>

              <Tooltip content="Opens immediately." delay={0}>
                <Button variant="secondary" size="sm">No delay</Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>

        <Separator />

        <Stack spacing="400">
          <Typography as="h2" with="heading04">Links</Typography>
          <Typography as="p" with="body01">Here is some flowing body text with a <Link href="#">link</Link> in it. <Adorn with="muted">Muted text with a <Link href="#">link</Link> in it.</Adorn></Typography>
          <Link underline={false} href="#" with="heading05">Standalone link</Link>
          <Link underline={false} external href="#" with="body01">External link</Link>
          <Link variant="primary" href="#" icon='arrow-right' iconPosition="end">Button link</Link>
        </Stack>

        <Stack spacing="400" align="stretch">
          <Typography as="h2" with="heading04">Code Block</Typography>
          <CodeBlock label="app.tsx">{`
            import { Button } from '@jig-ui/react';

            export function Example() {
              return <Button variant="primary">Click me</Button>;
            }
          `}</CodeBlock>

          <CodeBlock>{`pnpm add @jig-ui/react`}</CodeBlock>

          <CodeBlock label="a-very-long-line.sh">{`echo "this single line is far too wide for the block, so the code area scrolls horizontally instead of wrapping or spilling out of the card"`}</CodeBlock>
        </Stack>

      </Stack>


      <Grid columns={{ xs: 3, md: 4 }} spacing="500">
        <Grid columns={2} spacing="200">
          <Typography as="p" with="body01">Testing copy, and this is body 01</Typography>
        </Grid>
        <Item>
          <Grid columns={2} spacing="200">
            <Typography as="p" with="body01">Testing copy, and this is body 01</Typography>
          </Grid>
        </Item>
        <Item>
          <Typography as="p" with="body01">Testing copy, and this is body 01</Typography>
        </Item>
      </Grid>

      <Stack spacing="700">

        <Stack spacing='300'>
          <Typography as="h2" with="display01">Testing copy, and this is heading 01</Typography>
          <Typography as="h2" with="heading02">Testing copy, and this is heading 02</Typography>
          <Typography as="h2" with="heading03">Testing copy, and this is heading 03</Typography>
          <Typography as="p" with="body01">Testing copy, and this is body 01</Typography>
          <Typography as="p" with="body02">Testing copy, and this is body 02</Typography>
          <Typography as="p" with="caption01">Testing copy, and this is caption 01</Typography>
          <Typography as="p" with="caption02">Testing copy, and this is caption 02</Typography>
        </Stack>

        <Stack spacing='300'>
          <div style={{ backgroundColor: color.surfaces.card, padding: spacing[400] }}>
            <Typography as="h2" with="heading03">Testing copy, and this is heading 03</Typography>
          </div>
        </Stack>



        <Stack direction="row" spacing="400">
          <Button variant="primary" icon="star" size="sm">Primary</Button>
          <IconButton variant="primary" label="Trash" icon="trash" size="sm" />
          <Button variant="primary" icon="star" size="lg">Primary</Button>
          <IconButton variant="primary" label="Trash" icon="trash" size="lg" />
        </Stack>

        <Typography as="p" with="body01">
          This is <Adorn as="strong">important</Adorn> <Adorn as="code" with="mono">codeBlock01</Adorn> and this is{' '}
          <Adorn with="danger"><Adorn as="em">critical</Adorn></Adorn>.
        </Typography>

      </Stack>




      <Stack spacing="400">
        <Typography as="h2" with="heading03">ToggleButton</Typography>

        <Stack direction="row" spacing="400" align="center">
          <ToggleButtonGroup aria-label="View" defaultValue={['week']}>
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup aria-label="Filters" multiple defaultValue={['starred']}>
            <ToggleButton value="starred" isIconOnly icon="star" label="Starred" />
            <ToggleButton value="unread" isIconOnly icon="eye" pressedIcon="eye-slash" label="Unread" />
            <ToggleButton value="liked" isIconOnly icon="heart" label="Liked" />
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing="300" align="center">
          <ToggleButton size="sm">Small</ToggleButton>
          <ToggleButton>Medium</ToggleButton>
          <ToggleButton size="lg">Large</ToggleButton>
          <ToggleButton defaultPressed>Starts pressed</ToggleButton>
          <ToggleButton disabled>Disabled</ToggleButton>
          <ToggleButton defaultPressed disabled>Pressed + disabled</ToggleButton>
        </Stack>
      </Stack>

      <Stack spacing="400">
        <Typography as="h2" with="heading03">Token</Typography>

        <Stack direction="row" spacing="200" style={{ flexWrap: 'wrap' }}>
          <Token color="warm">warm</Token>
          <Token color="cool">cool</Token>
          <Token color="blue">blue</Token>
          <Token color="teal">teal</Token>
          <Token color="green">green</Token>
          <Token color="lime">lime</Token>
          <Token color="yellow">yellow</Token>
          <Token color="orange">orange</Token>
          <Token color="red">red</Token>
          <Token color="fuschia">fuschia</Token>
          <Token color="purple">purple</Token>
          <Token color="gray">gray</Token>
        </Stack>

        <Stack direction="row" spacing="300" align="center">
          <Token color="blue" icon="user" onRemove={() => {}}>Nate Bridi</Token>
          <Token color="teal" href="#token">Whole pill is the link</Token>
          <Token color="purple" href="#token" onRemove={() => {}}>Link and removable</Token>
          <Token color="red" style={{ maxWidth: '11rem' }}>A label long enough to be cut off</Token>
        </Stack>

        {/* Side by side with the field whose height they are derived from. */}
        <Stack direction="row" spacing="300" align="center">
          <Input size="sm" placeholder="Input sm" />
          <Token size="sm" color="blue" onRemove={() => {}}>Design</Token>
          <Input size="md" placeholder="Input md" />
          <Token size="md" color="blue" onRemove={() => {}}>Design</Token>
          <Input size="lg" placeholder="Input lg" />
          <Token size="lg" color="blue" onRemove={() => {}}>Design</Token>
        </Stack>
      </Stack>

      <Stack spacing="400">
        <Typography as="h2" with="heading03">ScrollArea</Typography>

        <Stack direction="row" spacing="400" align="start">
          <ScrollArea data-testid="sa-plain" style={{ maxHeight: '12rem', maxWidth: '22rem' }}>
            <Stack spacing="300">
              <Typography as="p" with="body01">At rest there is no chrome at all. Hover this, tab into it, or scroll it and the bar appears; the gutter it occupies is reserved either way, so nothing reflows.</Typography>
              <Typography as="p" with="body01">The gradient mask at the two edges is what says the content is cropped in the meantime. It is clamped by the distance actually scrolled, so it collapses to nothing at either end.</Typography>
              <Typography as="p" with="body01">Base UI puts the viewport in the tab order only while it overflows, so a keyboard user can land in here — and the focus ring is drawn on the root, outside the mask.</Typography>
              <Typography as="p" with="body01">Scroll to the bottom and the lower fade disappears.</Typography>
            </Stack>
          </ScrollArea>

          <ScrollArea data-testid="sa-short" style={{ maxHeight: '12rem', maxWidth: '18rem' }}>
            <Typography as="p" with="body01">Short enough to fit — no bar, no mask, and out of the tab order.</Typography>
          </ScrollArea>
        </Stack>

        {/* The arrangement Dialog will compose: title and actions pinned. */}
        <div
          data-testid="sa-shell"
          style={{
            display: 'flex', flexDirection: 'column', maxHeight: '16rem', maxWidth: '28rem',
            background: color.surfaces.card, borderRadius: '4.3px', overflow: 'hidden',
          }}
        >
          <Typography as="h3" with="heading05" style={{ padding: spacing[500], flex: 'none' }}>Terms of service</Typography>
          <ScrollArea data-testid="sa-body" style={{ flex: 1, minHeight: 0, padding: `0 ${spacing[500]}` }}>
            <Stack spacing="300">
              <Typography as="p" with="body01">A scroll area scrolls because something constrains it. Here that is a flex parent with min-height zero.</Typography>
              <Typography as="p" with="body01">The title and the action row stay put while this moves, which is the whole reason the component exists.</Typography>
              <Typography as="p" with="body01">The mask marks the seam at both ends rather than a rule, per 0007 D2.</Typography>
            </Stack>
          </ScrollArea>
          <Stack direction="row" spacing="300" justify="end" style={{ padding: spacing[500], flex: 'none' }}>
            <Button variant="secondary">Decline</Button>
            <Button variant="primary">Accept</Button>
          </Stack>
        </div>
      </Stack>

      <Stack spacing="400">
        <Typography as="h2" with="heading03">Dialog</Typography>

        <Stack direction="row" spacing="300" style={{ flexWrap: 'wrap' }}>
          <Dialog
            trigger={<Button variant="danger" data-testid="dlg-confirm">Discard</Button>}
            title="Discard changes?"
            description="Your edits to this recipe will be lost."
            size="sm"
            actions={<><Button variant="secondary">Cancel</Button><Button variant="danger">Discard</Button></>}
          >
            Sixteen ingredients and two substitutions will be lost.
          </Dialog>

          <Dialog
            trigger={<Button data-testid="dlg-terms">Terms</Button>}
            title="Terms of service"
            description="Updated 24 August 2026."
            actions={<><Button variant="secondary">Decline</Button><Button>Accept</Button></>}
          >
            <Stack spacing="300">
              {Array.from({ length: 10 }, (_, i) => (
                <Typography key={i} as="p" with="body01">
                  Clause {i + 1}. Content you create remains yours. You grant only the licence needed to store it, display it back to you, and share it with people you choose.
                </Typography>
              ))}
            </Stack>
          </Dialog>

          {/* No frame props at all, and the close lifted onto the scrim. */}
          <Dialog
            trigger={<Button variant="secondary" data-testid="dlg-bare">Preview</Button>}
            aria-label="Preview"
            closePlacement="outside"
          >
            <div style={{ aspectRatio: '4 / 3', background: 'linear-gradient(135deg, #1563de, #ab12b6)', borderRadius: '4.3px' }} />
          </Dialog>

          <Dialog
            trigger={<Button variant="secondary" data-testid="dlg-lg">Large</Button>}
            title="A large dialog"
            size="lg"
            actions={<Button>Done</Button>}
          >
            42rem, capped to the viewport less its margin.
          </Dialog>
        </Stack>
      </Stack>

      <Stack spacing="400">
        <Typography as="h2" with="heading03">Collapsible</Typography>

        <Grid spacing="500" style={{ maxWidth: '34rem' }} alignSelf='stretch'>
          <Collapsible label="Shipping and returns" data-testid="col-default">
            <Typography as="p" with="body01">
              Orders ship within two business days. Returns are free within thirty days of
              delivery, in the original packaging.
            </Typography>
          </Collapsible>

          {/* The trailing text is the alignment check: with no horizontal padding on
              the trigger, its label, the panel copy and this paragraph all share an
              edge. 0013 D1. */}
          <Typography as="p" with="caption01">Prose after it, on the same left edge.</Typography>
        </Grid>

        {/* The FAQ arrangement. The rules are Separator's, not the Collapsible's —
            0013 D1 kept dividers out of the component. `hiddenUntilFound` is what
            lets find-in-page reach a closed answer. */}
        <Stack spacing="400" style={{ maxWidth: '34rem' }}>
          <Separator />
          <Collapsible label="How long does delivery take?" with="heading05" hiddenUntilFound>
            <Typography as="p" with="body01" tone="muted">
              Two business days to mainland addresses, three to the islands.
            </Typography>
          </Collapsible>
          <Separator />
          <Collapsible label="Can I return an opened item?" with="heading05" hiddenUntilFound defaultOpen>
            <Typography as="p" with="body01" tone="muted">
              Yes, within thirty days, as long as the original packaging comes back with it.
            </Typography>
          </Collapsible>
          <Separator />
          <Collapsible label="Do you ship internationally?" with="heading05" hiddenUntilFound>
            <Typography as="p" with="body01" tone="muted">
              To fourteen countries. Duties are calculated at checkout.
            </Typography>
          </Collapsible>
          <Separator />
        </Stack>

        {/* `with` names a Typography preset rather than a size ramp — 0013 D2. */}
        <Stack spacing="500" style={{ maxWidth: '34rem' }}>
          <Collapsible label="caption01 — an aside" with="caption01">
            <Typography as="p" with="caption01" tone="muted">The trigger sets its own type; the panel keeps its own.</Typography>
          </Collapsible>
          <Collapsible label="body01 — the default" data-testid="col-body01">
            <Typography as="p" with="body01" tone="muted">Nothing passed, so it matches the body copy around it.</Typography>
          </Collapsible>
          <Collapsible label="heading03 — a loud one" with="heading03">
            <Typography as="p" with="body01" tone="muted">The glyph is sized in em, so it grows with the label.</Typography>
          </Collapsible>
        </Stack>

        <Stack spacing="500" style={{ maxWidth: '34rem' }}>
          <Collapsible label="No indicator at all" indicator={false} data-testid="col-bare">
            <Typography as="p" with="body01" tone="muted">For a trigger that already reads as one.</Typography>
          </Collapsible>
          <Collapsible label="Disabled" disabled>
            <Typography as="p" with="body01" tone="muted">Never reachable.</Typography>
          </Collapsible>
        </Stack>
      </Stack>

      <Stack spacing="400">
        <Typography as="h2" with="heading03">ListItem</Typography>

        {/* `start` is inside the anchor so it must not be interactive; `end` is
            a sibling so it can be. Tab through the second row — the link and
            the button are both reachable. 0014 D1. */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing="600" align="start">
          <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, width: '17rem' }}>
            <ListItem href="#li-install" start={<Icon icon="star" />}>Installation</ListItem>
            <ListItem
              href="#li-combobox"
              start={<Icon icon="list" />}
              end={<IconButton icon="trash" label="Remove Combobox" size="sm" variant="ghost" />}
            >
              Combobox
            </ListItem>
            <ListItem href="#li-token" start={<Icon icon="info" />} end={<Token color="blue" size="sm">new</Token>}>
              Token
            </ListItem>
            <ListItem href="#li-long" start={<Icon icon="bell" />}>
              A label long enough that it has to be cut off somewhere
            </ListItem>
          </ul>

          {/* The gutter is reserved on every row whether or not that row is the
              selected one, so the labels hold one column. 0014 D3. */}
          <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, width: '17rem' }}>
            <ListItem href="#li-a" selectedIcon="check" start={<Icon icon="star" />}>Installation</ListItem>
            <ListItem href="#li-b" selectedIcon="check" start={<Icon icon="moon" />} selected>Theming</ListItem>
            <ListItem href="#li-c" selectedIcon="check" start={<Icon icon="gear" />}>Tokens</ListItem>
          </ul>
        </Stack>

        {/* The ramp is padding, not height — so the avatar row is simply
            taller rather than clipped. 0014 D5. */}
        <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, width: '17rem' }}>
          <ListItem href="#li-sm" size="sm" start={<Icon icon="star" />}>Small</ListItem>
          <ListItem href="#li-md" size="md" start={<Icon icon="star" />}>Medium</ListItem>
          <ListItem href="#li-lg" size="lg" start={<Icon icon="star" />}>Large</ListItem>
          <ListItem
            href="#li-avatar"
            start={<span style={{ width: '1.75rem', height: '1.75rem', borderRadius: '999px', background: color.token.blue.baseBg }} />}
          >
            With an avatar
          </ListItem>
          <ListItem onClick={() => {}} start={<Icon icon="trash" />} disabled>Disabled button row</ListItem>
        </ul>
      </Stack>

      <Stack spacing="400">
        <Typography as="h2" with="heading03">SideNav</Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing="600" align="start">
          {/* The whole set: pinned header and footer, a scrolling middle, one
              collapsing section, one static, one row current. */}
          <SideNav
            aria-label="Documentation"
            data-testid="sidenav-docs"
            style={{ width: '17rem', height: '26rem', backgroundColor: color.surfaces.card, borderRadius: '4.3px' }}
            header={<Input size="sm" placeholder="Search the docs" aria-label="Search the docs" />}
            footer={
              <ListItem
                as="div"
                size="sm"
                start={<Icon icon="user" />}
                end={<IconButton icon="gear" label="Account settings" size="sm" variant="ghost" />}
              >
                Nate Bridi
              </ListItem>
            }
          >
            <SideNavSection label="Getting started" collapsible defaultOpen>
              <ListItem href="#nav-install" selectedIcon="check" start={<Icon icon="star" />}>Installation</ListItem>
              <ListItem href="#nav-theming" selectedIcon="check" start={<Icon icon="moon" />} selected>Theming</ListItem>
            </SideNavSection>
            <SideNavSection label="Components" collapsible defaultOpen>
              <ListItem href="#nav-button" selectedIcon="check" start={<Icon icon="gear" />}>Button</ListItem>
              <ListItem
                href="#nav-combobox"
                selectedIcon="check"
                start={<Icon icon="list" />}
                end={<IconButton icon="trash" label="Remove Combobox" size="sm" variant="ghost" />}
              >
                Combobox
              </ListItem>
              <ListItem href="#nav-collapsible" selectedIcon="check" start={<Icon icon="minus" />}>Collapsible</ListItem>
              <ListItem href="#nav-long" selectedIcon="check" start={<Icon icon="info" />}>
                A label long enough to be cut off
              </ListItem>
            </SideNavSection>
            <SideNavSection label="Reference">
              <ListItem href="#nav-tokens" selectedIcon="check" start={<Icon icon="info" />}>Tokens</ListItem>
            </SideNavSection>
          </SideNav>

          {/* No header or footer, and a section with no label — which is how a
              run of ungrouped rows still gets its list semantics. */}
          <SideNav
            aria-label="Ungrouped example"
            style={{ width: '15rem', height: '26rem', backgroundColor: color.surfaces.card, borderRadius: '4.3px' }}
          >
            <SideNavSection>
              <ListItem href="#bare-a" start={<Icon icon="sun" />}>Overview</ListItem>
              <ListItem href="#bare-b" start={<Icon icon="calendar" />} selected>Schedule</ListItem>
              <ListItem href="#bare-c" start={<Icon icon="clock" />}>History</ListItem>
            </SideNavSection>
          </SideNav>
        </Stack>
      </Stack>

      <Stack spacing="400" align="stretch">
        <Typography as="h2" with="heading03">Spacing</Typography>

        {/* Margins doing the work, in a plain container with no gap of its own. */}
        <div style={{ backgroundColor: color.surfaces.card, padding: spacing[400] }}>
          <Typography as="h3" with="heading04" mb="500">Heading, mb 500</Typography>
          <Typography as="p" with="body01" mb="200">Paragraph, mb 200.</Typography>
          <Typography as="p" with="body01" mb="200">Another paragraph, mb 200.</Typography>
          <Typography as="p" with="body01">Last paragraph, no margin at all.</Typography>
        </div>

        {/* Responsive: the object form of the same prop. */}
        <div style={{ backgroundColor: color.surfaces.card, padding: spacing[400] }}>
          <Typography as="p" with="body01" mb={{ xs: '100', md: '700' }}>
            Responsive margin — mb 100 below md, mb 700 from md up. Resize to see it.
          </Typography>
          <Typography as="p" with="caption01">The element that follows it.</Typography>
        </div>
      </Stack>

      <Stack spacing="400" direction={{ xs: 'column', md: 'row' }}>
        {(['primary', 'secondary'] as const).map((variant) => (
          <Stack key={variant} direction="row">
            <Button variant={variant} size="sm">{variant} sm</Button>
            <Button variant={variant} size="md">{variant} md</Button>
            <Button variant={variant} size="lg">{variant} lg</Button>
          </Stack>
        ))}
      </Stack>

    </div>
  );
}

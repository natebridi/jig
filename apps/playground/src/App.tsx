import '@jig-ui/react/styles.css'
import { Button, IconButton, Typography, Adorn, Stack, Box, Grid, Tooltip, CodeBlock, ToggleButton, ToggleButtonGroup, Input, Slider, Token } from '@jig-ui/react'
import { color, spacing } from '@jig-ui/react/tokens'
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
        backgroundColor: `light-dark(${color.warm[0]}, ${color.green[750]})`,
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
                    <Box span={{ xs: 24, md: 3 }}><Input label="Measure" /></Box>
                    <Box span={{ xs: 24, md: 3 }}><Input label="Quantity" /></Box>
                    <Box span={{ xs: 24, md: 9 }}><Input label="Ingredient" /></Box>
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
            <Grid span={{ xs: 24, md: 16 }} columns={2} spacing="200" data-testid="grid-span-16">
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
            <IconButton variant="ghost" label="Trash" icon="trash" />
            <ToggleButton isIconOnly icon="heart" label="Trash" />
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost" icon="calendar" size="sm">Ghost</Button>
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

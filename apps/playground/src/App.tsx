import '@jig-ui/react/styles.css'
import { Button, Typography, Adorn, Stack, Grid, Tooltip } from '@jig-ui/react'
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
          padding: '48px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          backgroundColor: color.surfaces.body,
        }}
      >

      <div className="style-debug">
        <div id='debug-mode' />
        <div id='debug-size' />
      </div>

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

      <Typography as="p" with="body01">Testing</Typography>

      <Stack direction="row">
        <Button variant="primary">Primary</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </Stack>

      <Typography as="p" sizeMin="500" sizeMax="600">
        This is <Adorn with="semibold">important</Adorn> <Adorn with="code">codeBlock01</Adorn> and this is{' '}
        <Adorn with="danger"><Adorn with="italic">critical</Adorn></Adorn>.
      </Typography>

      <Stack spacing="400">
        <Typography as="h2" with="heading03">Tooltip</Typography>

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

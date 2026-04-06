import '@jig-ui/styles/vars.css'
import '@jig-ui/styles/base.css'
import { Button, Typography, Adorn, Stack, Grid } from '@jig-ui/components'
import { color } from '@jig-ui/styles/tokens'
import './debug.css'

const Item = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      backgroundColor: color.surfaces[200],
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
          backgroundColor: color.surfaces[100],
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
      
      <Typography as="h2" with="heading03">Testing copy, and this is heading 03</Typography>
      <Typography as="h2" with="heading01">Testing copy, and this is heading 01</Typography>
      <Typography as="p" with="body01">Testing copy, and this is body 01</Typography>
      <Typography as="h2" with="heading02">Testing copy, and this is heading 02</Typography>
      <Typography as="p" with="body02">Testing copy, and this is body 02</Typography>
      <Typography as="p" with="caption01">Testing copy, and this is caption 01</Typography>
      <Typography as="p" with="caption02">Testing copy, and this is caption 02</Typography>

      <Typography as="p" with="body01">Testing</Typography>
      
      <Stack direction="row">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </Stack>
      
      <Typography as="p" sizeMin="500" sizeMax="600">                                                                                                                      
        This is <Adorn with="semibold">important</Adorn> and this is{' '}                                                                                    
        <Adorn with="danger"><Adorn with="italic">critical</Adorn></Adorn>.                                                                                  
      </Typography>    
      
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

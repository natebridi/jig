import '@jig-ui/styles/vars.css'
import '@jig-ui/styles/base.css'
import { Button, Typography, Adorn, Stack } from '@jig-ui/components'
import { color } from '@jig-ui/styles/tokens'
import './debug.css'

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
      
      <Typography as="h2" with="heading01">Testing copy, and this is heading 01</Typography>
      <Typography as="h2" with="body01">Testing copy, and this is body 01</Typography>

      <Typography as="p" with="body01">Testing</Typography>
      
      <Stack direction="row">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
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

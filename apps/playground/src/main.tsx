import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@jig-ui/react/reset.css';

// Dev only. @jig-ui/react/styles.css carries a copy of the token custom
// properties baked in when that package was built, so a token edit would
// otherwise need the whole chain rebuilt before it showed up here. Pulling the
// live sheet from @jig-ui/styles afterwards puts the same declarations later in
// the cascade, where Vite can hot-reload them as Terrazzo rewrites the file.
// `import.meta.env.DEV` is false in the production build, which drops this and
// leaves the playground consuming @jig-ui/react alone, as an outside app would.
if (import.meta.env.DEV) {
  import('@jig-ui/styles/vars.css');
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No Vanilla Extract plugin: the playground consumes the built @jig-ui/react
// package the same way an outside project does, which keeps that path tested.
export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { host: true }
});

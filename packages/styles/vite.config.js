import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// Compiles reset.css.ts into a plain dist/reset.css so consumers never need
// Vanilla Extract tooling of their own. Runs after Terrazzo has written its
// output into dist/, hence emptyOutDir: false.
export default defineConfig({
    plugins: [vanillaExtractPlugin()],
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        cssCodeSplit: false,
        lib: {
            entry: 'src/reset.ts',
            formats: ['es'],
            fileName: () => 'reset.js'
        },
        rollupOptions: {
            output: { assetFileNames: 'reset.css' }
        }
    }
});

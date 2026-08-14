import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

/**
 * Separate from vite.config.ts, which is the *library* build — that one carries
 * the dts plugin, the lib entry points and the stylesheet composition, none of
 * which a test run should trigger.
 */
export default defineConfig({
    plugins: [vanillaExtractPlugin()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
    },
});

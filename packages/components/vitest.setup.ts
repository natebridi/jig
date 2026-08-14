import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library only registers its own afterEach cleanup when Vitest globals
// are enabled. They are not, so renders would otherwise pile up in the same
// document and every getByRole would match the previous test's output too.
afterEach(cleanup);

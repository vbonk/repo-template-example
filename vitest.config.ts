// Vitest configuration — from templates/testing/vitest.config.ts.template
// Docs: https://vitest.dev/config/
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      // index.ts is the process entry point (listen + signal handlers) —
      // exercised via `npm run dev`, not meaningfully unit-testable.
      exclude: ['src/**/*.d.ts', 'src/index.ts'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});

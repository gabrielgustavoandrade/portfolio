import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const smartDateInput = path.resolve(
  __dirname,
  'node_modules/@gabrielgustavoandrade/smart-date-input/dist/index.esm.js',
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@gabrielgustavoandrade/smart-date-input': smartDateInput,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
    restoreMocks: true,
    server: {
      deps: {
        inline: ['@gabrielgustavoandrade/smart-date-input'],
      },
    },
  },
});

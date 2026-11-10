import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { portfolioData } from './src/data/portfolioData';
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ??
      character,
  );
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'portfolio-metadata',
      transformIndexHtml: (html) =>
        html
          .replaceAll('%PORTFOLIO_TITLE%', escapeHtml(portfolioData.meta.title))
          .replaceAll('%PORTFOLIO_DESCRIPTION%', escapeHtml(portfolioData.meta.description)),
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});

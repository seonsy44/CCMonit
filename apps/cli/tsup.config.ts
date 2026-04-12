import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
  noExternal: ['@ccmonit/application', '@ccmonit/domain', '@ccmonit/infra', '@ccmonit/shared'],
});

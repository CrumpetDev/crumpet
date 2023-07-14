import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => {
  return {
    server: {
      open: true,
    },
    build: {
      outDir: 'build',
    },
    plugins: [react(), viteTsconfigPaths(), eslint(), svgr()],
    test: {
      globals: true,
      environment: 'jsdom',
    },
    resolve: {
      alias: {
        assets: './src/assets',
      },
    },
  };
});

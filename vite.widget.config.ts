import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  build: {
    outDir: 'build',
    emptyOutDir: false,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2019',
    lib: {
      entry: resolve(__dirname, 'widget/index.ts'),
      formats: ['iife'],
      name: 'ElixirChatWidget',
    },
    rollupOptions: {
      output: {
        entryFileNames: 'default-widget.min.js',
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    'process.env.ELIXIRCHAT_VERSION': JSON.stringify(env.ELIXIRCHAT_VERSION || ''),
  },
  };
});

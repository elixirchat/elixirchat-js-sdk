import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [vue()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        mode === 'production' ? 'production' : 'development',
      ),
      'process.env.ELIXIRCHAT_VERSION': JSON.stringify(env.ELIXIRCHAT_VERSION || ''),
    },
    server: {
      port: 8001,
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '!**/dist/styles/**',
        ],
      },
    },
  };
});

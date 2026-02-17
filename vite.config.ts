import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
      'process.env.ELIXIRCHAT_VERSION': JSON.stringify(env.ELIXIRCHAT_VERSION || ''),
    },
    server: {
      port: 8001,
    },
  };
});

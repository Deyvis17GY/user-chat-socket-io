import { defineConfig } from 'vite';
import reactJsx from 'vite-react-jsx';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactJsx()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@src': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: true
  }
});

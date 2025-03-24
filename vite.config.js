import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(), // SWC config is moved to .swcrc
    cssInjectedByJs(),
    dts({
      // Generate TypeScript declaration files
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'DateRangePicker',
      fileName: (format) => `date-range-picker.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'moment-timezone'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'moment-timezone': 'moment-timezone',
        },
        // Improve chunk handling
        manualChunks: undefined,
      },
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
    // Optimize CSS handling
    cssCodeSplit: true,
    // Improve bundle size reporting
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },
});

import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import reactPlugin from '@vitejs/plugin-react';
import checkerPlugin from 'vite-plugin-checker';
import eslintPlugin from 'vite-plugin-eslint';
import tsConfigPathPlugin from 'vite-tsconfig-paths';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import visualizerPlugin from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envConfig = loadEnv(mode, process.cwd(), '');
  envConfig.NODE_ENV = mode;

  const plugins = [
    tsConfigPathPlugin(),
    reactPlugin({
      jsxRuntime: mode === 'development' ? 'classic' : 'automatic',
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
    checkerPlugin({
      typescript: true,
    }),
    eslintPlugin(),
    splitVendorChunkPlugin(),
  ];

  if (process.env.VISUALIZER && process.env.VISUALIZER === 'true') {
    plugins.push(
      visualizerPlugin({
        title: 'Vite Visualizer',
        filename: './stats.html',
      })
    );
  }

  return {
    resolve: {
      alias: {
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        url: 'rollup-plugin-node-polyfills/polyfills/url',
        os: 'rollup-plugin-node-polyfills/polyfills/os',
        console: 'rollup-plugin-node-polyfills/polyfills/console',
        zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      },
    },
    build: {
      outDir: 'build',
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    plugins,
    define: {
      'process.env': `${JSON.stringify(envConfig)}`,
    },
  };
});

import { defineConfig, loadEnv } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import reactPlugin from '@vitejs/plugin-react';
import checkerPlugin from 'vite-plugin-checker';
import eslintPlugin from 'vite-plugin-eslint';
import tsConfigPathPlugin from 'vite-tsconfig-paths';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envConfig = loadEnv(mode, process.cwd(), '');
  envConfig.NODE_ENV = mode;

  return {
    resolve: {
      alias: {
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        sys: 'util',
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        url: 'rollup-plugin-node-polyfills/polyfills/url',
        string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
        http: 'rollup-plugin-node-polyfills/polyfills/http',
        https: 'rollup-plugin-node-polyfills/polyfills/http',
        os: 'rollup-plugin-node-polyfills/polyfills/os',
        console: 'rollup-plugin-node-polyfills/polyfills/console',
        zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
        domain: 'rollup-plugin-node-polyfills/polyfills/domain',
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
    plugins: [
      tsConfigPathPlugin(),
      reactPlugin(),
      svgrPlugin({
        svgrOptions: {
          icon: true,
        },
      }),
      checkerPlugin({
        typescript: true,
      }),
      eslintPlugin(),
    ],
    define: {
      'process.env': `${JSON.stringify(envConfig)}`,
    },
  };
});

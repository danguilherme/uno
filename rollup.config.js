import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json' with { type: "json" };
import define from 'rollup-plugin-define';

export default [
  // browser-friendly UMD build
  {
    input: 'src/uno-engine.ts',
    output: {
      name: 'Uno',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      resolve({
        preferBuiltins: false,
      }), // so Rollup can find external dependencies
      commonjs(), // so Rollup can convert external dependencies to an ES module
      typescript(), // so Rollup can convert TypeScript to JavaScript
      define({
        replacements: {
          'process.env.PLATFORM': JSON.stringify('browser'),
        },
      }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/uno-engine.ts',
    external: ["shuffle", "events"], // add any external dependencies here
    plugins: [
      typescript(), // so Rollup can convert TypeScript to JavaScript
      define({
        replacements: {
          'process.env.PLATFORM': JSON.stringify('node'),
        },
      }),
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];

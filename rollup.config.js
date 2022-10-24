/* eslint-disable @typescript-eslint/no-var-requires */
const del = require('rollup-plugin-delete');
const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');
const shebang = require('rollup-plugin-preserve-shebang');
const statistics = require('rollup-plugin-build-statistics');

module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.cjs',
    format: 'cjs',
  },
  plugins: [
    statistics({
      projectName: 'list-repos',
    }),
    del({
      targets: 'dist/*',
    }),
    shebang(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    json(),
  ],
};

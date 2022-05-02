import del from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import shebang from 'rollup-plugin-preserve-shebang';
import statistics from 'rollup-plugin-build-statistics';

export default {
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

import minimist from 'minimist';
import { getCompactness } from './getCompactness';
import constants, { SORT_DIRECTIONS } from '../constants';

export const getCommandOptions = (
  _argv: NodeJS.Process['argv'],
  cwd: string
): CommandOptions => {
  const argv = minimist(_argv.slice(2));

  const showGitOnly = argv.gitonly || argv.g;
  const shouldShowHelp = argv.help || argv.h;
  const needsAttention = argv.attention || argv.a;
  const shouldShowVersion = argv.version || argv.v;
  const shouldShowSimpleOutput = argv.simple || argv.s;
  const dir = argv._.length ? argv._[0] : cwd;
  const shouldSort = Boolean(argv.sort);
  const sortDirection: string =
    shouldSort && typeof argv.sort === 'string'
      ? String(argv.sort).toUpperCase()
      : SORT_DIRECTIONS.ASC;
  const compactness = getCompactness(argv);
  const debug = Boolean(argv.debug) ? console.log : constants.NOOP;

  return {
    cwd: dir,
    debug,
    // Sorting options
    shouldSort,
    sortDirection,
    // Output Flags & Options
    compactness,
    showGitOnly,
    needsAttention,
    shouldShowSimpleOutput,
    // Help Flags
    shouldShowHelp,
    shouldShowVersion,
  };
};

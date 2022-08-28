import minimist from 'minimist';
import { getCompactness } from './getCompactness';
import constants, { SORT_DIRECTIONS } from '../constants';

const extractOptions = (argv: minimist.ParsedArgs) => ({
  // Output Flags & Options
  showGitOnly: argv.gitonly || argv.g,
  needsAttention: argv.attention || argv.a,
  shouldShowSimpleOutput: argv.simple || argv.s,

  // Help Flags
  shouldShowHelp: argv.help || argv.h,
  shouldShowVersion: argv.version || argv.v,
});

export const getCommandOptions = (
  _argv: NodeJS.Process['argv'],
  cwd: string
): CommandOptions => {
  const argv = minimist(_argv.slice(2));

  const dir = argv._.length ? argv._[0] : cwd;
  const shouldSort = Boolean(argv.sort);
  const sortDirection: string =
    shouldSort && typeof argv.sort === 'string'
      ? String(argv.sort).toUpperCase()
      : SORT_DIRECTIONS.ASC;
  const debug = Boolean(argv.debug) ? console.log : constants.NOOP;

  return {
    ...extractOptions(argv),
    cwd: dir,
    debug,
    // Sorting options
    shouldSort,
    sortDirection,
    // Output Flags & Options
    compactness: getCompactness(argv),
  };
};

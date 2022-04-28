import { ForegroundColor } from 'chalk';

export const optionsText = `
The path defaults to the current directory if not specified.

Options:
  --help, -h            show this help
  --version, -v         show version
  --compact, -c         output compact table
  --compact=s, -c=s     output compact table with short headers
                        with headers described in bottom of table
  --compact=so, -c=so   output compact table with short headers
                        and no description of headers
  --gitonly, -g         output only git repositories
  --attention, -a       output only dirs which requires attention
                        also includes non git dirs, use -g to omit them
  --simple, -s          make the output more simple for easy grepping

`;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = () => {};

export const COMPACTNESS_LEVELS = {
  NONE: 'NONE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

const HEADERS: Record<TableHeader, Record<TableHeaderType, string>> = {
  directory: {
    long: 'Directory',
    short: 'DIR',
  },
  branch: {
    long: 'Branch',
    short: 'B',
  },
  ahead: {
    long: 'Ahead',
    short: 'A',
  },
  dirty: {
    long: 'Dirty',
    short: 'D',
  },
  untracked: {
    long: 'Untracked',
    short: 'U',
  },
  stashes: {
    long: 'Stashes',
    short: 'S',
  },
};

export default {
  defaultHeaderColor: 'cyan' as typeof ForegroundColor,
  updateInterval: 2, //days only
  daysMultiplier: 1000 * 60 * 60 * 24,
  columnsOrder: [
    'directory',
    'branch',
    'ahead',
    'dirty',
    'untracked',
    'stashes',
  ] as Array<TableHeader>,
  headers: HEADERS,
  simple: [
    'directory',
    'branch',
    'ahead',
    'dirty',
    'untracked',
    'stashes',
  ] as Array<TableHeader>,
  emptyGitStatus: {
    branch: '-',
    issues: '-',
    git: false,
    untracked: '-',
    ahead: '-',
    stashes: '-',
    dirty: '-',
  },
  optionsText: optionsText,
  COMPACTNESS_LEVELS,
  NOOP,
};

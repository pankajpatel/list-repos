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
  --ignore, -i          ignore all dirs whose name matches this substring in the processed directory

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
  displayPath: {
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

export const SORT_DIRECTIONS: Record<string, string> = {
  ASC: 'ASC',
  DESC: 'DESC',
  asc: 'ASC',
  desc: 'DESC',
};

export const SORT_FUNCTIONS: Record<
  keyof typeof SORT_DIRECTIONS,
  (a: string, b: string) => number
> = {
  ASC: (a: string, b: string) => Number(a[0]) - Number(b[0]),
  DESC: (a: string, b: string) => Number(b[0]) - Number(a[0]),
};

export default {
  defaultHeaderColor: 'cyan' as typeof ForegroundColor,
  updateInterval: 2, //days only
  daysMultiplier: 1000 * 60 * 60 * 24,
  columnsOrder: [
    'displayPath',
    'branch',
    'ahead',
    'dirty',
    'untracked',
    'stashes',
  ] as Array<TableHeader>,
  headers: HEADERS,
  simple: [
    'displayPath',
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

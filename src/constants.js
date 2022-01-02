const optionsText = `
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

module.exports = {
  updateInterval: 2, //days only
  daysMultiplier: 1000 * 60 * 60 * 24,
  columnsOrder: [
    'directory',
    'branch',
    'ahead',
    'dirty',
    'untracked',
    'stashes',
  ],
  headers: {
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
  },
  simple: ['directory', 'branch', 'ahead', 'dirty', 'untracked', 'stashes'],
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
};

const emptyGitStatus = {
  branch: '-',
  issues: '-',
  git: false,
  untracked: '-',
  ahead: '-',
  stashes: '-',
  dirty: '-'
};

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
  optionsText: optionsText,
  emptyGitStatus: emptyGitStatus,
}

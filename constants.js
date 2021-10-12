module.exports = {
  updateInterval: 2, //days only
  columnsOrder: [
    'directory',
    'branch',
    'ahead',
    'dirty',
    'untracked',
    'stashes'
  ],
  headers: {
    directory: {
      long: 'Directory',
      short: 'DIR'
    },
    branch: {
      long: 'Branch',
      short: 'B'
    },
    ahead: {
      long: 'Ahead',
      short: 'A'
    },
    dirty: {
      long: 'Dirty',
      short: 'D'
    },
    untracked: {
      long: 'Untracked',
      short: 'U'
    },
    stashes: {
      long: 'Stashes',
      short: 'S'
    }
  },
  simple: [
    'directory',
    'branch',
    'ahead',
    'dirty',
    'untracked',
    'stashes'
  ]
}

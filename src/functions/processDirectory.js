const { isGit } = require('./isGit');
const { gitCheck } = require('./gitCheck');

const processNonGitDir = (stat, options) =>
  new Promise((resolve) => {
    const gitStatus = options.C.emptyGitStatus;
    options.debug(stat.file, gitStatus);
    if (!options.showGitOnly) {
      options.insert(stat.file, gitStatus);
      return resolve(true);
    }
    return resolve(false);
  });

const processGitDir = (stat, options) =>
  gitCheck(stat.file).then((gitStatus) => {
    gitStatus.git = true;
    options.debug(stat.file, gitStatus);
    options.insert(stat.file, gitStatus);
    return Promise.resolve(true);
  });

const processDirectory = (stat, options) => {
  if (!stat || !stat.file) {
    return Promise.resolve(false);
  }

  if (!stat.stat.isDirectory()) {
    options.debug(stat.file, false);
    return Promise.resolve(false);
  }

  options.debug(stat.file);

  return Promise.resolve()
    .catch((e) => Promise.resolve(false))
    .then(() => isGit(stat.file))
    .then((isDirGit) =>
      !isDirGit ? processNonGitDir(stat, options) : processGitDir(stat, options)
    );
};

const processDirectories = (stats, opts) =>
  Promise.all(stats.map((status) => processDirectory(status, opts)));

module.exports = {
  processDirectory: processDirectories,
};

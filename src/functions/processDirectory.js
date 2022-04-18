const { isGit } = require('./isGit');
const { gitCheck } = require('./gitCheck');

const processDirectory = (stat, options) => {
  if (!stat || !stat.file) {
    return Promise.resolve(false);
  }
  let pathString = stat.file;

  if (!stat.stat.isDirectory()) {
    options.debug(stat.file, false);
    return Promise.resolve(false);
  }

  options.debug(stat.file);

  return Promise.resolve()
    .catch((e) => Promise.resolve(false))
    .then(() => isGit(pathString))
    .then((isDirGit) => {
      return !isDirGit
        ? new Promise((resolve) => {
            const gitStatus = options.C.emptyGitStatus;
            options.debug(stat.file, gitStatus);
            if (!options.showGitOnly) {
              options.insert(pathString, gitStatus);
              return resolve(true);
            }
            return resolve(false);
          })
        : gitCheck(pathString).then((gitStatus) => {
            gitStatus.git = true;
            options.debug(stat.file, gitStatus);
            options.insert(pathString, gitStatus);
            return Promise.resolve(true);
          });
    });
};

const processDirectories = (stats, opts) =>
  Promise.all(stats.map((status) => processDirectory(status, opts)));

module.exports = {
  processDirectory: processDirectories,
};

const { isGit } = require('./isGit');
const { gitCheck } = require('./gitCheck');

const processDirectory = async (stat, options) => {
  if (!stat || !stat.file) {
    return Promise.resolve(false);
  }
  let pathString = stat.file;

  if (!stat.stat.isDirectory()) {
    options.debug(stat.file, false);
    return Promise.resolve(false);
  }

  options.debug(stat.file);
  try {
    const isDirGit = await isGit(pathString);

    if (!isDirGit) {
      const gitStatus = options.C.emptyGitStatus;
      options.debug(stat.file, gitStatus);
      if (!options.showGitOnly) {
        options.insert(pathString, gitStatus);
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
    const gitStatus = await gitCheck(pathString);

    gitStatus.git = true;
    options.debug(stat.file, gitStatus);
    options.insert(pathString, gitStatus);
    return Promise.resolve(true);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  }
};

const processDirectories = async (stats, opts) =>
  Promise.all(stats.map((status) => processDirectory(status, opts)));

module.exports = {
  processDirectory: processDirectories,
};

const theGit = require('git-state');

const isGit = (p) =>
  new Promise((resolve) => {
    theGit.isGit(p, function (result) {
      resolve(result);
    });
  });

module.exports = {
  isGit,
};

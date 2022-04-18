const theGit = require('git-state');

const gitCheck = (p) =>
  new Promise((resolve, reject) => {
    theGit.check(p, function (e, result) {
      if (e) {
        reject(e);
      }
      resolve(result);
    });
  });

module.exports = {
  gitCheck,
};

/* eslint-disable @typescript-eslint/no-var-requires */
const theGit = require('git-state');

export const gitCheck = (path: string): PromiseLike<GitStatus> =>
  new Promise((resolve, reject) => {
    theGit.check(path, function (error: unknown, result: GitStatus) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });

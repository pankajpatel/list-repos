/* eslint-disable @typescript-eslint/no-var-requires */
const theGit = require('git-state');

export const isGit = (path: string) =>
  new Promise((resolve) => {
    theGit.isGit(path, function (result: boolean) {
      resolve(result);
    });
  });

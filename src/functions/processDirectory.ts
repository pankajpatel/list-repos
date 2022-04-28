import { isGit } from './isGit';
import constants from '../constants';
import { gitCheck } from './gitCheck';
import { prettyPath } from './prettyPath';

const buildRepoState = (path: string, repoState: GitStatus | null) => ({
  // Deprecated: file, directory
  file: path,
  directory: prettyPath(path),

  path,
  displayPath: prettyPath(path),
  git: Boolean(repoState),
  ...(repoState || constants.emptyGitStatus),
});

export const processNonGitDir = (stat: Stat): PromiseLike<ExtendedGitStatus> =>
  Promise.resolve(buildRepoState(stat.file, null));

export const processGitDir = (stat: Stat): PromiseLike<ExtendedGitStatus> =>
  gitCheck(stat.file).then(
    (gitStatus: GitStatus): ExtendedGitStatus =>
      buildRepoState(stat.file, gitStatus)
  );

export const processDirectory = (stat: Stat) => {
  if (!stat || !stat.file || !stat.stat) {
    return Promise.resolve(buildRepoState(stat?.file ?? '', null));
  }

  if (!stat.stat.isDirectory()) {
    return Promise.resolve(buildRepoState(stat.file, null));
  }

  return Promise.resolve()
    .catch(() => processNonGitDir(stat))
    .then(() => isGit(stat.file))
    .then((isDirGit) =>
      !isDirGit ? processNonGitDir(stat) : processGitDir(stat)
    );
};

export const processDirectories = (stats: Stat[]) =>
  Promise.all(stats.map((status: Stat) => processDirectory(status)));

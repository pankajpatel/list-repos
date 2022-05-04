import { isGit } from './isGit';
import constants from '../constants';
import { gitCheck } from './gitCheck';
import { prettyPath } from './prettyPath';

const buildRepoState = (
  path: string,
  repoState: GitStatus | null
): ExtendedGitStatus => ({
  path,
  displayPath: prettyPath(path),
  git: Boolean(repoState),
  ...(repoState || constants.emptyGitStatus),
});

export const processNonGitDir = (stat: Stat): PromiseLike<ExtendedGitStatus> =>
  Promise.resolve(buildRepoState(stat.path, null));

export const processGitDir = (stat: Stat): PromiseLike<ExtendedGitStatus> =>
  gitCheck(stat.path).then(
    (gitStatus: GitStatus): ExtendedGitStatus =>
      buildRepoState(stat.path, gitStatus)
  );

export const processDirectory = (
  stat: Stat
): PromiseLike<ExtendedGitStatus> => {
  if (!stat || !stat.path || !stat.stat) {
    return Promise.resolve(buildRepoState(stat?.path ?? '', null));
  }

  if (!stat.stat.isDirectory()) {
    return Promise.resolve(buildRepoState(stat.path, null));
  }

  return Promise.resolve()
    .catch(() => processNonGitDir(stat))
    .then(() => isGit(stat.path))
    .then((isDirGit) =>
      !isDirGit ? processNonGitDir(stat) : processGitDir(stat)
    );
};

export const processDirectories = (
  stats: Stat[]
): PromiseLike<ExtendedGitStatus[]> =>
  Promise.all(stats.map((status: Stat) => processDirectory(status)));

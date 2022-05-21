declare module 'git-state';

type TableHeaderType = 'long' | 'short';

type TableHeader =
  | 'displayPath'
  | 'branch'
  | 'ahead'
  | 'dirty'
  | 'untracked'
  | 'stashes';

type FSStat = FileSystem.Stats;

type Stat = {
  path: string;
  stat: FSStat;
};

type GitStatus = {
  branch: string;
  issues: string;
  untracked: string;
  ahead: string;
  stashes: string;
  dirty: string;
};

interface ExtendedGitStatus extends GitStatus {
  git: boolean;
  path: string;
  displayPath: string;
}

interface DebugFn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): void;
}

interface CommandOptions {
  compactness: string;
  showGitOnly: boolean;
  shouldShowVersion: boolean;
  shouldShowHelp: boolean;
  shouldShowSimpleOutput: boolean;
  shouldSort: boolean;
  sortDirection: keyof SORT_DIRECTIONS;
  needsAttention: boolean;
  debug: DebugFn;
  cwd: string;
}

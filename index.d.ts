declare module 'git-state';

type TableHeaderType = 'long' | 'short';

type TableHeader =
  | 'directory'
  | 'branch'
  | 'ahead'
  | 'dirty'
  | 'untracked'
  | 'stashes';

type Stat = {
  file: string;
  stat: FileSystem.Stats | null;
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
  file: string;
  directory: string;
}

interface InsertFn {
  (file: string, gitStatus: GitStatus): void;
}

interface DebugFn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): void;
}

type Options = {
  debug: DebugFn;
  insert: InsertFn;
  showGitOnly: boolean;
};

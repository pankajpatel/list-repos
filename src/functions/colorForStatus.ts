import { ForegroundColor } from 'chalk';

export const COLORS: Record<string, typeof ForegroundColor> = {
  RED: 'red',
  GREEN: 'green',
  YELLOW: 'yellow',
  GREY: 'grey',
};

export const colorForStatus = (
  state: GitStatus | ExtendedGitStatus
): typeof ForegroundColor => {
  if (state.dirty) return COLORS.RED;
  if (state.ahead) return COLORS.GREEN;
  if (state.untracked) return COLORS.YELLOW;
  return COLORS.GREY;
};

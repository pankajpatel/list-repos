export const clearCli = (proc = process) => {
  proc.stdout.clearLine(0); // clear current text
  proc.stdout.cursorTo(0); // move cursor to beginning of line
};

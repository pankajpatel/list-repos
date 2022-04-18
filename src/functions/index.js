const { printHelp } = require('./printHelp');
const { colorForStatus } = require('./colorForStatus');
const { isGit } = require('./isGit');
const { gitCheck } = require('./gitCheck');
const { prettyPath } = require('./prettyPath');
const { processDirectory } = require('./processDirectory');

module.exports = {
  printHelp: printHelp,
  colorForStatus: colorForStatus,
  isGit: isGit,
  gitCheck: gitCheck,
  prettyPath: prettyPath,
  processDirectory: processDirectory,
};

const { isGit } = require('./isGit');
const { getHelp } = require('./getHelp');
const { gitCheck } = require('./gitCheck');
const { prettyPath } = require('./prettyPath');
const { colorForStatus } = require('./colorForStatus');
const { startSpinner, stopSpinner } = require('./spinner');
const { processDirectory } = require('./processDirectory');

module.exports = {
  isGit: isGit,
  getHelp: getHelp,
  gitCheck: gitCheck,
  prettyPath: prettyPath,
  stopSpinner: stopSpinner,
  startSpinner: startSpinner,
  colorForStatus: colorForStatus,
  processDirectory: processDirectory,
};

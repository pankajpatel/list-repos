const pkg = require('../../package');
const { optionsText } = require('../constants');

function getHelp() {
  const lines = [
    `${pkg.name} ${pkg.version}`,
    pkg.description,
    'Usage:',
    `${pkg.name} [path] [options]`,
    optionsText,
  ];
  return lines.join('\n');
}

module.exports = {
  getHelp: getHelp,
};

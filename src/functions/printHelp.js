const pkg = require('../../package');
const { optionsText } = require('../constants');

function printHelp(linePrinter = console.log) {
  const lines = [
    `${pkg.name} ${pkg.version}`,
    pkg.description,
    'Usage:',
    `${pkg.name} [path] [options]`,
    optionsText,
  ];
  linePrinter(lines.join('\n'));
}

module.exports = {
  printHelp: printHelp,
};

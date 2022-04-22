const C = require('../constants');

const getCompactness = (cliArgs = argv) => {
  const compact = cliArgs.compact || cliArgs.c;

  switch (compact) {
    case 's':
      return C.COMPACTNESS_LEVELS.MEDIUM;
    case 'so':
      return C.COMPACTNESS_LEVELS.HIGH;
    case true:
      return C.COMPACTNESS_LEVELS.LOW;
    default:
      return C.COMPACTNESS_LEVELS.NONE;
  }
};

module.exports = {
  getCompactness,
};

const path = require('path');

const prettyPath = (pathString) => {
  const p = pathString.split(path.sep);
  return p[p.length - 1];
};

module.exports = {
  prettyPath,
};

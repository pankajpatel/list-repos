const chalk = require('chalk');
const Table = require('cli-table');
const C = require('../constants');

const getTableHeader = (type, color = C.defaultHeaderColor) => {
  const colorizer = chalk[color];
  return C.columnsOrder.map((key) => colorizer(C.headers[key][type]));
};

const initTable = (compactness) => {
  const tableOpts = {
    head: getTableHeader('long'),
  };

  if (compactness !== C.COMPACTNESS_LEVELS.NONE) {
    tableOpts.head =
      compactness !== C.COMPACTNESS_LEVELS.LOW
        ? getTableHeader('short')
        : tableOpts.head;

    tableOpts.chars = {
      mid: '',
      'left-mid': '',
      'mid-mid': '',
      'right-mid': '',
    };
  }
  return new Table(tableOpts);
};

module.exports = {
  initTable,
  getTableHeader,
};

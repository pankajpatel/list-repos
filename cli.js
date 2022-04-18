#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table');
const updateNotifier = require('update-notifier');

const { Spinner } = require('cli-spinner');
const argv = require('minimist')(process.argv.slice(2));

const pkg = require('./package');
const C = require('./src/constants');
const {
  printHelp,
  prettyPath,
  colorForStatus,
  processDirectory,
} = require('./src/functions');

const NOOP = () => {};

const printLine = console.log;
const showGitOnly = argv.gitonly || argv.g;
const dirs = argv._.length ? argv._ : [process.cwd()];
const debug = Boolean(argv.debug) ? printLine : NOOP;

let spinner = null;
let table = null;
let cwd = null;
let statuses = [];
let compact = false;

updateNotifier({
  pkg: pkg,
  updateCheckInterval: C.updateInterval * C.daysMultiplier,
}).notify();

process.on('uncaughtException', (err) => {
  printLine(`Caught exception: ${err}`);
  process.exit();
});

if (argv.version || argv.v) {
  printLine(pkg.version);
  process.exit();
}

if (argv.help || argv.h) {
  printHelp(printLine);
  process.exit();
}

if (argv.compact || argv.c) {
  compact = argv.compact || argv.c;
}

function hasAskedForCompact() {
  return compact && compact === 's';
}

function hasAskedForVeryCompact() {
  return compact && compact === 'so';
}

function getTableHeader(type, color) {
  if (!color) {
    color = 'cyan';
  }
  const colorizer = chalk[color];
  return C.columnsOrder.map((key) => colorizer(C.headers[key][type]));
}

function init(directories) {
  //either passed from CLI or take the current directory
  cwd = directories[0];

  //Spinners
  spinner = new Spinner('%s');
  spinner.setSpinnerString(18);
  spinner.start();

  //Console Tables
  let tableOpts = {};
  tableOpts = {
    head: getTableHeader('long'),
  };

  if (compact) {
    if (hasAskedForCompact() || hasAskedForVeryCompact()) {
      tableOpts.head = getTableHeader('short');
    }
    tableOpts.chars = {
      mid: '',
      'left-mid': '',
      'mid-mid': '',
      'right-mid': '',
    };
  }
  return new Table(tableOpts);
}

function insert(pathString, status) {
  let directoryName = prettyPath(pathString);
  status.directory = directoryName;
  statuses.push(status);

  let methodName = colorForStatus(status);

  if (!((argv.attention || argv.a) && methodName === 'grey')) {
    table.push(
      C.columnsOrder.map((key) =>
        key === 'directory'
          ? directoryName
          : checkAndGetEmptyString(status, key, methodName)
      )
    );
  }
}

function checkAndGetEmptyString(status, key, methodName) {
  return chalk[methodName](status[key] || '-');
}

function simpleStatus(status) {
  //simple comma and newline separated output for machine readability
  let str = [];
  for (let i = 0; i < C.simple.length; i++) {
    str.push(status[C.simple[i]]);
  }
  printLine(str.join(','));
}

function simple(_statuses) {
  _statuses.forEach((status) => simpleStatus(status));
}

function finish() {
  spinner.stop();
  process.stdout.clearLine(); // clear current text
  process.stdout.cursorTo(0); // move cursor to beginning of line

  if (argv.sort) {
    table.sort((a, b) => a[0] - b[0]);
  }

  if (argv.simple || argv.s) {
    simple(statuses);
  } else {
    printLine(
      chalk.supportsColor
        ? table.toString()
        : chalk.stripColor(table.toString())
    );
  }
  if (compact) {
    let str = [];
    Object.keys(C.headers).map(function (key) {
      let header = C.headers[key];
      str.push(chalk.cyan(header.short) + ': ' + header.long);
    });
    if (!hasAskedForVeryCompact()) {
      printLine(str.join(', ') + '\n');
    }
  }
}

const listRepos = () => {
  table = init(dirs);
  printLine(chalk.green(cwd));

  fs.readdir(cwd)
    .then((files) => files.map((file) => path.resolve(cwd, file)))
    .then((files) =>
      Promise.all(
        files.map((file) =>
          fs.stat(file).then((stat) => ({ file, stat }), printLine)
        )
      )
    )
    .then((statuses) =>
      processDirectory(statuses, { debug, insert, C, showGitOnly })
    )
    .then((statuses) => finish(statuses))
    .catch((err) => {
      throw err;
    });
};

listRepos();

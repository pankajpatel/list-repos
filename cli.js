#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table');
const _async = require('async');
const updateNotifier = require('update-notifier');

const theGit = require('git-state');
const { Spinner } = require('cli-spinner');
const argv = require('minimist')(process.argv.slice(2));

const pkg = require('./package');
const C = require('./src/constants');
const { printHelp, colorForStatus } = require('./src/functions');

const NOOP = () => {};

const linePrinter = console.log;
const showGitOnly = argv.gitonly || argv.g;
const dirs = argv._.length ? argv._ : [process.cwd()];
const debug = Boolean(argv.debug) ? linePrinter : NOOP;

let spinner = null;
let table = null;
let cwd = null;
let fileIndex = 0;
let statuses = [];
let compact = false;

updateNotifier({
  pkg: pkg,
  updateCheckInterval: C.updateInterval * C.daysMultiplier,
}).notify();

process.on('uncaughtException', (err) => {
  linePrinter(`Caught exception: ${err}`);
  process.exit();
});

if (argv.version || argv.v) {
  linePrinter(pkg.version);
  process.exit();
}

if (argv.help || argv.h) {
  printHelp(linePrinter);
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

function prettyPath(pathString) {
  let p = pathString.split(path.sep);
  return p[p.length - 1];
}

function processDirectory(stat, callback) {
  fileIndex++;
  let pathString = path.join(cwd, stat.file);
  if (stat.stat.isDirectory()) {
    debug(fileIndex, stat.file);
    theGit.isGit(pathString, function (isGit) {
      if (isGit) {
        theGit.check(pathString, function (e, gitStatus) {
          if (e) return callback(e);
          gitStatus.git = true;
          debug(stat.file, gitStatus);
          insert(pathString, gitStatus);
          return callback(null, true);
        });
      } else {
        const gitStatus = C.emptyGitStatus;
        debug(stat.file, gitStatus);
        if (!showGitOnly) {
          insert(pathString, gitStatus);
        }
        return callback(null, false);
      }
    });
  } else {
    debug(stat.file, false);
    return callback(null, false);
  }
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
  linePrinter(str.join(','));
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
    linePrinter(
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
      linePrinter(str.join(', ') + '\n');
    }
  }
}

const listRepos = () => {
  table = init(dirs);
  linePrinter(chalk.green(cwd));

  fs.readdir(cwd).then(
    (files) =>
      _async.map(
        files,
        function (file, statCallback) {
          fs.stat(path.join(cwd, file)).then(
            (stat) =>
              statCallback(null, {
                file: file,
                stat: stat,
              }),
            (err) => statCallback(err)
          );
        },
        function (err, statuses) {
          if (err) throw new Error(err);
          debug(statuses.length);
          _async.filter(statuses, processDirectory, () => finish(statuses));
        }
      ),
    (err) => {
      throw err;
    }
  );
};

listRepos();

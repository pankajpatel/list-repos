#!/usr/bin/env node

const fs = require("fs");
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table');
const _async = require('async');
const updateNotifier = require('update-notifier');

const theGit = require('git-state');
const Spinner = require('cli-spinner').Spinner;
const argv = require('minimist')(process.argv.slice(2))

const pkg = require('./package')
const C = require('./constants');
const helpers = require('./src/helpers');

const NOOP = () => {}

const showGitOnly = argv.gitonly || argv.g;
const dirs = argv._.length ? argv._ : [process.cwd()]
const debug = Boolean(argv.debug) ? console.log : NOOP;

let spinner = null;
let table = null;
let cwd = null;
let fileIndex = 0;
let statuses = [];
let compact = false;

updateNotifier({
  pkg: pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * C.updateInterval
}).notify();

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});

if (argv.version || argv.v) {
  version()
  process.exit()
}

if (argv.help || argv.h) {
  help()
  process.exit()
}

if (argv.compact) {
  compact = argv.compact;
} else if (argv.c) {
  compact = argv.c;
}

function version() {
  console.log(pkg.version)
  process.exit()
}

function hasAskedForCompact() {
  return compact && compact === 's';
}

function hasAskedForVeryCompact() {
  return compact && compact === 'so';
}

function help() {
  console.log(pkg.name, ' ', pkg.version)
  console.log(pkg.description)
  console.log('Usage:')
  console.log(`${pkg.name} [path] [options]`)
  console.log(helpers.optionsText)
  process.exit();
}

function getTableHeader(type, color) {
  if (!color) {
    color = 'cyan';
  }
  return C.columnsOrder.map(key => chalk[color](C.headers[key][type]))
}

function init() {
  //either passed from CLI or take the current directory
  cwd = dirs[0]

  //Spinners
  spinner = new Spinner('%s');
  spinner.setSpinnerString(18);
  spinner.start();

  //Console Tables
  let tableOpts = {};
  tableOpts = {
    head: getTableHeader('long')
  };

  if (compact) {
    if (hasAskedForCompact() || hasAskedForVeryCompact()) {
      tableOpts.head = getTableHeader('short');
    }
    tableOpts.chars = {
      'mid': '',
      'left-mid': '',
      'mid-mid': '',
      'right-mid': ''
    }
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
    debug(fileIndex, stat.file)
    theGit.isGit(pathString, function (isGit) {
      if (isGit) {
        theGit.check(pathString, function (e, gitStatus) {
          if (e) return callback(e);
          gitStatus.git = true;
          debug(stat.file, gitStatus)
          insert(pathString, gitStatus)
          return callback(null, true)
        })
      } else {
        const gitStatus = helpers.emptyGitStatus;
        debug(stat.file, gitStatus)
        if (!showGitOnly) {
          insert(pathString, gitStatus)
        }
        return callback(null, false)
      }
    })
  } else {
    debug(stat.file, false)
    return callback(null, false)
  }
}

function insert(pathString, status) {
  let directoryName = prettyPath(pathString);
  status.directory = directoryName;
  statuses.push(status)

  // @todo: refactor
  let methodName = status.dirty === 0
    ? status.ahead === 0
      ? status.untracked === 0
        ? 'grey'
        : 'yellow'
      : 'green'
    : 'red'

  if (!((argv.attention || argv.a) && (methodName === 'grey'))) {
    table.push(C.columnsOrder.map(key => key === 'directory'
      ? directoryName
      : checkAndGetEmptyString(status, key, methodName)
    ));
  }
}

function checkAndGetEmptyString(status, key, methodName) {
  return chalk[methodName](status[key] || '-');
}

function simpleStatus(status) {
  //simple comma and newline separated output for machine readability
  let str = [];
  for (let i = 0; i < C.simple.length; i++) {
    str.push(status[C.simple[i]])
  }
  console.log(str.join(','))
}

function simple() {
  for (let i = 0; i < statuses.length; i++) {
    simpleStatus(statuses[i])
  }
}

function finish() {
  spinner.stop();
  process.stdout.clearLine();  // clear current text
  process.stdout.cursorTo(0);  // move cursor to beginning of line

  if (argv.sort) {
    table.sort((a, b) => {
      if(a[0] < b[0]) { return -1; }
      if(a[0] > b[0]) { return 1; }
      return 0;
    })
  }

  if (argv.simple || argv.s) {
    simple();
  } else {
    if (!chalk.supportsColor) {
      console.log(chalk.stripColor(table.toString()));
    } else {
      console.log(table.toString());
    }
  }
  if (compact) {
    let str = [];
    Object.keys(C.headers).map(function (key) {
      let header = C.headers[key];
      str.push(chalk.cyan(header.short) + ': ' + header.long)
    })
    if (!hasAskedForVeryCompact()) {
      console.log(str.join(', ') + '\n')
    }

  }
}

table = init();
console.log(chalk.green(cwd))

fs.readdir(cwd, function (err, files) {
  if (err) {
    throw err;
  }
  _async.map(files, function (file, statCallback) {
    fs.stat(path.join(cwd, file), function (err, stat) {
      if (err) return statCallback(err);
      statCallback(null, {
        file: file,
        stat: stat
      })
    })
  }, function (err, statuses) {
    if (err) throw new Error(err);
    debug(statuses.length);
    _async.filter(statuses, processDirectory, function () {
      finish();
    })
  })
});

#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');
const UpdateNotifier = require('update-notifier');

const argv = require('minimist')(process.argv.slice(2));

const pkg = require('./package');
const C = require('./src/constants');
const {
  getHelp,
  prettyPath,
  stopSpinner,
  startSpinner,
  colorForStatus,
  processDirectory,
} = require('./src/functions');

const { initTable } = require('./src/functions/initTable');
const { getCompactness } = require('./src/functions/getCompactness');

const printLine = console.log;
const showGitOnly = argv.gitonly || argv.g;
const shouldShowHelp = argv.help || argv.h;
const shouldShowVersion = argv.version || argv.v;
const dirs = argv._.length ? argv._ : [process.cwd()];
const debug = Boolean(argv.debug) ? printLine : C.NOOP;

let table = null;
let statuses = [];
let compact = false;

UpdateNotifier({
  pkg: pkg,
  updateCheckInterval: C.updateInterval * C.daysMultiplier,
}).notify();

process.on('uncaughtException', (err) => {
  printLine(`Caught exception: ${err}`);
  process.exit();
});

if (shouldShowVersion) {
  printLine(pkg.version);
  process.exit();
}

if (shouldShowHelp) {
  printLine(getHelp());
  process.exit();
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
  return str.join(',');
}

const simple = (statuses) => statuses.map((status) => simpleStatus(status));

const finish = (compactness) => () => {
  process.stdout.clearLine(); // clear current text
  process.stdout.cursorTo(0); // move cursor to beginning of line

  if (argv.sort) {
    table.sort((a, b) => a[0] - b[0]);
  }

  if (argv.simple || argv.s) {
    printLine(simple(statuses).join('\n'));
  } else {
    printLine(
      chalk.supportsColor
        ? table.toString()
        : chalk.stripColor(table.toString())
    );
  }
  if (compactness !== C.COMPACTNESS_LEVELS.NONE) {
    let str = [];
    Object.keys(C.headers).map(function (key) {
      let header = C.headers[key];
      str.push(chalk.cyan(header.short) + ': ' + header.long);
    });
    if (compactness !== C.COMPACTNESS_LEVELS.HIGH) {
      printLine(str.join(', ') + '\n');
    }
  }
};

const listRepos = (_dirs) => {
  const spinner = startSpinner();
  const compactness = getCompactness(argv);

  table = initTable(compactness);
  const [cwd] = _dirs;
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
    .then((statuses) => {
      stopSpinner(spinner);
      return finish(compactness)(statuses);
    })
    .catch((err) => {
      throw err;
    });
};

listRepos(dirs);

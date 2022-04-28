#!/usr/bin/env node

import path from 'path';
import fs from 'fs/promises';
import Table from 'cli-table';
import minimist from 'minimist';
import UpdateNotifier from 'update-notifier';
import chalk, { ForegroundColor } from 'chalk';

import {
  getHelp,
  stopSpinner,
  startSpinner,
  colorForStatus,
  processDirectories,
} from './functions';
import C from './constants';
import { name, version } from '../package.json';
import { initTable } from './functions/initTable';
import { getCompactness } from './functions/getCompactness';

const argv = minimist(process.argv.slice(2));

const printLine = console.log;
const showGitOnly = argv.gitonly || argv.g;
const shouldShowHelp = argv.help || argv.h;
const shouldShowVersion = argv.version || argv.v;
const dirs = argv._.length ? argv._ : [process.cwd()];
const debug = Boolean(argv.debug) ? printLine : C.NOOP;

let table: Table;
const statuses: ExtendedGitStatus[] = [];

UpdateNotifier({
  pkg: { name, version },
  updateCheckInterval: C.updateInterval * C.daysMultiplier,
}).notify();

process.on('uncaughtException', (err) => {
  printLine(`Caught exception: ${err}`);
  process.exit();
});

if (shouldShowVersion) {
  printLine(version);
  process.exit();
}

if (shouldShowHelp) {
  printLine(getHelp());
  process.exit();
}

const pushToTable = (status: ExtendedGitStatus) => {
  if (showGitOnly && !status.git) {
    return;
  }
  const methodName = colorForStatus(status);

  if (!((argv.attention || argv.a) && methodName === 'grey')) {
    table.push(
      C.columnsOrder.map((key) =>
        key === 'directory'
          ? status.directory
          : checkAndGetEmptyString(status, key, methodName)
      )
    );
  }
};

function insertStatuses(statuses: ExtendedGitStatus[]) {
  statuses.map((status) => pushToTable(status));
}

function checkAndGetEmptyString(
  status: ExtendedGitStatus,
  key: keyof ExtendedGitStatus,
  methodName: typeof ForegroundColor
) {
  return chalk[methodName](status[key] || '-');
}

function simpleStatus(status: ExtendedGitStatus) {
  //simple comma and newline separated output for machine readability
  const str = [];
  for (let i = 0; i < C.simple.length; i++) {
    str.push(status[C.simple[i]]);
  }
  return str.join(',');
}

const simple = (statuses: Array<ExtendedGitStatus>) =>
  statuses.map((status: ExtendedGitStatus) => simpleStatus(status));

const finish = (compactness: string) => () => {
  process.stdout.clearLine(0); // clear current text
  process.stdout.cursorTo(0); // move cursor to beginning of line

  if (argv.sort) {
    table.sort((a, b) => a[0] - b[0]);
  }

  if (argv.simple || argv.s) {
    printLine(simple(statuses).join('\n'));
  } else {
    printLine(table.toString());
  }
  if (compactness !== C.COMPACTNESS_LEVELS.NONE) {
    const str: string[] = [];
    Object.keys(C.headers).map((key: string) => {
      const header = C.headers[key as TableHeader];
      str.push(chalk.cyan(header.short) + ': ' + header.long);
    });
    if (compactness !== C.COMPACTNESS_LEVELS.HIGH) {
      printLine(str.join(', ') + '\n');
    }
  }
};

const listRepos = (_dirs: string[]) => {
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
          fs.stat(file).then(
            (stat: Stat['stat']): Stat => ({ file, stat }),
            () => ({ file, stat: null })
          )
        )
      )
    )
    .then((statuses: Stat[]) => processDirectories(statuses))
    .then((statuses) => insertStatuses(statuses))
    .then(() => stopSpinner(spinner))
    .then(() => finish(compactness)())
    .catch((err) => {
      throw err;
    });
};

listRepos(dirs);

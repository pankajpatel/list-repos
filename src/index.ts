#!/usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import fs from 'fs/promises';
import Table from 'cli-table';
import minimist from 'minimist';
import UpdateNotifier from 'update-notifier';

import {
  getHelp,
  stopSpinner,
  startSpinner,
  processDirectories,
} from './functions';
import C, { SORT_DIRECTIONS, SORT_FUNCTIONS } from './constants';
import { name, version } from '../package.json';
import { initTable } from './functions/initTable';
import { getCompactness } from './functions/getCompactness';
import { pushToTable } from './functions/pushToTable';

const argv = minimist(process.argv.slice(2));

const printLine = console.log;
const showGitOnly = argv.gitonly || argv.g;
const shouldShowHelp = argv.help || argv.h;
const needsAttention = argv.attention || argv.a;
const shouldShowVersion = argv.version || argv.v;
const shouldShowSimpleOutput = argv.simple || argv.s;
const dirs = argv._.length ? argv._ : [process.cwd()];
const shouldSort = Boolean(argv.sort);
const sortDirection: string =
  shouldSort && typeof argv.sort === 'string' ? argv.sort : SORT_DIRECTIONS.ASC;
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

function getLineForSimpleStatus(status: ExtendedGitStatus) {
  //simple comma and newline separated output for machine readability
  const str = [];
  for (let i = 0; i < C.simple.length; i++) {
    str.push(status[C.simple[i]]);
  }
  return str.join(',');
}

const prepareSimpleOutput = (statuses: Array<ExtendedGitStatus>) =>
  statuses.map((status: ExtendedGitStatus) => getLineForSimpleStatus(status));

const finish = (compactness: string) => () => {
  process.stdout.clearLine(0); // clear current text
  process.stdout.cursorTo(0); // move cursor to beginning of line

  if (shouldSort) {
    table.sort(SORT_FUNCTIONS[sortDirection]);
  }

  if (shouldShowSimpleOutput) {
    printLine(prepareSimpleOutput(statuses).join('\n'));
  } else {
    printLine(table.toString());
  }
  // Table header abbreviations
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
    .then((statuses) => {
      statuses.map((status) =>
        pushToTable(table, { showGitOnly, needsAttention })(status)
      );
    })
    .then(() => stopSpinner(spinner))
    .then(() => finish(compactness)())
    .catch((err) => {
      throw err;
    });
};

listRepos(dirs);

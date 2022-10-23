#!/usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import fs from 'fs/promises';
import Table from 'cli-table';

import {
  getHelp,
  stopSpinner,
  startSpinner,
  processDirectories,
} from './functions';
import { version } from '../package.json';
import { initTable } from './functions/initTable';
import { getCommandOptions } from './functions/getCommandOptions';
import { notifyUpdate } from './functions/notifyUpdate';
import { finish } from './functions/finish';

const printLine = console.log;
const cmdOptions = getCommandOptions(process.argv, process.cwd());

notifyUpdate();

process.on('uncaughtException', (err) => {
  printLine(`Caught exception: ${err}`);
  process.exit();
});

if (cmdOptions.shouldShowVersion) {
  printLine(version);
  process.exit();
}

if (cmdOptions.shouldShowHelp) {
  printLine(getHelp());
  process.exit();
}

const readDirAndBuildStats = (dir: string, ignore?: string | RegExp) =>
  Promise.resolve()
    .then(() => fs.readdir(dir))
    .then((files) =>
      ignore ? files.filter((file) => !file.match(ignore)) : files
    )
    .then((files) => files.map((file) => path.resolve(dir, file)))
    .then((files) =>
      Promise.all(
        files.map((file) =>
          fs.stat(file).then(
            (stat: FSStat): Stat => ({ path: file, stat }),
            () => ({ path: file, stat: null })
          )
        )
      )
    );

const listRepos = (options: CommandOptions) => {
  const { compactness, cwd, ignore } = options;
  const statuses: ExtendedGitStatus[] = [];

  const spinner = startSpinner();
  const table: Table = initTable(compactness);

  return Promise.resolve()
    .then(() => printLine(chalk.green(cwd)))
    .then(() => readDirAndBuildStats(cwd, ignore))
    .then(processDirectories)
    .then((_statuses) => statuses.push(..._statuses))
    .then(() => stopSpinner(spinner))
    .then(() => finish(options)(statuses, table))
    .then((t) => printLine(t.join('').toString()))
    .catch((err) => {
      throw err;
    });
};

listRepos(cmdOptions);

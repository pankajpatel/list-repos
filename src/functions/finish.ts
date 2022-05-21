import Table from 'cli-table';
import { clearCli } from './clearCli';
import { pushToTable } from './pushToTable';
import { SORT_FUNCTIONS } from '../constants';
import { getLineForSimpleStatus } from './getLineForSimpleStatus';
import { printHeaderAbbreviations } from './printHeaderAbbreviations';

const prepareSimpleOutput = (statuses: Array<ExtendedGitStatus>) =>
  statuses
    .map((status: ExtendedGitStatus) => getLineForSimpleStatus(status))
    .join('\n');

const prepareTableOutput = (
  table: Table,
  statuses: ExtendedGitStatus[],
  options: CommandOptions
): string => {
  statuses.map((status) => pushToTable(table, options)(status));

  if (options.shouldSort) {
    table.sort(
      SORT_FUNCTIONS[options.sortDirection as string] || SORT_FUNCTIONS.ASC
    );
  }

  return table.toString();
};

export const finish =
  (options: CommandOptions) =>
  (statuses: ExtendedGitStatus[], table: Table): Array<string> => {
    clearCli(process);

    return [
      options.shouldShowSimpleOutput
        ? prepareSimpleOutput(statuses)
        : prepareTableOutput(table, statuses, options),
      // Table header abbreviations
      printHeaderAbbreviations(options.compactness),
    ];
  };

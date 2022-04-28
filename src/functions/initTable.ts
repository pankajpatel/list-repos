import chalk, { ForegroundColor } from 'chalk';
import Table from 'cli-table';

import constants, { COMPACTNESS_LEVELS } from '../constants';

export const getTableHeader = (
  type: TableHeaderType,
  color: typeof ForegroundColor = constants.defaultHeaderColor
) =>
  constants.columnsOrder.map((key: TableHeader) =>
    chalk[color](constants.headers[key][type])
  );

export const initTable = (compactness: string) => {
  const tableOpts: Record<
    string,
    | string
    | boolean
    | undefined
    | string[]
    | Record<string, string | boolean | undefined>
  > = {
    head: getTableHeader('long'),
  };

  if (compactness !== COMPACTNESS_LEVELS.NONE) {
    tableOpts.head =
      compactness !== COMPACTNESS_LEVELS.LOW
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

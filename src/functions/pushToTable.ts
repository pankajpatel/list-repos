import Table from 'cli-table';
import chalk, { ForegroundColor } from 'chalk';

import constants from '../constants';
import { colorForStatus } from './colorForStatus';

function checkAndGetEmptyString(
  status: ExtendedGitStatus,
  key: keyof ExtendedGitStatus,
  methodName: typeof ForegroundColor
) {
  return chalk[methodName](status[key] || '-');
}

export const pushToTable =
  (table: Table, options: CommandOptions) => (status: ExtendedGitStatus) => {
    if (options.showGitOnly && !status.git) {
      return;
    }
    const methodName = colorForStatus(status);

    if (!(options.needsAttention && methodName === 'grey')) {
      table.push(
        constants.columnsOrder.map((key) =>
          key === 'displayPath'
            ? status.displayPath
            : checkAndGetEmptyString(status, key, methodName)
        )
      );
    }
  };

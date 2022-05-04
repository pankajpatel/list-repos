import chalk from 'chalk';
import constants, { COMPACTNESS_LEVELS } from '../constants';

export const printHeaderAbbreviations = (compactness: string): string => {
  if (compactness !== COMPACTNESS_LEVELS.NONE) {
    const str: string[] = [];
    Object.keys(constants.headers).map((key: string) => {
      const header = constants.headers[key as TableHeader];
      str.push(chalk.cyan(header.short) + ': ' + header.long);
    });
    if (compactness !== COMPACTNESS_LEVELS.HIGH) {
      return str.join(', ') + '\n';
    }
  }
  return '';
};

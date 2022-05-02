import pkg from '../../package.json';
import { optionsText } from '../constants';

export function getHelp() {
  const lines = [
    `${pkg.name} ${pkg.version}`,
    pkg.description,
    'Usage:',
    `${pkg.name} [path] [options]`,
    optionsText,
  ];
  return lines.join('\n');
}

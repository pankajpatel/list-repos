import { COMPACTNESS_LEVELS } from '../constants';

export const getCompactness = (
  cliArgs: Record<string, boolean | string | undefined>
): string => {
  const compact = cliArgs.compact || cliArgs.c;

  switch (compact) {
    case 's':
      return COMPACTNESS_LEVELS.MEDIUM;
    case 'so':
      return COMPACTNESS_LEVELS.HIGH;
    case true:
      return COMPACTNESS_LEVELS.LOW;
    default:
      return COMPACTNESS_LEVELS.NONE;
  }
};

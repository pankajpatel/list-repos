import C from '../constants';

export const getCompactness = (
  cliArgs: Record<string, boolean | string | undefined>
) => {
  const compact = cliArgs.compact || cliArgs.c;

  switch (compact) {
    case 's':
      return C.COMPACTNESS_LEVELS.MEDIUM;
    case 'so':
      return C.COMPACTNESS_LEVELS.HIGH;
    case true:
      return C.COMPACTNESS_LEVELS.LOW;
    default:
      return C.COMPACTNESS_LEVELS.NONE;
  }
};
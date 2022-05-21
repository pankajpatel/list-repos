import constants from '../constants';

//simple comma and newline separated output for machine readability
export const getLineForSimpleStatus = (status: ExtendedGitStatus): string =>
  constants.simple
    .map((key: string) => status[key as keyof ExtendedGitStatus])
    .join(',');

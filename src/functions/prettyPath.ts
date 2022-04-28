import path from 'path';

export const prettyPath = (pathString: string): string => {
  const p = pathString.split(path.sep);
  return p[p.length - 1];
};

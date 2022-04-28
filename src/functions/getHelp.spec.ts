import { getHelp } from './getHelp';

describe('getHelp()', () => {
  it('should run the passed printer function', () => {
    expect(getHelp()).toBeTruthy();
  });
});

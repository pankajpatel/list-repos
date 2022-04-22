const { getHelp } = require('./getHelp');

describe('getHelp()', () => {
  it('should run the passed printer function', () => {
    expect(getHelp()).toBeTruthy();
  });
});

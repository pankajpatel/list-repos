const { printHelp } = require('./printHelp');

describe('printHelp()', () => {
  it('should run the passed printer function', () => {
    const printer = jest.fn();

    printHelp(printer);
    expect(printer).toHaveBeenCalled();
  });
});

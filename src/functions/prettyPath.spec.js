const { prettyPath } = require('./prettyPath');

describe('prettyPath()', () => {
  it('should return last segment of path for file', () => {
    const name = prettyPath('/a/b/test.js');
    expect(name).toBe('test.js');
  });
  it('should return last segment of path for directory', () => {
    const name = prettyPath('/a/b/testing');
    expect(name).toBe('testing');
  });
});

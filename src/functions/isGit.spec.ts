/* eslint-disable @typescript-eslint/no-var-requires */

describe('isGit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when lib returned true', async () => {
    jest.mock('git-state', () => ({
      isGit: jest.fn((file, callback) => callback(true)),
    }));

    const { isGit } = require('./isGit');

    const response = await isGit('somePath');
    expect(response).toBe(true);
  });
});

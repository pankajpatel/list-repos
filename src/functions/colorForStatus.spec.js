const { colorForStatus, COLORS } = require('./colorForStatus');

describe('colorForStatus()', () => {
  it('should return default color', () => {
    const color = colorForStatus({});
    expect(color).toBe(COLORS.GREY);
  });
});

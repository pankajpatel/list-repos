import { colorForStatus, COLORS } from './colorForStatus';

describe('colorForStatus()', () => {
  it('should return default color', () => {
    const color = colorForStatus({} as GitStatus);
    expect(color).toBe(COLORS.GREY);
  });
});

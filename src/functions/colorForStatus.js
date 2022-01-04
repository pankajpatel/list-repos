const COLORS = {
  RED: 'red',
  GREEN: 'green',
  YELLOW: 'yellow',
  GREY: 'grey',
};

const colorForStatus = (state) => {
  if (state.dirty) return COLORS.RED;
  if (state.ahead) return COLORS.GREEN;
  if (state.untracked) return COLORS.YELLOW;
  return COLORS.GREY;
};

module.exports = {
  colorForStatus: colorForStatus,
  COLORS: COLORS,
};

const { Spinner } = require('cli-spinner');

const startSpinner = () => {
  const spinner = new Spinner('%s');
  spinner.setSpinnerString(18);
  spinner.start();
  return spinner;
};

const stopSpinner = (spinner) => {
  spinner.stop();
};

module.exports = {
  startSpinner,
  stopSpinner,
};

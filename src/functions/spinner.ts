import { Spinner } from 'cli-spinner';

export const startSpinner = () => {
  const spinner = new Spinner('%s');
  spinner.setSpinnerString(18);
  spinner.start();
  return spinner;
};

export const stopSpinner = (spinner: Spinner) => {
  spinner.stop();
};

import UpdateNotifier from 'update-notifier';

import constants from '../constants';
import { name, version } from '../../package.json';

export const notifyUpdate = () => {
  UpdateNotifier({
    pkg: { name, version },
    updateCheckInterval: constants.updateInterval * constants.daysMultiplier,
  }).notify();
};

import moment from 'moment';
import {toLower} from 'ramda';

import {isSameOrBeforeMinutes} from './isSameOrBeforeMinutes';

export function shouldWakeUpOrSleep(type = 'MoneypennyAwake', instance) {
  const currentDay = moment().utc().format('dddd').toLowerCase();
  const moneyPennyDays = (instance.MoneypennyDays === '*') ? instance.MoneypennyDays : instance.MoneypennyDays.split(',').map(toLower);

  debugger;

  if (instance.MoneypennyWeekendMode === 'yes' && (currentDay === 'saturday' || currentDay === 'sunday')) return false;
  else if (instance.MoneypennyWeekendMode === 'yes' && currentDay === 'monday' && isSameOrBeforeMinutes(14, new Date(), instance[type])) return true;
  else if (instance.MoneypennyWeekendMode === 'yes' && currentDay === 'friday' && isSameOrBeforeMinutes(14, new Date(), instance[type])) return true;
  else if (moneyPennyDays === '*' && isSameOrBeforeMinutes(14, new Date(), instance[type])) return true;
  else if (moneyPennyDays.length && moneyPennyDays.indexOf(currentDay) > -1 && isSameOrBeforeMinutes(14, new Date(), instance[type])) return true;

  return false;
}

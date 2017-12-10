import moment from 'moment';

export function isSameOrBeforeMinutes(window = 14, windowTime, specifiedTime) {
  const roundedDownEndTimeMinutes = Math.floor(moment.utc(windowTime).minute() / 15) * 15;

  const moneypennyTime = moment.utc().hours(specifiedTime.split(':')[0]).minutes(specifiedTime.split(':')[1]);
  const currentTime = moment.utc(windowTime).minutes(roundedDownEndTimeMinutes);
  windowTime = moment.utc(currentTime).minutes(roundedDownEndTimeMinutes).subtract(window, 'minutes');

  debugger;

  let aa1 = moneypennyTime.isSameOrBefore(currentTime, 'minute');

  debugger;

  let aa2 = moneypennyTime.isSameOrAfter(windowTime, 'minute');

  debugger;

  return moneypennyTime.isSameOrBefore(currentTime, 'minute') && moneypennyTime.isSameOrAfter(windowTime, 'minute');
};

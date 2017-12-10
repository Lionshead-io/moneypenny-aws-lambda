import { curry, last, pipeP, tap } from 'ramda';
import AwsResourceFactory from './factories/AwsResourceFactory';
import { shouldWakeUpOrSleep } from './helpers/shouldWakeUp';

exports.main = (event, context, callback) => {
  console.log('Moneypenny: ', Date.now());

  monneypenny().then(res => callback(res), err => console.log(err, 'err'));
};

// TODO: Fix defect regarding windowTime & monneypennyTime
function monneypenny(resourceType = 'ec2') {
  const getRegions = ['us-east-1', 'us-east-2'];

  async function startStopInstancesByRegion(regions, accResults = {}) {
    if (!regions.length) return accResults;

    const currentRegion = last(regions.splice(0, 1));
    const awsResource = AwsResourceFactory.resource(resourceType);
    const awsSdkInstance = AwsResourceFactory.awsInstance(resourceType, currentRegion);
    const startInstancesCurried = curry(awsResource.startInstances)(awsSdkInstance);
    const stopInstancesCurried = curry(awsResource.stopInstances)(awsSdkInstance);

    const moneypennyInstances = await awsResource.getInstancesByRegion(currentRegion);

    debugger;

    accResults[currentRegion] = moneypennyInstances.Reservations
      .reduce((acc, currVal) => acc.concat(currVal.Instances), [])
      .map(currVal => {
        const tags = currVal.Tags.reduce((acc, currVal) => {
          return Object.assign({}, acc, currVal);
        }, {});

        return {
          InstanceId: currVal.InstanceId,
          MoneypennyDays: tags.MoneypennyDays || process.env.MoneypennyDays,
          MoneypennyWeekendMode: tags.MoneypennyWeekendMode || process.env.MoneypennyWeekendMode,
          MoneypennyAwake: tags.MoneypennyAwake || process.env.MoneypennyAwake,
          MoneypennySleep: tags.MoneypennySleep || process.env.MoneypennySleep
        };
      })
      .reduce((acc, currVal) => {
        // If instance needs to be woken up, push it to awake[]
        if (shouldWakeUpOrSleep(undefined, currVal)) {
          acc.awake.push(currVal.InstanceId);
        }

        // If instances needs to be put to sleep, push the InstanceId to sleep[]
        if (shouldWakeUpOrSleep('MoneypennySleep', currVal)) {
          acc.sleep.push(currVal.InstanceId);
        }

        return acc;
      }, { awake: [], sleep: [] });

    // Check to see if there are any instances within the accResults[currentRegion].awake array, if there are, call startInstances
    if (accResults[currentRegion].awake.length) await startInstancesCurried(accResults[currentRegion].awake);

    // Check to see if there are any instances within the accResults[currentRegion].sleep array, if there are, call stopInstances
    if (accResults[currentRegion].sleep.length) await stopInstancesCurried(accResults[currentRegion].sleep);

    return startStopInstancesByRegion(regions, accResults);
  }

  return startStopInstancesByRegion(getRegions)
}

exports.main({}, {}, (res) => console.log(res));

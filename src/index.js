import AWS from 'aws-sdk';
import _ from 'lodash';

const ec2 = new AWS.EC2({
  region: 'us-east-1',
  apiVersion: '2016-11-15'
});

exports.main = (event, context, callback) => {
  console.log('Moneypenny: ', Date.now());

  getMoneypennyManagedInstances().then(res => {
    console.log(JSON.stringify(res), 'result');

    callback(null, res);
  }, (err) => console.log(err));
};

function getMoneypennyManagedInstances() {
  const params = {
    Filters: [
      {
        Name: 'tag:Moneypenny',
        Values: [
          'managed'
        ]
      },
    ]
  };

  return new Promise((resolve, reject) => {
    ec2.describeInstances(params, function(err, data) {
      if (err) reject(err);
      else     resolve(data);
    });
  });
}

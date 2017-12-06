import AWS from 'aws-sdk';
import _ from 'lodash';

const ec2 = new AWS.EC2({
  apiVersion: '2016-11-15'
});

exports.main = (event, context, callback) => {
  console.log('Moneypenny: ', Date.now());

  getMoneypennyManagedInstances().then(res => {
    console.log(res, 'result');

    callback(null, res);
  });
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

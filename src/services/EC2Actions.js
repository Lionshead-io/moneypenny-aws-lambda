import AWS from 'aws-sdk';

export default class EC2Actions {

  static startInstances(ec2, InstanceIds) {
    const params = {
      InstanceIds
    };

    return new Promise((resolve, reject) => {
      ec2.startInstances(params, function (err, data) {
        if (err) reject(err);
        else     resolve(data);
      });
    });
  }

  static stopInstances(ec2, InstanceIds) {
    const params = {
      InstanceIds
    };

    return new Promise((resolve, reject) => {
      ec2.stopInstances(params, function (err, data) {
        if (err) reject(err);
        else     resolve(data);
      });
    });
  }

  static getInstancesByRegion(region) {
    const ec2 = new AWS.EC2({
      region: region,
      apiVersion: '2016-11-15'
    });

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
      ec2.describeInstances(params, function (err, data) {
        if (err) reject(err);
        else     resolve(data);
      });
    });
  }
}

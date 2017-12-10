export default class RDSActions {
  static async startInstances(rds, InstanceIds) {
    return await Promise.all(InstanceIds.map((currVal) => {
      const params = {
        DBInstanceIdentifier: currVal
      };

      return new Promise((resolve, reject) => {
        rds.startDBInstance(params, function(err, data) {
          if (err) reject(err);
          else     resolve(data);
        });
      });
    }));
  }

  static async stopInstances(rds, InstanceIds) {
    return await Promise.all(InstanceIds.map((currVal) => {
      const params = {
        DBInstanceIdentifier: currVal
      };

      return new Promise((resolve, reject) => {
        rds.stopDBInstance(params, function(err, data) {
          if (err) reject(err);
          else     resolve(data);
        });
      });
    }));
  }

  static getInstancesByRegion(region) {
    const rds = new AWS.RDS({
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
      rds.describeDBInstances(params, function (err, data) {
        if (err) reject(err);
        else     resolve(data);
      });
    });
  }
}

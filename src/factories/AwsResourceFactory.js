import AWS from 'aws-sdk';
import EC2Actions from '../services/EC2Actions';
import RDSActions from '../services/RDSActions';

export default {
  resource: function (resourceType) {
    switch (resourceType) {
      case 'ec2': {
        return EC2Actions;
      }
      case 'rds': {
        return RDSActions;
      }
      default:
        return EC2Actions;
    }
  },
  awsInstance: function (resourceType, region) {
    switch (resourceType) {
      case 'ec2': {
        return new AWS.EC2({
          region: region,
          apiVersion: '2016-11-15'
        });
      }
      case 'rds': {
        return new AWS.RDS({
          region: region,
          apiVersion: '2016-11-15'
        });
      }
      default:
        return EC2Actions;
    }
  }
};

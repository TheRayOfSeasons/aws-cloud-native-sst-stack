import { SSTConfig } from 'sst';
import { MainStack } from './stacks/MainStack';

export default {
  config(_input) {
    return {
      name: 'aws-cloud-native-sst-stack',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(MainStack);
    if (app.stage !== 'prod') {
      app.setDefaultRemovalPolicy('destroy');
    }
  }
} satisfies SSTConfig;

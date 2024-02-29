import { AuthHandler } from 'sst/node/auth';
import { CognitoAdapter } from './adapter';

export const handler = AuthHandler({
  providers: {
    cognito: CognitoAdapter(),
  },
});

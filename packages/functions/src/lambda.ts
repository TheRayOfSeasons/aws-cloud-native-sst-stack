import { useSession } from 'sst/node/auth';
import { createHandler } from './utils/handler.helpers';

export const handler = createHandler({
  handler: async () => {
    const session = useSession();
    return {
      statusCode: 200,
      body: JSON.stringify(session)
    };
  }
});

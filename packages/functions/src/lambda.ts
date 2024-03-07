import { ApiHandler } from 'sst/node/api';
import { useSession } from 'sst/node/auth';

export const handler = ApiHandler(async (_evt) => {
  const session = useSession();
  return {
    statusCode: 200,
    body: JSON.stringify(session)
  };
});

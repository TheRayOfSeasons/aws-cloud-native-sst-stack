import { useSession, type SessionTypes } from 'sst/node/auth';
import type { Middleware, BeforeMiddlewareFunction } from './types';

export type Options = {
  allowedUserTypes: (keyof SessionTypes)[];
}

export const authMiddleware = (options: Options): Middleware => {
  const before: BeforeMiddlewareFunction = async () => {
    const session = useSession();
    if (!options.allowedUserTypes.includes(session.type)) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Unauthorized',
        }),
      };
    }
  }

  return {
    before,
  }
}

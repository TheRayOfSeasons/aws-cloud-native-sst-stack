import { useJsonBody } from 'sst/node/api';
import { z } from 'zod';
import type { Middleware, BeforeMiddlewareFunction } from './types';

export type Options<T extends z.ZodType> = {
  schema: T
}

export const bodyValidator = <T extends z.ZodType>(options: Options<T>): Middleware => {
  const before: BeforeMiddlewareFunction = async () => {
    const body = useJsonBody();
    try {
      options.schema.parse(body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Received invalid request body.',
        }),
      };
    }
  }

  return {
    before,
  }
}

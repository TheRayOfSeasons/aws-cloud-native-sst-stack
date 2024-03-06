import { Handler } from 'sst/context/handler';
import { type Options as AuthOptions, authMiddleware } from '../middleware/auth-middleware';
import { type Options as BodyOptions, bodyValidator } from '../middleware/body-validator';
import { z } from 'zod';
import { wrapMiddleware } from 'src/middleware/core';

export type Options<T extends z.ZodType> = {
  auth?: AuthOptions
  body?: BodyOptions<T>
  handler: Parameters<typeof Handler<'api'>>[1]
}

export function createHandler<T extends z.ZodType>(options: Options<T>) {
  const wrapper = wrapMiddleware(options.handler);
  if (options.auth) {
    wrapper.use(authMiddleware(options.auth));
  }
  if (options.body) {
    wrapper.use(bodyValidator(options.body));
  }
  return wrapper.handler;
}

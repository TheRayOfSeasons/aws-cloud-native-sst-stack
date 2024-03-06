import { Handler } from 'sst/context/handler';
import type { Middleware } from './types';
import { ApiHandler } from 'sst/node/api';

export const wrapMiddleware = (handler: Parameters<typeof Handler<'api'>>[1]) => {
  const middlewares: Middleware[] = [];
  const wrappedHandler = ApiHandler(async (event, context) => {
    for (const middleware of middlewares) {
      if (middleware.before) {
        const errorResponse = await middleware.before(event, context);
        if (errorResponse) {
          return errorResponse;
        }
      }
    }
    let response = await handler(event, context);
    for (const middleware of middlewares) {
      if (middleware.after) {
        const modifiedResponse = await middleware.after({
          event,
          context,
          response,
        });
        if (modifiedResponse) {
          response = modifiedResponse;
        }
      }
    }
    return response;
  });

  return {
    handler: wrappedHandler,
    use(middleware: Middleware) {
      middlewares.push(middleware);
      return this;
    },
  }
}

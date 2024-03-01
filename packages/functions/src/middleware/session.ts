import { Handler } from 'sst/context/handler';
import { ApiHandler } from 'sst/node/api';
import { APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { useSession, type SessionTypes } from 'sst/node/auth';

export type Options = {
  authorizedUsers: (keyof SessionTypes)[];
}

export function AuthorizedHandler(
  callback: Parameters<typeof Handler<"api">>[1],
  options: Options
): (event: APIGatewayProxyEventV2, context: Context) => Promise<APIGatewayProxyStructuredResultV2> {
  const handler = ApiHandler(async (evt, ctx) => {
    const session = useSession();
    if (!options.authorizedUsers.includes(session.type)) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Unauthorized',
        }),
      };
    }
    const response = await callback(evt, ctx);
    return response;
  });
  return handler;
}

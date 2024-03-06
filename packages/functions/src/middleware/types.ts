import type { APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2, Context } from 'aws-lambda';

export type BeforeMiddlewareFunction = (
  event: APIGatewayProxyEventV2,
  context: Context
) => Promise<APIGatewayProxyStructuredResultV2 | undefined>;

export type AfterMiddlewareFunction = ({
  event,
  context,
  response,
}: {
  event: APIGatewayProxyEventV2,
  context: Context,
  response: APIGatewayProxyStructuredResultV2 | void,
}) => Promise<APIGatewayProxyStructuredResultV2 | undefined>;

export interface Middleware {
  before?: BeforeMiddlewareFunction
  after?: AfterMiddlewareFunction
}

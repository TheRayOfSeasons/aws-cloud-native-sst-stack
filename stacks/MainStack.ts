import {
  Api,
  Auth,
  Cognito,
  EventBus,
  Table,
  StackContext,
  StaticSite,
} from "sst/constructs";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";

export function MainStack({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const todoTable = new Table(stack, "Notes", {
    fields: {
      id: "string",
      user: "string",
      title: "string",
      content: "string",
    },
    primaryIndex: {
      partitionKey: "id",
    },
  });

  const cognito = new Cognito(stack, 'cognito', {
    login: ['email'],
    cdk: {
      userPoolClient: {
        authFlows: {
          adminUserPassword: true,
          userPassword: true,
          userSrp: true,
        },
      },
    },
  });

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth/lambda.handler",
    },
  });

  const api = new Api(stack, "api", {
    cors: {
      allowMethods: [
        CorsHttpMethod.GET,
        CorsHttpMethod.POST,
      ],
    },
    defaults: {
      function: {
        bind: [
          bus,
          todoTable,
        ],
        environment: {
          COGNITO_IDENTITY_POOL_ID: cognito.cognitoIdentityPoolId || '',
          COGNITO_USER_POOL_ID: cognito.userPoolId || '',
          COGNITO_CLIENT_ID: cognito.userPoolClientId || '',
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /note/{id}": "packages/functions/src/note.get",
      "POST /note": "packages/functions/src/note.create",
    },
  });

  auth.attach(stack, {
    api,
    prefix: '/auth',
  });

  bus.subscribe("note.created", {
    handler: "packages/functions/src/events/note-created.handler",
  });

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebEndpoint: web.url,
    IdentityPoolId: cognito.cognitoIdentityPoolId,
    UserPoolId: cognito.userPoolId,
    UserPoolClientId: cognito.userPoolClientId,
  });
}

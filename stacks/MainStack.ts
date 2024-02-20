import {
  Api,
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

  const auth = new Cognito(stack, 'auth', {
    login: ["email"],
  });

  const authEnvironment = {
    COGNITO_USER_POOL_ID: auth.userPoolId,
    COGNITO_CLIENT_ID: auth.userPoolClientId,
  };

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
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "POST /auth": {
        function: "packages/functions/src/auth.auth",
        authorizer: "none",
        environment: authEnvironment,
      },
      "POST /register": {
        function: "packages/functions/src/auth.register",
        authorizer: "none",
        environment: authEnvironment,
      },
      "POST /change-password": {
        function: "packages/functions/src/auth.changePassword",
        authorizer: "none",
        environment: authEnvironment,
      },
      "GET /note/{id}": "packages/functions/src/note.get",
      "POST /note": "packages/functions/src/note.create",
    },
  });

  auth.attachPermissionsForAuthUsers(stack, [api]);

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
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });
}

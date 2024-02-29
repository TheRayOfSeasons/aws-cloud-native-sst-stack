import { createAdapter, Adapter, Session } from 'sst/node/auth';
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { Auth } from "@aws-cloud-native-sst-stack/core/auth";
import { useJsonBody, usePath } from 'sst/node/api';
import { z } from 'zod';

type AuthAction<T extends z.ZodType> = (body: z.infer<T>) => Promise<APIGatewayProxyStructuredResultV2>;

declare module 'sst/node/auth' {
  export interface SessionTypes {
    public: {},
    user: {
      CognitoAuthenticationResult: {
        AccessToken?: string
        ExpiresIn?: number
        IdToken?: string
        RefreshToken?: string
        TokenType?: string
      },
      userId: string
      email: string
    };
  }
}

const createAction = <T extends z.ZodType>({
  schema,
  callback
}: {
  schema: T,
  callback: AuthAction<T>
}): AuthAction<T> => {
  return async (body: z.infer<typeof schema>) => {
    try {
      schema.parse(body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Received invalid request body.',
        }),
      };
    }
    let response: APIGatewayProxyStructuredResultV2;
    try {
      response = await callback(body);
    } catch (error) {
      return {
        //@ts-ignore
        statusCode: error?.$metadata?.httpStatusCode || 500,
        body: JSON.stringify({
          //@ts-ignore
          error: error?.message || error?.Message || error?.errorMessage || 'Internal Server Error',
        }),
      };
    }
    return response;
  }
}

const actions: Record<string, AuthAction<any | z.ZodType>> = {
  auth: createAction({
    schema: z.object({
      email: z.string(),
      password: z.string(),
    }),
    callback: async (body) => {
      const response = await Auth.login(body);
      const cognitoAccessToken = response.AuthenticationResult?.AccessToken || '';
      if (response.AuthenticationResult?.AccessToken) {
        const user = await Auth.getCurrentUser(cognitoAccessToken);
        const email = user.UserAttributes?.find((attr) => attr.Name === 'email')?.Value || '';
        const userId = user.Username || '';
        const token = Session.create({
          type: 'user',
          properties: {
            CognitoAuthenticationResult: response.AuthenticationResult,
            email,
            userId,
          },
        });
        return {
          statusCode: 200,
          body: JSON.stringify({
            token,
            email,
          }),
        }
      }
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    },
  }),
  register: createAction({
    schema: z.object({
      email: z.string(),
      password: z.string(),
    }),
    callback: async (body) => {
      const response = await Auth.register(body);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    },
  }),
  confirm: createAction({
    schema: z.object({
      email: z.string(),
      code: z.string(),
    }),
    callback: async (body) => {
      const response = await Auth.confirmSignUpCommand(body);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    },
  }),
  forgotPassword: createAction({
    schema: z.object({
      email: z.string(),
    }),
    callback: async ({ email }) => {
      const response = await Auth.forgotPassword(email);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    },
  }),
  confirmForgotPassword: createAction({
    schema: z.object({
      email: z.string(),
      code: z.string(),
      newPassword: z.string(),
    }),
    callback: async (body) => {
      const response = await Auth.confirmForgotPassword(body);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }
  }),
};

const adapter: Adapter = async () => {
  const [key] = usePath().slice(-1);
  const body = useJsonBody();
  const action = actions[key];
  if (!action) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Action /${key} not found.`,
      }),
    }
  }
  const response = await action(body);
  return response;
}

export const CognitoAdapter = createAdapter(() => adapter);

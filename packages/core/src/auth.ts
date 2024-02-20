export * as Auth from "./note";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || '';
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';

type Credentials = {
  email: string,
  password: string
};

export const login = async (credentials: Credentials) => {
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: credentials.email,
      PASSWORD: credentials.password,
    },
    ClientId: COGNITO_CLIENT_ID,
  });
  const response = await client.send(command);
  return response;
}

export const register = async ({
  email,
  password,
}: Credentials) => {
  const command = new SignUpCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
  });
  const response = await client.send(command);
  return response;
}

export const adminChangePassword = async ({
  email,
  password,
}: Credentials) => {
  const command = new AdminSetUserPasswordCommand({
    UserPoolId: COGNITO_USER_POOL_ID,
    Username: email,
    Password: password,
    Permanent: false,
  });
  const response = await client.send(command);
  return response;
}

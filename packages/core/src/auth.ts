import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  ResendConfirmationCodeCommand,
  type InitiateAuthCommandOutput,
  type SignUpCommandOutput,
  type ResendConfirmationCodeCommandOutput,
  type ConfirmSignUpCommandOutput,
  type ForgotPasswordCommandOutput,
  GetUserCommandOutput
} from '@aws-sdk/client-cognito-identity-provider';
export * as Auth from './auth';

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? 'us-east-1'
});
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID ?? '';

interface Credentials {
  email: string
  password: string
}

export const login = async (credentials: Credentials): Promise<InitiateAuthCommandOutput> => {
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: credentials.email,
      PASSWORD: credentials.password
    },
    ClientId: COGNITO_CLIENT_ID
  });
  const response = await client.send(command);
  return response;
};

export const register = async ({
  email,
  password
}: Credentials): Promise<SignUpCommandOutput> => {
  const command = new SignUpCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    Password: password
  });
  const response = await client.send(command);
  return response;
};

export const resendCode = async ({
  email
}: {
  email: string
}): Promise<ResendConfirmationCodeCommandOutput> => {
  const command = new ResendConfirmationCodeCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email
  });
  const response = await client.send(command);
  return response;
};

export const confirmSignUpCommand = async ({
  email,
  code
}: {
  email: string
  code: string
}): Promise<ConfirmSignUpCommandOutput> => {
  const command = new ConfirmSignUpCommand({
    ClientId: COGNITO_CLIENT_ID,
    ConfirmationCode: code,
    Username: email
  });
  const response = await client.send(command);
  return response;
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordCommandOutput> => {
  const command = new ForgotPasswordCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email
  });
  const response = await client.send(command);
  return response;
};

export const confirmForgotPassword = async ({
  email,
  code,
  newPassword
}: {
  email: string
  code: string
  newPassword: string
}): Promise<ConfirmSignUpCommandOutput> => {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword
  });
  const response = await client.send(command);
  return response;
};

export const getCurrentUser = async (token: string): Promise<GetUserCommandOutput> => {
  const command = new GetUserCommand({
    AccessToken: token
  });
  const response = await client.send(command);
  return response;
};

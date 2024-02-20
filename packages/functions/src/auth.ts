import { ApiHandler, useJsonBody } from "sst/node/api";
import { Auth } from "@aws-cloud-native-sst-stack/core/auth";
import { z } from 'zod';

export const auth = ApiHandler(async (evt) => {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
  });
  const body: z.infer<typeof schema> = useJsonBody();
  try {
    schema.parse(body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Received invalid request body. Must have email and password.',
      }),
    };
  }
  const response = await Auth.login(body);
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const register = ApiHandler(async (evt) => {
  console.log('');
  return {
    statusCode: 200,
  };
});

export const changePassword = ApiHandler(async (evt) => {
  console.log('');
  return {
    statusCode: 200,
  };
});

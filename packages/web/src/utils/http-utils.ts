import { HTTPError } from 'ky';

export const extractHTTPErrorMessage = async (error: HTTPError) => {
  const data = await error.response.json();
  return data?.error ?? data?.message ?? error.message;
};

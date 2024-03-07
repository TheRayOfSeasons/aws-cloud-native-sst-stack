import { HTTPError } from 'ky';

export const extractHTTPErrorMessage = async (error: HTTPError) => {
  const data = error.response.json();
  // @ts-expect-error We attempt to extract the error message from different keys.
  return data?.error ?? data?.message ?? error.message;
};

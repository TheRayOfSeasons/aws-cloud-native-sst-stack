export const extractHTTPErrorMessage = async (error: unknown): Promise<string> => {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message || error.name;
  }
  if (error instanceof Response) {
    const data = await error.json();
    return data?.error ?? data?.message ?? error.statusText;
  }
  return 'Internal Server Error';
};

export type BeforeRequestHook = (request: Request) => Promise<void>;
export type AfterResponseHook = (
  request: Request,
  response: Response
) => Promise<void>;

export interface FetchClientOptions {
  prefixUrl: string
  hooks?: {
    beforeRequest?: BeforeRequestHook[]
    afterResponse?: AfterResponseHook[]
  }
}

export class FetchClient {
  options: FetchClientOptions;

  constructor(options: FetchClientOptions) {
    this.options = options;
  }

  async request(url: string, init?: RequestInit) {
    let finalUrl: URL;
    if (this.options.prefixUrl) {
      finalUrl = new URL(url, this.options.prefixUrl);
    } else {
      finalUrl = new URL(url);
    }
    const request = new Request(finalUrl, init);
    for (const hook of this.options?.hooks?.beforeRequest || []) {
      await hook(request);
    }
    const response = await fetch(request);
    for (const hook of this.options?.hooks?.afterResponse || []) {
      await hook(request, response);
    }
    return response;
  }
}

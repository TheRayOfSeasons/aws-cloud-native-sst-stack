import type {
  ConfirmForgotPasswordPayload,
  ConfirmPayload,
  Credentials,
  ForgotPasswordPayload,
  LoginResponse,
  ResendCodePayload
} from './types';
import { FetchClient } from '../../utils/http-utils';

export class AuthService {
  // kyInstance: KyInstance;
  client: FetchClient;

  constructor(client: FetchClient) {
    this.client = client;
  }

  async login(credentials: Credentials): Promise<LoginResponse> {
    const response = await this.client.request('auth/cognito/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const data: LoginResponse = await response.json();
    return data;
  }

  async register(credentials: Credentials): Promise<Response> {
    const response = await this.client.request('auth/cognito/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async confirmRegistration(payload: ConfirmPayload): Promise<Response> {
    const response = await this.client.request('auth/cognito/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  }

  async resendCode(payload: ResendCodePayload): Promise<Response> {
    const response = await this.client.request('auth/cognito/resendCode', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  }

  async forgotPassword(payload: ForgotPasswordPayload): Promise<Response> {
    const response = await this.client.request('auth/cognito/forgotPassword', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  }

  async confirmForgotPassword(payload: ConfirmForgotPasswordPayload): Promise<Response> {
    const response = await this.client.request('auth/cognito/confirmForgotPassword', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  }
}

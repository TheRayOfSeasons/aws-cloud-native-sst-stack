import type {
  KyInstance,
  KyResponse
} from 'ky';
import type {
  ConfirmForgotPasswordPayload,
  ConfirmPayload,
  Credentials,
  ForgotPasswordPayload,
  LoginResponse,
  ResendCodePayload
} from './types';

export class AuthService {
  kyInstance: KyInstance;

  constructor(kyInstance: KyInstance) {
    this.kyInstance = kyInstance;
  }

  async login(credentials: Credentials): Promise<LoginResponse> {
    const response = await this.kyInstance.post('/auth/cognito/login', {
      json: credentials,
    });
    const data = await response.json<LoginResponse>();
    return data;
  }

  async register(credentials: Credentials): Promise<KyResponse> {
    const response = await this.kyInstance.post('/auth/cognito/register', {
      json: credentials,
    });
    return response;
  }

  async confirmRegistration(payload: ConfirmPayload): Promise<KyResponse> {
    const response = await this.kyInstance.post('/auth/cognito/confirm', {
      json: payload,
    });
    return response;
  }

  async resendCode(payload: ResendCodePayload): Promise<KyResponse> {
    const response = await this.kyInstance.post('/auth/cognito/resendCode', {
      json: payload,
    });
    return response;
  }

  async forgotPassword(payload: ForgotPasswordPayload): Promise<KyResponse> {
    const response = await this.kyInstance.post('/auth/cognito/forgotPassword', {
      json: payload,
    });
    return response;
  }

  async confirmForgotPassword(payload: ConfirmForgotPasswordPayload): Promise<KyResponse> {
    const response = await this.kyInstance.post('/auth/cognito/confirmForgotPassword', {
      json: payload,
    });
    return response;
  }
}

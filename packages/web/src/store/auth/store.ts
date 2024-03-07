import { create } from 'zustand';
import { User } from './types';
import ky, { HTTPError } from 'ky';
import type {
  ConfirmForgotPasswordPayload,
  ConfirmPayload,
  Credentials,
  ForgotPasswordPayload,
  LoginResponse,
  ResendCodePayload
} from './types';
import { AuthService } from './service';
import { extractHTTPErrorMessage } from '../../utils/http-utils';

interface State {
  token: string
  user: User
  error: string,
}

interface Actions {
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
  register: (credentials: Credentials) => Promise<void>
  confirmRegistration: (payload: ConfirmPayload) => Promise<void>
  resendCode: (payload: ResendCodePayload) => Promise<void>
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>
  confirmForgotPassword: (payload: ConfirmForgotPasswordPayload) => Promise<void>
}

interface AuthState extends State, Actions {}

const authService = new AuthService(ky.extend({}));

export const useAuth = create<AuthState>((set) => ({
  token: '',
  user: {
    email: ''
  },
  error: '',
  login: async (credentials) => {
    let data: LoginResponse;
    try {
      data = await authService.login(credentials);
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
      return;
    }
    set({
      token: data.token,
      user: {
        email: data.email
      },
      error: '',
    });
  },
  logout: async () => {
    set({
      token: '',
      user: {
        email: ''
      }
    });
  },
  register: async (credentials) => {
    try {
      await authService.register(credentials);
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
    }
  },
  confirmRegistration: async (payload) => {
    try {
      await authService.confirmRegistration(payload);
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
    }
    set({
      error: '',
    });
  },
  resendCode: async (payload) => {
    try {
      await authService.resendCode(payload);
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
    }
    set({
      error: '',
    });
  },
  forgotPassword: async (payload) => {
    try {
      await authService.forgotPassword(payload);
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
    }
    set({
      error: '',
    });
  },
  confirmForgotPassword: async (payload) => {
    try {
      await authService.confirmForgotPassword(payload);
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = await extractHTTPErrorMessage(error);
        set({
          error: message
        });
      }
    }
    set({
      error: '',
    });
  },
}));

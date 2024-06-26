import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from './types';
import type {
  ConfirmForgotPasswordPayload,
  ConfirmPayload,
  Credentials,
  ForgotPasswordPayload,
  LoginResponse,
  ResendCodePayload
} from './types';
import { AuthService } from './service';
import { FetchClient, extractHTTPErrorMessage } from '../../utils/http-utils';
import { useNotes } from '../notes/store';

interface State {
  token: string
  user: User
  error: string,
  registrationEmail: string
  forgotPasswordEmail: string
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

const client = new FetchClient({
  prefixUrl: import.meta.env.VITE_APP_API_URL ?? '',
});
const authService = new AuthService(client);

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: '',
      user: {
        email: ''
      },
      error: '',
      registrationEmail: '',
      forgotPasswordEmail: '',
      login: async (credentials) => {
        let data: LoginResponse;
        try {
          data = await authService.login(credentials);
        } catch (error) {
          if (error) {
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
        useNotes.getState().clear();
      },
      register: async (credentials) => {
        try {
          await authService.register(credentials);
        } catch (error) {
          if (error) {
            const message = await extractHTTPErrorMessage(error);
            set({
              error: message
            });
          }
          throw error;
        }
        set({
          error: '',
          registrationEmail: credentials.email,
        });
      },
      confirmRegistration: async (payload) => {
        try {
          await authService.confirmRegistration(payload);
        } catch (error) {
          if (error) {
            const message = await extractHTTPErrorMessage(error);
            set({
              error: message
            });
          }
          throw error;
        }
        set({
          error: '',
          registrationEmail: '',
        });
      },
      resendCode: async (payload) => {
        try {
          await authService.resendCode(payload);
        } catch (error) {
          if (error) {
            const message = await extractHTTPErrorMessage(error);
            set({
              error: message
            });
          }
          throw error;
        }
        set({
          error: '',
        });
      },
      forgotPassword: async (payload) => {
        try {
          await authService.forgotPassword(payload);
        } catch (error) {
          if (error) {
            const message = await extractHTTPErrorMessage(error);
            set({
              error: message
            });
          }
          throw error;
        }
        set({
          error: '',
          forgotPasswordEmail: payload.email,
        });
      },
      confirmForgotPassword: async (payload) => {
        try {
          await authService.confirmForgotPassword(payload);
        } catch (error) {
          if (error) {
            const message = await extractHTTPErrorMessage(error);
            set({
              error: message
            });
          }
          throw error;
        }
        set({
          error: '',
          forgotPasswordEmail: '',
        });
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        registrationEmail: state.registrationEmail,
        forgotPasswordEmail: state.forgotPasswordEmail,
      }),
    }
  )
);

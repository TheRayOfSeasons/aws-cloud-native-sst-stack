import ky from 'ky';
import { useAuth } from './auth/store';

export const kyInstance = ky.extend({
  prefixUrl: import.meta.env.VITE_APP_API_URL ?? '',
  hooks: {
    beforeRequest: [
      async (request) => {
        const { token } = useAuth();
        request.headers.set('authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          const { logout } = useAuth();
          logout();
        }
      }
    ]
  }
});

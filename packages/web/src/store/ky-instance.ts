import ky from 'ky';
import { useAuth } from './auth/store';

export const kyInstance = ky.extend({
  // @ts-expect-error VITE_APP_API_URL is guaranteed by SST stack definition
  prefixUrl: import.meta?.VITE_APP_API_URL ?? '',
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

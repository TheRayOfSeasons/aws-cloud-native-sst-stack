import { useAuth } from './auth/store';
import { FetchClient } from '../utils/http-utils';

export const fetchClient = new FetchClient({
  prefixUrl: import.meta.env.VITE_APP_API_URL ?? '',
  hooks: {
    beforeRequest: [
      async (request) => {
        const { token } = useAuth.getState();
        request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async (_request, response) => {
        if (response.status === 401) {
          const { logout } = useAuth.getState();
          logout();
        }
      }
    ]
  }
});

import { User, UserRole } from '@/types';
import api from './api';

// These functions are structured for future API integration
// Currently, authentication is mocked in the AuthContext

export const authService = {
  // POST /auth/login
  login: async (email: string, password: string, role: UserRole): Promise<User> => {
    // When API is ready:
    // const response = await api.post('/auth/login', { email, password, role });
    // return response.data;
    throw new Error('API not implemented - using mock auth');
  },

  // POST /auth/logout
  logout: async (): Promise<void> => {
    // When API is ready:
    // await api.post('/auth/logout');
    throw new Error('API not implemented - using mock auth');
  },

  // GET /auth/me
  getCurrentUser: async (): Promise<User> => {
    // When API is ready:
    // const response = await api.get('/auth/me');
    // return response.data;
    throw new Error('API not implemented - using mock auth');
  },
};

export default authService;

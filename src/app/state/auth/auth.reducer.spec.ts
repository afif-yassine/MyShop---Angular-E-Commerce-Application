import { authReducer, initialState, AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';

describe('Auth Reducer', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' };
      const result = authReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('login action', () => {
    it('should set loading to true and clear error', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Previous error'
      };
      const action = AuthActions.login({ username: 'test@example.com', password: 'password' });
      const result = authReducer(stateWithError, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('loginSuccess action', () => {
    it('should set user data and clear loading', () => {
      const loadingState: AuthState = {
        ...initialState,
        loading: true
      };
      const action = AuthActions.loginSuccess({
        access: 'access-token-123',
        refresh: 'refresh-token-456',
        user: mockUser
      });
      const result = authReducer(loadingState, action);

      expect(result.access).toBe('access-token-123');
      expect(result.refresh).toBe('refresh-token-456');
      expect(result.user).toEqual(mockUser);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should persist tokens to localStorage', () => {
      const action = AuthActions.loginSuccess({
        access: 'access-token-123',
        refresh: 'refresh-token-456',
        user: mockUser
      });
      authReducer(initialState, action);

      expect(localStorage.getItem('access_token')).toBe('access-token-123');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token-456');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });
  });

  describe('loginFailure action', () => {
    it('should set error and clear loading', () => {
      const loadingState: AuthState = {
        ...initialState,
        loading: true
      };
      const action = AuthActions.loginFailure({ error: 'Invalid credentials' });
      const result = authReducer(loadingState, action);

      expect(result.error).toBe('Invalid credentials');
      expect(result.loading).toBe(false);
    });
  });

  describe('logout action', () => {
    it('should clear all auth data', () => {
      const authenticatedState: AuthState = {
        access: 'access-token-123',
        refresh: 'refresh-token-456',
        user: mockUser,
        loading: false,
        error: null
      };
      const action = AuthActions.logout();
      const result = authReducer(authenticatedState, action);

      expect(result.access).toBeNull();
      expect(result.refresh).toBeNull();
      expect(result.user).toBeNull();
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should clear localStorage', () => {
      localStorage.setItem('access_token', 'test');
      localStorage.setItem('refresh_token', 'test');
      localStorage.setItem('user', 'test');

      const action = AuthActions.logout();
      authReducer(initialState, action);

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('register action', () => {
    it('should set loading to true', () => {
      const action = AuthActions.register({ 
        name: 'Test', 
        email: 'test@example.com', 
        password: 'password' 
      });
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('loginWithGoogle action', () => {
    it('should set loading to true', () => {
      const action = AuthActions.loginWithGoogle({ 
        googleUser: { id: '123', email: 'test@gmail.com', name: 'Test', picture: '' } 
      });
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('loginWithGoogleSuccess action', () => {
    it('should set user data like regular login', () => {
      const action = AuthActions.loginWithGoogleSuccess({
        access: 'google-access-token',
        refresh: 'google-refresh-token',
        user: { ...mockUser, provider: 'google' }
      });
      const result = authReducer(initialState, action);

      expect(result.access).toBe('google-access-token');
      expect(result.user.provider).toBe('google');
      expect(result.loading).toBe(false);
    });
  });

  describe('loginWithGoogleFailure action', () => {
    it('should set error', () => {
      const action = AuthActions.loginWithGoogleFailure({ error: 'Google auth failed' });
      const result = authReducer(initialState, action);

      expect(result.error).toBe('Google auth failed');
      expect(result.loading).toBe(false);
    });
  });
});

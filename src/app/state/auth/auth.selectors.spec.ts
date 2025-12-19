import * as fromAuth from './auth.selectors';
import { AuthState } from './auth.reducer';

describe('Auth Selectors', () => {
  const unauthenticatedState: AuthState = {
    access: null,
    refresh: null,
    user: null,
    loading: false,
    error: null
  };

  const authenticatedState: AuthState = {
    access: 'access-token-123',
    refresh: 'refresh-token-456',
    user: { id: 1, email: 'test@example.com', name: 'Test User' },
    loading: false,
    error: null
  };

  const loadingState: AuthState = {
    access: null,
    refresh: null,
    user: null,
    loading: true,
    error: null
  };

  const errorState: AuthState = {
    access: null,
    refresh: null,
    user: null,
    loading: false,
    error: 'Invalid credentials'
  };

  describe('selectIsLoggedIn', () => {
    it('should return false when not authenticated', () => {
      const result = fromAuth.selectIsLoggedIn.projector(unauthenticatedState);
      expect(result).toBe(false);
    });

    it('should return true when authenticated', () => {
      const result = fromAuth.selectIsLoggedIn.projector(authenticatedState);
      expect(result).toBe(true);
    });
  });

  describe('selectAuthLoading', () => {
    it('should return false when not loading', () => {
      const result = fromAuth.selectAuthLoading.projector(unauthenticatedState);
      expect(result).toBe(false);
    });

    it('should return true when loading', () => {
      const result = fromAuth.selectAuthLoading.projector(loadingState);
      expect(result).toBe(true);
    });
  });

  describe('selectAuthError', () => {
    it('should return null when no error', () => {
      const result = fromAuth.selectAuthError.projector(unauthenticatedState);
      expect(result).toBeNull();
    });

    it('should return error message', () => {
      const result = fromAuth.selectAuthError.projector(errorState);
      expect(result).toBe('Invalid credentials');
    });
  });

  describe('selectAuthToken', () => {
    it('should return null when not authenticated', () => {
      const result = fromAuth.selectAuthToken.projector(unauthenticatedState);
      expect(result).toBeNull();
    });

    it('should return access token when authenticated', () => {
      const result = fromAuth.selectAuthToken.projector(authenticatedState);
      expect(result).toBe('access-token-123');
    });
  });

  describe('selectUser', () => {
    it('should return null when not authenticated', () => {
      const result = fromAuth.selectUser.projector(unauthenticatedState);
      expect(result).toBeNull();
    });

    it('should return user object when authenticated', () => {
      const result = fromAuth.selectUser.projector(authenticatedState);
      expect(result).toEqual({ id: 1, email: 'test@example.com', name: 'Test User' });
    });
  });
});

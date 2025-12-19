import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ access: string; refresh: string; user: any }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const register = createAction(
  '[Auth] Register',
  props<{ name: string; email: string; password: string }>()
);

export const loadAuthFromStorage = createAction('[Auth] Load From Storage');

// Google Login Actions
export const loginWithGoogle = createAction(
  '[Auth] Login With Google',
  props<{ googleUser: { id: string; email: string; name: string; picture: string } }>()
);

export const loginWithGoogleSuccess = createAction(
  '[Auth] Login With Google Success',
  props<{ access: string; refresh: string; user: any }>()
);

export const loginWithGoogleFailure = createAction(
  '[Auth] Login With Google Failure',
  props<{ error: string }>()
);
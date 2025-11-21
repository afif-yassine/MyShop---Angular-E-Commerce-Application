import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import * as AuthActions from '../../state/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectAuthToken } from '../../state/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-login-page-premium',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login-page-premium.component.html',
  styleUrls: ['./login-page-premium.component.css'],
})
export class LoginPagePremiumComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hidePassword = true;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  token$ = this.store.select(selectAuthToken);

  constructor() {
    // Redirect if already logged in
    this.token$.pipe(take(1)).subscribe((token) => {
      if (token) {
        this.router.navigate(['/account']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      // Use email as username for API
      this.store.dispatch(AuthActions.login({ username: email, password }));
      
      // Handle success
      this.store.select(selectAuthToken).pipe(take(2)).subscribe((token) => {
        if (token) {
          this.snackBar.open('Welcome back!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.router.navigate(['/account']);
        }
      });
    }
  }

  loginWithGoogle() {
    // Placeholder for Google OAuth
    this.snackBar.open('Google login coming soon!', 'Close', {
      duration: 3000,
    });
  }
}


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  standalone: true,
  selector: 'app-register-page-premium',
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
  templateUrl: './register-page-premium.component.html',
  styleUrls: ['./register-page-premium.component.css'],
})
export class RegisterPagePremiumComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;

  registerForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    { validators: passwordMatchValidator }
  );

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      // Simulate registration
      setTimeout(() => {
        this.loading = false;
        this.snackBar.open('Account created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  registerWithGoogle() {
    this.snackBar.open('Google registration coming soon!', 'Close', {
      duration: 3000,
    });
  }
}


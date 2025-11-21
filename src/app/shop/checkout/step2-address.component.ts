import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CheckoutStepperComponent } from './checkout-stepper.component';

@Component({
  standalone: true,
  selector: 'app-step2-address',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CheckoutStepperComponent,
  ],
  template: `
    <div class="checkout-step">
      <app-checkout-stepper [currentStep]="2"></app-checkout-stepper>
      <h2>Shipping Address</h2>
      <mat-card>
        <mat-card-content>
          <form [formGroup]="addressForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" required />
              <mat-error *ngIf="addressForm.get('fullName')?.hasError('required')">
                Full name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Street Address</mat-label>
              <input matInput formControlName="street" required />
              <mat-error *ngIf="addressForm.get('street')?.hasError('required')">
                Street address is required
              </mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" required />
                <mat-error *ngIf="addressForm.get('city')?.hasError('required')">
                  City is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Postal Code</mat-label>
                <input matInput formControlName="postalCode" required />
                <mat-error *ngIf="addressForm.get('postalCode')?.hasError('required')">
                  Postal code is required
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Country</mat-label>
              <input matInput formControlName="country" required />
              <mat-error *ngIf="addressForm.get('country')?.hasError('required')">
                Country is required
              </mat-error>
            </mat-form-field>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button routerLink="/shop/checkout">Back</button>
          <button
            mat-raised-button
            color="primary"
            [disabled]="!addressForm.valid"
            (click)="onSubmit()"
          >
            Continue
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .checkout-step {
        max-width: 900px;
        margin: 0 auto;
        padding: var(--spacing-xl) var(--spacing-md);
      }

      .checkout-step h2 {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        margin: var(--spacing-2xl) 0 var(--spacing-xl) 0;
        text-align: center;
        color: var(--color-text-primary);
      }

      .full-width {
        width: 100%;
        margin-bottom: 1rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
      }

      @media (max-width: 600px) {
        .form-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class Step2AddressComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  addressForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
  });

  onSubmit() {
    if (this.addressForm.valid) {
      // Store address in sessionStorage or state for step 3
      sessionStorage.setItem('checkoutAddress', JSON.stringify(this.addressForm.value));
      // Navigate to confirmation step
      this.router.navigate(['/shop/checkout/confirm']);
    }
  }
}


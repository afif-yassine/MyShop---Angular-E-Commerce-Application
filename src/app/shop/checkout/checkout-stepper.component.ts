import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-checkout-stepper',
  imports: [CommonModule, RouterModule, MatStepperModule, MatIconModule],
  template: `
    <div class="checkout-stepper">
      <div class="stepper-steps">
        <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
          <div class="step-circle">
            <mat-icon *ngIf="currentStep > 1">check</mat-icon>
            <span *ngIf="currentStep <= 1">1</span>
          </div>
          <div class="step-label">Summary</div>
        </div>
        <div class="step-connector" [class.completed]="currentStep > 1"></div>
        <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
          <div class="step-circle">
            <mat-icon *ngIf="currentStep > 2">check</mat-icon>
            <span *ngIf="currentStep <= 2">2</span>
          </div>
          <div class="step-label">Address</div>
        </div>
        <div class="step-connector" [class.completed]="currentStep > 2"></div>
        <div class="step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
          <div class="step-circle">
            <mat-icon *ngIf="currentStep > 3">check</mat-icon>
            <span *ngIf="currentStep <= 3">3</span>
          </div>
          <div class="step-label">Confirm</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .checkout-stepper {
        margin-bottom: var(--spacing-2xl);
      }

      .stepper-steps {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 600px;
        margin: 0 auto;
      }

      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }

      .step-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: var(--color-text-secondary);
        transition: all var(--transition-base);
      }

      .step.active .step-circle {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
      }

      .step.completed .step-circle {
        background: var(--color-success);
        border-color: var(--color-success);
        color: white;
      }

      .step-circle mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .step-label {
        margin-top: var(--spacing-sm);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        font-weight: 500;
      }

      .step.active .step-label {
        color: var(--color-primary);
        font-weight: 600;
      }

      .step.completed .step-label {
        color: var(--color-success);
      }

      .step-connector {
        flex: 1;
        height: 2px;
        background: var(--color-border);
        margin: 0 var(--spacing-sm);
        transition: background var(--transition-base);
      }

      .step-connector.completed {
        background: var(--color-success);
      }

      @media (max-width: 600px) {
        .step-circle {
          width: 40px;
          height: 40px;
        }

        .step-label {
          font-size: var(--font-size-xs);
        }
      }
    `,
  ],
})
export class CheckoutStepperComponent {
  @Input() currentStep: number = 1;
}


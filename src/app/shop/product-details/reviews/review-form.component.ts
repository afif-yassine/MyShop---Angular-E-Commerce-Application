import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="review-form">
      <h3>Write a Review</h3>
      
      <div class="rating-field">
        <label>Rating</label>
        <mat-form-field appearance="outline">
          <mat-select formControlName="rating">
            <mat-option [value]="5">⭐⭐⭐⭐⭐ (5)</mat-option>
            <mat-option [value]="4">⭐⭐⭐⭐ (4)</mat-option>
            <mat-option [value]="3">⭐⭐⭐ (3)</mat-option>
            <mat-option [value]="2">⭐⭐ (2)</mat-option>
            <mat-option [value]="1">⭐ (1)</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Your Name</mat-label>
        <input matInput formControlName="userName" placeholder="John Doe">
        <mat-error *ngIf="reviewForm.get('userName')?.hasError('required')">Name is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Comment</mat-label>
        <textarea matInput formControlName="comment" rows="4" placeholder="Share your thoughts..."></textarea>
        <mat-error *ngIf="reviewForm.get('comment')?.hasError('required')">Comment is required</mat-error>
        <mat-error *ngIf="reviewForm.get('comment')?.hasError('minlength')">Comment must be at least 5 characters</mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="reviewForm.invalid || isSubmitting">
        <mat-icon *ngIf="!isSubmitting">send</mat-icon>
        <mat-icon *ngIf="isSubmitting"><mat-spinner diameter="18"></mat-spinner></mat-icon>
        {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
      </button>
    </form>
  `,
  styles: [`
    .review-form {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #fdfdfd;
      border-radius: 12px;
      border: 1px solid #eee;
    }
    .full-width {
      width: 100%;
    }
    .rating-field {
      margin-bottom: 1rem;
    }
    .rating-field label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewFormComponent {
  @Input() isSubmitting = false;
  @Output() submitReview = new EventEmitter<{ userName: string; rating: number; comment: string }>();

  private fb = inject(FormBuilder);

  reviewForm = this.fb.group({
    userName: ['', Validators.required],
    rating: [5, Validators.required],
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  onSubmit() {
    if (this.reviewForm.valid && !this.isSubmitting) {
      this.submitReview.emit(this.reviewForm.value as any);
      // We keep the name but reset the comment
      this.reviewForm.patchValue({ comment: '' });
      this.reviewForm.get('comment')?.setErrors(null);
    }
  }
}

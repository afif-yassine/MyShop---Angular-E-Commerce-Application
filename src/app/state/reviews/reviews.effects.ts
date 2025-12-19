import { Injectable, inject } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ReviewsActions from './reviews.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class ReviewsEffects {
  private actions$ = inject(Actions);

  private api = inject(ShopApiService);

  // Load reviews from API
  loadReviews$ = createEffect(() => this.actions$.pipe(
    ofType(ReviewsActions.loadReviews),
    mergeMap(({ productId }) => 
      this.api.getReviews(productId).pipe(
        map((response: any) => ReviewsActions.loadReviewsSuccess({ 
          reviews: response.results || [], 
          productId 
        })),
        catchError((error: any) => of(ReviewsActions.loadReviewsFailure({ 
          error: error.error?.message || error.message || 'Failed to load reviews' 
        })))
      )
    )
  ));

  // Add review via API
  addReview$ = createEffect(() => this.actions$.pipe(
    ofType(ReviewsActions.addReview),
    mergeMap(({ review }) => 
      this.api.addReview(review.productId, review).pipe(
        map((createdReview: any) => ReviewsActions.addReviewSuccess({ 
          review: createdReview 
        })),
        catchError((error: any) => of(ReviewsActions.addReviewFailure({ 
          error: error.error?.message || error.message || 'Failed to add review' 
        })))
      )
    )
  ));
}

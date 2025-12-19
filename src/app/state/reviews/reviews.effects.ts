import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import * as ReviewsActions from './reviews.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class ReviewsEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);
  private notifications = inject(NotificationService);

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

  // ✅ Scenario 5: Show notification on review success
  showReviewSuccessNotification$ = createEffect(
    () => this.actions$.pipe(
      ofType(ReviewsActions.addReviewSuccess),
      tap(() => {
        this.notifications.success('Avis ajouté avec succès !');
      })
    ),
    { dispatch: false }
  );

  // ✅ Scenario 5: Show notification on review failure
  showReviewFailureNotification$ = createEffect(
    () => this.actions$.pipe(
      ofType(ReviewsActions.addReviewFailure),
      tap(({ error }) => {
        this.notifications.error(`Échec de l'ajout de l'avis: ${error}`);
      })
    ),
    { dispatch: false }
  );
}

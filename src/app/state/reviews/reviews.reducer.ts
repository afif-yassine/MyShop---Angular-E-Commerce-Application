import { createReducer, on } from '@ngrx/store';
import * as ReviewsActions from './reviews.actions';

export interface ReviewsState {
  reviews: { [productId: number]: ReviewsActions.Review[] };
  loading: boolean;
  error: string | null;
}

export const initialState: ReviewsState = {
  reviews: {},
  loading: false,
  error: null
};

export const reviewsReducer = createReducer(
  initialState,
  on(ReviewsActions.loadReviews, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ReviewsActions.loadReviewsSuccess, (state, { reviews, productId }) => ({
    ...state,
    reviews: {
      ...state.reviews,
      [productId]: reviews
    },
    loading: false,
    error: null
  })),
  on(ReviewsActions.loadReviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ReviewsActions.addReview, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ReviewsActions.addReviewSuccess, (state, { review }) => {
    const productReviews = state.reviews[review.productId] || [];
    return {
      ...state,
      reviews: {
        ...state.reviews,
        [review.productId]: [review, ...productReviews]
      },
      loading: false,
      error: null
    };
  }),
  on(ReviewsActions.addReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { ModernFiltersComponent, FilterValues } from '../../components/modern-filters/modern-filters.component';
import * as ProductsActions from '../../state/products/products.actions';
import {
  selectProductsList,
  selectProductsCount,
  selectProductsLoading,
  selectProductsError,
  selectLastQueryParams,
} from '../../state/products/products.selectors';
import { Product } from '../../../mocks/data';
import { avgRating } from '../../../mocks/utils';

@Component({
  standalone: true,
  selector: 'app-products-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    ProductsListComponent,
    ModernFiltersComponent,
  ],
  templateUrl: './products-page.html',
  styleUrls: ['./products-page.css'],
})
export class ProductsPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  filterForm: FormGroup = this.fb.group({
    page: [1],
    pageSize: [12],
    minRating: [0],
    ordering: ['-created_at'],
  });

  products$ = this.store.select(selectProductsList);
  count$ = this.store.select(selectProductsCount);
  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);
  lastQueryParams$ = this.store.select(selectLastQueryParams);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const params = this.filterForm.getRawValue();
    this.store.dispatch(ProductsActions.loadProducts({ params }));
  }

  onPageChange(event: PageEvent) {
    this.filterForm.patchValue({
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
    this.loadProducts();
  }

  getAvgRating(product: Product): number {
    return avgRating(product.ratings);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  onFiltersChange(filters: FilterValues) {
    this.filterForm.patchValue({
      minRating: filters.minRating,
      ordering: filters.sortBy,
    });
    this.loadProducts();
  }

  onClearFilters() {
    this.filterForm.patchValue({
      minRating: 0,
      ordering: '-created_at',
    });
    this.loadProducts();
  }
}

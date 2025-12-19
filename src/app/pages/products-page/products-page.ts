import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { ModernFiltersComponent, FilterValues } from '../../components/modern-filters/modern-filters.component';
import * as ProductsActions from '../../state/products/products.actions';
import {
  selectProductsList,
  selectProductsCount,
  selectProductsLoading,
  selectProductsError,
  selectLastQueryParams,
  selectUniqueCategories
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
    MatSidenavModule,
    ProductsListComponent,
    ModernFiltersComponent,
  ],
  templateUrl: './products-page.html',
  styleUrls: ['./products-page.css'],
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  filterForm: FormGroup = this.fb.group({
    page: [1],
    pageSize: [12],
    minRating: [0],
    ordering: ['-created_at'],
    search: [''],
    category: ['all'],
    minPrice: [0],
    maxPrice: [100],
  });

  // Page size options for paginator
  pageSizeOptions: number[] = [12, 24, 48, 96];

  products$ = this.store.select(selectProductsList);
  count$ = this.store.select(selectProductsCount);
  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);
  lastQueryParams$ = this.store.select(selectLastQueryParams);
  categories$ = this.store.select(selectUniqueCategories);

  ngOnInit() {
    // 1. Restore filters from URL query params on init
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const formValues: any = {};
      if (params['page']) formValues.page = +params['page'];
      if (params['pageSize']) formValues.pageSize = +params['pageSize'];
      if (params['minRating']) formValues.minRating = +params['minRating'];
      if (params['ordering']) formValues.ordering = params['ordering'];
      if (params['search']) formValues.search = params['search'];
      if (params['category']) formValues.category = params['category'];
      if (params['minPrice']) formValues.minPrice = +params['minPrice'];
      if (params['maxPrice']) formValues.maxPrice = +params['maxPrice'];
      
      if (Object.keys(formValues).length > 0) {
        this.filterForm.patchValue(formValues, { emitEvent: false });
      }
    });

    // 2. Debounce filter changes and sync with URL
    this.filterForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.syncUrlAndLoad(values);
    });

    // 3. Initial load
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private syncUrlAndLoad(values: any) {
    // Update URL without reloading the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: values.page,
        pageSize: values.pageSize,
        minRating: values.minRating,
        ordering: values.ordering,
        search: values.search || null,
        category: values.category !== 'all' ? values.category : null,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice
      },
      queryParamsHandling: 'merge',
      replaceUrl: false
    });
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
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      page: 1, // Reset to first page on filter change
    });
    this.loadProducts();
  }

  onClearFilters() {
    this.filterForm.patchValue({
      minRating: 0,
      ordering: '-created_at',
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 100,
      page: 1,
    });
    this.loadProducts();
  }
}

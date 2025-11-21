import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';

export interface FilterValues {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  minRating: number;
}

@Component({
  standalone: true,
  selector: 'app-modern-filters',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './modern-filters.component.html',
  styleUrls: ['./modern-filters.component.css'],
})
export class ModernFiltersComponent {
  private fb = inject(FormBuilder);

  @Input() initialFilters: Partial<FilterValues> = {};
  @Output() filtersChange = new EventEmitter<FilterValues>();
  @Output() clearFilters = new EventEmitter<void>();

  filterForm: FormGroup = this.fb.group({
    search: [''],
    category: ['all'],
    minPrice: [0],
    maxPrice: [100],
    sortBy: ['-created_at'],
    minRating: [0],
  });

  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Living' },
    { value: 'sports', label: 'Sports' },
  ];

  sortOptions = [
    { value: '-created_at', label: 'Newest First' },
    { value: 'created_at', label: 'Oldest First' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-name', label: 'Name: Z-A' },
    { value: 'name', label: 'Name: A-Z' },
  ];

  ngOnInit() {
    if (this.initialFilters) {
      this.filterForm.patchValue(this.initialFilters);
    }
    this.filterForm.valueChanges.subscribe((values) => {
      this.filtersChange.emit(values);
    });
  }

  onClear() {
    this.filterForm.reset({
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 100,
      sortBy: '-created_at',
      minRating: 0,
    });
    this.clearFilters.emit();
  }

  get activeFiltersCount(): number {
    const values = this.filterForm.value;
    let count = 0;
    if (values.search) count++;
    if (values.category !== 'all') count++;
    if (values.minPrice > 0 || values.maxPrice < 100) count++;
    if (values.minRating > 0) count++;
    return count;
  }
}


import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../../mocks/data';
import { avgRating } from '../../../mocks/utils';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent {
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  getAvgRating(product: Product): number {
    return avgRating(product.ratings);
  }
}


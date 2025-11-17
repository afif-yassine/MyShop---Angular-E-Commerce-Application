import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() name = '';
  @Input() price = 0;
  @Input() created_at = '';
  @Input() avgRating = 0;

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}

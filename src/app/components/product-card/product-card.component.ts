import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() id = 0;
  @Input() name = '';
  @Input() price = 0;
  @Input() created_at = '';
  @Input() avgRating = 0;

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}

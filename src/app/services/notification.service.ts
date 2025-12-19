import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000, // Auto-dismiss after 3 seconds
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  /**
   * Show a success notification (green) - auto-dismiss
   */
  success(message: string): void {
    this.show(message, 'success', 3000);
  }

  /**
   * Show an error notification (red) - slightly longer
   */
  error(message: string): void {
    this.show(message, 'error', 5000);
  }

  /**
   * Show a warning notification (orange)
   */
  warning(message: string): void {
    this.show(message, 'warning', 4000);
  }

  /**
   * Show an info notification (blue) - auto-dismiss
   */
  info(message: string): void {
    this.show(message, 'info', 3000);
  }

  /**
   * Generic show method with type-based styling - with OK button
   */
  private show(message: string, type: NotificationType, duration: number): void {
    this.snackBar.open(message, 'OK', {
      ...this.defaultConfig,
      duration,
      panelClass: [`snackbar-${type}`]
    });
  }
}

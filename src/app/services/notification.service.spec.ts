import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  describe('success', () => {
    it('should open snackbar with success styling', () => {
      service.success('Test message');

      expect(snackBar.open).toHaveBeenCalledWith(
        'Test message',
        'OK',
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['snackbar-success']
        })
      );
    });
  });

  describe('error', () => {
    it('should open snackbar with error styling and longer duration', () => {
      service.error('Error message');

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error message',
        'OK',
        jasmine.objectContaining({
          duration: 5000,
          panelClass: ['snackbar-error']
        })
      );
    });
  });

  describe('warning', () => {
    it('should open snackbar with warning styling', () => {
      service.warning('Warning message');

      expect(snackBar.open).toHaveBeenCalledWith(
        'Warning message',
        'OK',
        jasmine.objectContaining({
          duration: 4000,
          panelClass: ['snackbar-warning']
        })
      );
    });
  });

  describe('info', () => {
    it('should open snackbar with info styling', () => {
      service.info('Info message');

      expect(snackBar.open).toHaveBeenCalledWith(
        'Info message',
        'OK',
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['snackbar-info']
        })
      );
    });
  });

  describe('position', () => {
    it('should position snackbar at top-right', () => {
      service.success('Test');

      expect(snackBar.open).toHaveBeenCalledWith(
        jasmine.any(String),
        jasmine.any(String),
        jasmine.objectContaining({
          horizontalPosition: 'end',
          verticalPosition: 'top'
        })
      );
    });
  });
});

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Guard that prevents access to confirmation step if shipping address is missing.
 * Redirects to /shop/checkout/address.
 */
export const addressRequiredGuard: CanActivateFn = () => {
  const router = inject(Router);

  const addressJson = sessionStorage.getItem('checkoutAddress');
  if (!addressJson) {
    router.navigate(['/shop/checkout/address']);
    return false;
  }

  try {
    const address = JSON.parse(addressJson);
    if (!address.street || !address.city) {
      router.navigate(['/shop/checkout/address']);
      return false;
    }
    return true;
  } catch {
    router.navigate(['/shop/checkout/address']);
    return false;
  }
};

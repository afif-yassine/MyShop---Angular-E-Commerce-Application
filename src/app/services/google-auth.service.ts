import { Injectable, NgZone, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

declare const google: any;

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  credential: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private ngZone = inject(NgZone);
  private googleUser$ = new Subject<GoogleUser>();

  initialize(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      this.initializeGoogleSignIn();
    } else {
      // Wait for the script to load
      const checkGoogle = setInterval(() => {
        if (typeof google !== 'undefined' && google.accounts) {
          clearInterval(checkGoogle);
          this.initializeGoogleSignIn();
        }
      }, 100);
    }
  }

  private initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }

  private handleCredentialResponse(response: any): void {
    // Decode the JWT token from Google
    const credential = response.credential;
    const payload = this.decodeJwt(credential);

    const user: GoogleUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      credential: credential,
    };

    // Run inside Angular zone to trigger change detection
    this.ngZone.run(() => {
      this.googleUser$.next(user);
    });
  }

  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  signIn(): Observable<GoogleUser> {
    // Show the Google One Tap prompt
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap is not available, use the button flow
          console.log('One Tap not displayed, using popup');
          this.showPopup();
        }
      });
    } else {
      console.error('Google Sign-In library not loaded');
    }

    return this.googleUser$.asObservable();
  }

  private showPopup(): void {
    // Create a temporary div for the Google Sign-In button
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'googleSignInButton';
    buttonDiv.style.position = 'fixed';
    buttonDiv.style.top = '50%';
    buttonDiv.style.left = '50%';
    buttonDiv.style.transform = 'translate(-50%, -50%)';
    buttonDiv.style.zIndex = '10000';
    document.body.appendChild(buttonDiv);

    google.accounts.id.renderButton(buttonDiv, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      logo_alignment: 'left',
    });

    // Click the button automatically
    setTimeout(() => {
      const button = buttonDiv.querySelector('div[role="button"]') as HTMLElement;
      if (button) {
        button.click();
      }
      // Remove the temporary button after a delay
      setTimeout(() => {
        buttonDiv.remove();
      }, 500);
    }, 100);
  }

  signOut(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
  }
}

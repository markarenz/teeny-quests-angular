import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);

  private router = inject(Router);

  profile = signal<any>(null);

  private profileSub = new BehaviorSubject<any>({});
  profileObs = this.profileSub.asObservable();

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedInObs = this.isLoggedIn.asObservable();

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);

    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        const profileData = this.oAuthService.getIdentityClaims();
        const initials =
          profileData['name'] && profileData['name'].split(' ').length > 1
            ? profileData['name']
                .split(' ')
                .slice(0, 2)
                .map((n: string) => n[0].toUpperCase())
                .join('')
            : '';
        this.profile.set(profileData);
        this.profileSub.next({
          ...profileData,
          initials,
        });
        this.isLoggedIn.next(true);
      }
    });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.profile.set(null);
    this.isLoggedIn.next(false);
  }

  getIsLoggedIn() {
    return this.isLoggedIn.value;
  }

  getProfile() {
    const t = this.profile();
    return this.profile();
  }
}

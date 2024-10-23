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

  private profileSub = new BehaviorSubject<any>(true);
  profileObs = this.profileSub.asObservable();

  private isLoggedIn = new BehaviorSubject<boolean>(true);
  isLoggedInObs = this.isLoggedIn.asObservable();

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);

    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        this.profile.set(this.oAuthService.getIdentityClaims());
        this.isLoggedIn.next(true);
      }
    });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();

    this.oAuthService.logOut();
    this.profile.set(null);
    this.isLoggedIn.next(false);
  }

  getProfile() {
    const t = this.profile();
    console.log('T', t);
    return this.profile();
  }
}

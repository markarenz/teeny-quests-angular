import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { BehaviorSubject } from 'rxjs';
import { getUserByIdOrCreateUser } from './auth-service-utils';
import { getInitialsFromName } from '@app/features/main/utils';
import { User } from '../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class AuthProviderService {
  private oAuthService = inject(OAuthService);

  private router = inject(Router);

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedInObs = this.isLoggedIn.asObservable();

  private user = new BehaviorSubject<User | null>(null);
  userObs = this.user.asObservable();

  private token = signal<string | null>(null);

  constructor() {
    this.initConfiguration();
  }

  getToken() {
    return this.token();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(async () => {
      this.token.set(this.oAuthService.getAccessToken());
      if (this.oAuthService.hasValidIdToken()) {
        const profileData = this.oAuthService.getIdentityClaims();
        const userId = profileData['sub'];
        const userData = await getUserByIdOrCreateUser({
          id: userId,
          token: this.token(),
        });
        // Check status of user first...
        this.user.next({
          ...userData,
          initials: getInitialsFromName(userData?.username),
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
    this.user.next(null);
    this.isLoggedIn.next(false);
  }

  getIsLoggedIn() {
    return this.isLoggedIn.value;
  }

  getAccessToken() {
    return this.oAuthService.getAccessToken();
  }
}

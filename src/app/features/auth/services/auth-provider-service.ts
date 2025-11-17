import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { BehaviorSubject } from 'rxjs';
import { getUserByIdOrCreateUser } from './auth-service-utils';
import { getInitialsFromName } from '@app/features/main/utils';
import { User } from '../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class AuthProviderService implements OnDestroy {
  private oAuthService = inject(OAuthService);

  private router = inject(Router);

  private isLoggedIn = new BehaviorSubject<boolean | null>(null);
  isLoggedInObs = this.isLoggedIn.asObservable();

  private userId = signal<string | null>(null);

  private user = new BehaviorSubject<User | null>(null);
  userObs = this.user.asObservable();

  private token = signal<string | null>(null);

  constructor() {
    this.initConfiguration();
  }

  ngOnDestroy(): void {
    this.isLoggedIn.complete();
    this.user.complete();
  }

  getToken() {
    return this.token();
  }

  getUserId() {
    return this.userId() ?? null;
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(async () => {
      if (this.oAuthService.hasValidIdToken()) {
        this.token.set(this.oAuthService.getIdToken());
        const profileData = this.oAuthService.getIdentityClaims();
        const userId = profileData['sub'];
        const userData = await getUserByIdOrCreateUser({
          id: userId,
          token: this.token(),
        });
        this.userId.set(userId);
        this.user.next({
          ...userData,
          initials: getInitialsFromName(userData?.username),
        });
        this.isLoggedIn.next(true);
      } else {
        this.isLoggedIn.next(false);
        this.userId.set(null);
      }
    });
    this.oAuthService.events
      .pipe(filter((e: OAuthEvent) => e.type === 'token_expires'))
      .subscribe(() => {
        console.warn('Access token expired. Attempting silent refresh...');
        this.oAuthService.silentRefresh();
      });
    this.oAuthService.events
      .pipe(filter((e: OAuthEvent) => e.type === 'session_terminated'))
      .subscribe(() => {
        console.warn('Session terminated. User needs to log in again.');
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
}

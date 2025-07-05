import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthProviderService } from './auth-provider-service';
import { OAuthService } from 'angular-oauth2-oidc';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

let service: AuthProviderService;
let oAuthService: OAuthService;

describe('AuthProviderService', () => {
  const mockOAuthService = {
    loadDiscoveryDocumentAndTryLogin(): Promise<boolean> {
      return Promise.resolve(true); // Or Promise.reject() for failure cases
    },
    configure: () => of(true),
    setupAutomaticSilentRefresh: () => of(true),
    hasValidIdToken: () => of(true),
    getIdentityClaims: () => of(true),
    initImplicitFlow: () => of(true),
    revokeTokenAndLogout: () => of(true),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OAuthService, useValue: mockOAuthService },
      ],
    });
    oAuthService = TestBed.inject(OAuthService);
    service = TestBed.inject(AuthProviderService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', fakeAsync(() => {
    expect(service).toBeTruthy();
  }));

  it('should handle login', () => {
    spyOn(oAuthService, 'initImplicitFlow').and.callThrough();
    service.login();
    expect(oAuthService.initImplicitFlow).toHaveBeenCalled();
  });

  it('should handle logout', () => {
    spyOn(oAuthService, 'revokeTokenAndLogout').and.callThrough();
    service.logout();
    expect(oAuthService.revokeTokenAndLogout).toHaveBeenCalled();
  });
});

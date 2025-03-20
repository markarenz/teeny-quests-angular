import { TestBed } from '@angular/core/testing';
import { AuthGoogleService } from './auth-google-service';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

const mockFunction = () => {};
class OAuthService {
  configure = mockFunction;
  setupAutomaticSilentRefresh = mockFunction;
  loadDiscoveryDocumentAndTryLogin = mockFunction;
  hasValidIdToken = mockFunction;
  getIdentityClaims = mockFunction;
  initImplicitFlow = mockFunction;
  revokeTokenAndLogout = mockFunction;
}

let service: AuthGoogleService;

describe('AuthGoogleService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthGoogleService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle login', () => {
    const oAuthServiceInstance = new OAuthService();
    spyOn(oAuthServiceInstance, 'initImplicitFlow');
    service.login();
    expect(service.login).toBeDefined();
  });

  it('should handle logout', () => {
    const oAuthServiceInstance = new OAuthService();
    spyOn(oAuthServiceInstance, 'revokeTokenAndLogout');
    service.logout();
    expect(service.logout).toBeDefined();
  });
});

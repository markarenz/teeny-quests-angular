import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { hasAuthGuard } from './has-auth.guard';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('hasAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', () => {
    // @ts-expect-error
    const mockRoute: ActivatedRouteSnapshot = {
      url: [new UrlSegment('admin', {})],
      params: {},
      queryParams: {},
      fragment: '',
      data: {},
      outlet: '',
      component: null,
      routeConfig: null,
      title: '',
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
    };
    const mockState: RouterStateSnapshot = {
      url: '/test',
      // @ts-expect-error
      root: null,
    };
    executeGuard(mockRoute, mockState);
    expect(executeGuard).toBeTruthy();
  });
});

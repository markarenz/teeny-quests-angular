import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { hasAuthGuard } from './has-auth.guard';

describe('hasAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

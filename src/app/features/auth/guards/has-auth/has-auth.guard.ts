import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthProviderService } from '../../services/auth-provider-service';
import { tqConfig } from '@content/constants';

export const hasAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const isLoggedIn: boolean | null =
    inject(AuthProviderService).getIsLoggedIn();

  return isLoggedIn || tqConfig.testMode || router.navigate(['/']);
};

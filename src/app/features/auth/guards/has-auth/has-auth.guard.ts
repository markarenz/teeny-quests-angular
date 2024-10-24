import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGoogleService } from '../../services/auth-google-service';

export const hasAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const isLoggedIn: boolean = inject(AuthGoogleService).getIsLoggedIn();

  return isLoggedIn || router.navigate(['/']);
};

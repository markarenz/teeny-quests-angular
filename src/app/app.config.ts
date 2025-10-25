import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { MainAppService } from './features/main/services/main-app-service';
import { AuthProviderService } from './features/auth/services/auth-provider-service';
import { GameEditorService } from './features/editor/services/game-editor-service/game-editor-service.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    AuthProviderService,
    MainAppService,
    GameEditorService,
    provideAnimations(),
    provideToastr({
      timeOut: 4000,
      extendedTimeOut: 7000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
};

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { MainAppService } from './features/main/services/main-app-service';
import { AuthGoogleService } from './features/auth/services/auth-google-service';
import { GameEditorServiceService } from './features/editor/services/game-editor-service/game-editor-service.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    AuthGoogleService,
    MainAppService,
    GameEditorServiceService,
  ],
};

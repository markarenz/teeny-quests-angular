import { AuthConfig } from 'angular-oauth2-oidc';
import { googleConfigConstants } from '@config/configConstants';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin,
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  ...googleConfigConstants,
};

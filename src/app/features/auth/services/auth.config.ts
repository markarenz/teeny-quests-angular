import { AuthConfig } from 'angular-oauth2-oidc';
import { googleConfigConstants } from '@config/configConstants';

export const authConfig: AuthConfig = {
  issuer: googleConfigConstants.issuer,
  clientId: googleConfigConstants.clientId,
  redirectUri: window.location.origin,
  scope: 'openid email',
  useSilentRefresh: true, // Uses refresh token in the background
  responseType: 'code',
  disablePKCE: false,
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

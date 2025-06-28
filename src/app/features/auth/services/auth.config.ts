import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  dummyClientSecret: 'TQ-dummy-client-secret',
  redirectUri: window.location.origin,
  clientId:
    '306957202865-00enmdkt8csvc8ruck5p96k8gphnmf8o.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
};

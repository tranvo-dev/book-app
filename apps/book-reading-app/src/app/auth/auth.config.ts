export const authConfig = {
  googleClientId: '',
  // Required if using "Web application" client type in Google Cloud Console.
  // Leave empty for "Desktop app" client type.
  googleClientSecret: '',
  redirectUri: 'http://localhost:4200/callback',
  scope: 'openid email profile',
  googleAuthEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  googleTokenEndpoint: 'https://oauth2.googleapis.com/token',
} as const;

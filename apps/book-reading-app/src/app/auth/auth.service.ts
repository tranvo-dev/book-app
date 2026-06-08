import { Injectable, signal } from '@angular/core';
import { authConfig } from './auth.config';

export interface TokenResponse {
  access_token: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

const SESSION_KEY_VERIFIER = 'pkce_code_verifier';
const SESSION_KEY_STATE = 'pkce_state';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly accessToken = signal<string | null>(null);
  readonly tokenResponse = signal<TokenResponse | null>(null);
  readonly error = signal<string | null>(null);

  async initiateLogin(): Promise<void> {
    const verifier = this.generateVerifier();
    const challenge = await this.generateChallenge(verifier);
    const state = this.generateVerifier(16);

    sessionStorage.setItem(SESSION_KEY_VERIFIER, verifier);
    sessionStorage.setItem(SESSION_KEY_STATE, state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: authConfig.googleClientId,
      redirect_uri: authConfig.redirectUri,
      scope: authConfig.scope,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
      access_type: 'offline',
    });

    window.location.href = `${authConfig.googleAuthEndpoint}?${params}`;
  }

  async handleCallback(code: string, returnedState: string): Promise<void> {
    const verifier = sessionStorage.getItem(SESSION_KEY_VERIFIER);
    const expectedState = sessionStorage.getItem(SESSION_KEY_STATE);

    sessionStorage.removeItem(SESSION_KEY_VERIFIER);
    sessionStorage.removeItem(SESSION_KEY_STATE);

    if (!verifier) {
      this.error.set('Missing PKCE verifier. Restart login flow.');
      return;
    }

    if (returnedState !== expectedState) {
      this.error.set('State mismatch. Possible CSRF attack.');
      return;
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: authConfig.redirectUri,
      client_id: authConfig.googleClientId,
      code_verifier: verifier,
    });

    if (authConfig.googleClientSecret) {
      body.set('client_secret', authConfig.googleClientSecret);
    }

    try {
      const response = await fetch(authConfig.googleTokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        this.error.set(`Token exchange failed: ${err.error_description ?? err.error}`);
        return;
      }

      const tokens: TokenResponse = await response.json();
      this.tokenResponse.set(tokens);
      this.accessToken.set(tokens.access_token);
    } catch (e) {
      this.error.set(`Network error during token exchange: ${String(e)}`);
    }
  }

  clearToken(): void {
    this.accessToken.set(null);
    this.tokenResponse.set(null);
    this.error.set(null);
  }

  private generateVerifier(length = 64): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .slice(0, length);
  }

  private async generateChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}

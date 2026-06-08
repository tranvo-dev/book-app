import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { authConfig } from '../auth.config';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-800 mb-2">Book Reading App</h1>
          <p class="text-sm text-gray-500">Dev login — get bearer token for Swagger UI</p>
        </div>

        @if (misconfigured()) {
          <div
            class="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 text-left"
            role="alert"
          >
            <p class="font-semibold mb-1">Configuration required</p>
            <p>
              Set <code class="font-mono bg-amber-100 px-1 rounded">googleClientId</code> in
              <code class="font-mono bg-amber-100 px-1 rounded">auth/auth.config.ts</code> before signing in.
            </p>
          </div>
        }

        <button
          type="button"
          (click)="signIn()"
          [disabled]="loading() || misconfigured()"
          class="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Sign in with Google"
        >
          @if (loading()) {
            <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>Redirecting…</span>
          } @else {
            <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign in with Google</span>
          }
        </button>

        <p class="mt-6 text-xs text-gray-400">
          OAuth 2.0 Authorization Code flow with PKCE
        </p>
      </div>
    </main>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);

  protected readonly loading = signal(false);
  protected readonly misconfigured = signal(!authConfig.googleClientId);

  protected signIn(): void {
    this.loading.set(true);
    this.auth.initiateLogin().catch(() => this.loading.set(false));
  }
}

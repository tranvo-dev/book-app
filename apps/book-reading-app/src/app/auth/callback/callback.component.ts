import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

type Status = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl">

        @if (status() === 'loading') {
          <div class="text-center" role="status" aria-live="polite">
            <svg class="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <p class="text-gray-600">Exchanging authorization code…</p>
          </div>
        }

        @if (status() === 'error') {
          <div role="alert">
            <h1 class="text-xl font-semibold text-red-700 mb-3">Authentication failed</h1>
            <p class="text-sm text-red-600 bg-red-50 rounded-lg p-4 font-mono break-all mb-6">{{ errorMessage() }}</p>
            <button
              type="button"
              (click)="retry()"
              class="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
            >
              Try again
            </button>
          </div>
        }

        @if (status() === 'success') {
          <div>
            <div class="flex items-center gap-2 mb-6">
              <svg class="h-6 w-6 text-green-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h1 class="text-xl font-semibold text-gray-800">Authentication successful</h1>
            </div>

            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="text-sm font-medium text-gray-700" [attr.for]="'access-token'">Access Token</label>
                  <button
                    type="button"
                    (click)="copyToken('access')"
                    class="text-xs text-blue-600 hover:text-blue-800 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
                    [attr.aria-label]="copyAccessLabel()"
                  >
                    {{ copyAccessLabel() }}
                  </button>
                </div>
                <textarea
                  id="access-token"
                  readonly
                  rows="4"
                  class="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg p-3 resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [value]="auth.accessToken()"
                  aria-label="Access token value"
                ></textarea>
              </div>

              @if (auth.tokenResponse()?.id_token) {
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="text-sm font-medium text-gray-700" [attr.for]="'id-token'">ID Token</label>
                    <button
                      type="button"
                      (click)="copyToken('id')"
                      class="text-xs text-blue-600 hover:text-blue-800 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
                      [attr.aria-label]="copyIdLabel()"
                    >
                      {{ copyIdLabel() }}
                    </button>
                  </div>
                  <textarea
                    id="id-token"
                    readonly
                    rows="4"
                    class="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg p-3 resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [value]="auth.tokenResponse()!.id_token"
                    aria-label="ID token value"
                  ></textarea>
                </div>
              }

              <div class="flex flex-wrap gap-2 text-xs text-gray-500">
                @if (auth.tokenResponse()?.expires_in) {
                  <span class="bg-gray-100 rounded px-2 py-1">
                    Expires in {{ auth.tokenResponse()!.expires_in }}s
                  </span>
                }
                @if (auth.tokenResponse()?.scope) {
                  <span class="bg-gray-100 rounded px-2 py-1">
                    Scope: {{ auth.tokenResponse()!.scope }}
                  </span>
                }
                @if (auth.tokenResponse()?.token_type) {
                  <span class="bg-gray-100 rounded px-2 py-1">
                    Type: {{ auth.tokenResponse()!.token_type }}
                  </span>
                }
              </div>

              <div class="pt-2 border-t border-gray-100">
                <p class="text-xs text-gray-400 mb-3">
                  Use the Access Token as <code class="font-mono bg-gray-100 px-1 rounded">Bearer &lt;token&gt;</code> in Swagger UI Authorization.
                </p>
                <div class="flex gap-3">
                  <a
                    href="http://localhost:8080/swagger-ui/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
                  >
                    Open Swagger UI
                  </a>
                  <button
                    type="button"
                    (click)="retry()"
                    class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
                  >
                    Sign in again
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

      </div>
    </main>
  `,
})
export class CallbackComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly status = signal<Status>('loading');
  protected readonly errorMessage = computed(() => this.auth.error() ?? 'Unknown error');

  private copyAccessTimeout: ReturnType<typeof setTimeout> | null = null;
  private copyIdTimeout: ReturnType<typeof setTimeout> | null = null;
  protected readonly copyAccessLabel = signal('Copy');
  protected readonly copyIdLabel = signal('Copy');

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      this.auth.error.set(`Google returned error: ${error} — ${params.get('error_description') ?? ''}`);
      this.status.set('error');
      return;
    }

    if (!code || !state) {
      this.auth.error.set('Missing code or state in callback URL.');
      this.status.set('error');
      return;
    }

    this.auth.handleCallback(code, state).then(() => {
      this.status.set(this.auth.error() ? 'error' : 'success');
    });
  }

  protected copyToken(type: 'access' | 'id'): void {
    const token = type === 'access'
      ? this.auth.accessToken()
      : this.auth.tokenResponse()?.id_token;

    if (!token) return;

    navigator.clipboard.writeText(token).then(() => {
      if (type === 'access') {
        this.copyAccessLabel.set('Copied!');
        if (this.copyAccessTimeout) clearTimeout(this.copyAccessTimeout);
        this.copyAccessTimeout = setTimeout(() => this.copyAccessLabel.set('Copy'), 2000);
      } else {
        this.copyIdLabel.set('Copied!');
        if (this.copyIdTimeout) clearTimeout(this.copyIdTimeout);
        this.copyIdTimeout = setTimeout(() => this.copyIdLabel.set('Copy'), 2000);
      }
    });
  }

  protected retry(): void {
    this.auth.clearToken();
    this.router.navigate(['/login']);
  }
}

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./auth/callback/callback.component').then((m) => m.CallbackComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

import { Routes } from '@angular/router';
import { AuthGuard } from './app/core/guards/auth-guard';
import { AdminGuard } from '/core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/challenges', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent) },
  { 
    path: 'challenges', 
    loadComponent: () => import('./challenges/challenge-list/challenge-list').then(m => m.ChallengeListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'challenges/:id', 
    loadComponent: () => import('./challenges/challenge-detail/challenge-detail').then(m => m.ChallengeDetailComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin').then(m => m.ADMIN_ROUTES),
    canActivate: [AdminGuard]
  },
  { path: '**', redirectTo: '/challenges' }
];
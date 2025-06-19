// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./admin-dashboard/admin-dashboard')
      .then(m => m.AdminDashboardComponent) 
  },
];
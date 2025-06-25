import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable, map, take } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    // Verificación inicial del token para redirección temprana
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.currentUser$.pipe(
      take(1), // Asegura que solo tomamos el valor actual
      map((user: User | null) => {
        if (user?.role === 'admin') {
          return true;
        } else {
          // Redirige a la página principal si no es admin
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
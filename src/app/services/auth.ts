import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { User } from '../models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authState$ = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.authState$.asObservable();
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeUser();
  }

  private initializeUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.reloadCurrentUser().subscribe({
        error: () => this.authState$.next(null)  // Fallback si hay error
      });
    } else {
      this.authState$.next(null);
    }
  }

  login(email: string, password: string): Observable<User> {
  return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
    .pipe(map(response => {
      console.log('Login response:', response);
      if (response.token && response.user) {
        // Almacenar token y usuario
        localStorage.setItem('token', response.token);
        
        // Crear objeto de usuario completo
        const user: User = {
          uid: response.user.uid,
          email: response.user.email,
          username: response.user.username,
          role: response.user.role,
          isBanned: response.user.isBanned,
          aceptaelretoUsername: response.user.aceptaelretoUsername || null,
          createdAt: response.user.createdAt ? new Date(response.user.createdAt) : new Date(),
          updatedAt: response.user.updatedAt ? new Date(response.user.updatedAt) : new Date(), // Añadir esto
          profilePictureUrl: response.user.profilePictureUrl || '',
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authState$.next(user);

        return user;
      } else {
        throw new Error('Respuesta de login inválida');
      }
    }));
}

  register(email: string, password: string, username: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, { email, password, username });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.authState$.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getCurrentUser(): User | null {
    return this.authState$.value;
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUser$;
  }

  isAdmin(): boolean {
    return this.authState$.value?.role === 'admin';
  }

  setAdminRole(userId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/set-admin-role`, { uid: userId });
  }

  banUser(userId: string, isBanned: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/ban-user`, { uid: userId, isBanned });
  }

  reloadCurrentUser(): Observable<User | null> {
  return this.http.get<User>(`${this.apiUrl}/auth/current-user`, {
    headers: {
      'Authorization': `Bearer ${this.getToken()}`
    }
  }).pipe(
    tap(user => {
      if (user) {
        // Asegurarse de que los campos de fecha sean objetos Date
        if (typeof user.createdAt === 'string') {
          user.createdAt = new Date(user.createdAt);
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authState$.next(user);
      }
    }),
    catchError(err => {
      console.error('Error reloading user:', err);
      return of(null);
    })
  );
}

  updateAceptaelretoUsername(username: string): Observable<any> {
    const userId = this.getCurrentUser()?.uid;
    if (!userId) return throwError(() => new Error('Usuario no autenticado'));

    return this.http.put(`${environment.apiUrl}/auth/${userId}/aceptaelreto-username`,
      { username },
      { headers: { 'Authorization': `Bearer ${this.getToken()}` } }
    ).pipe(
      tap(() => {
        // Actualizar el usuario localmente
        const user = this.getCurrentUser();
        if (user) {
          user.aceptaelretoUsername = username;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authState$.next(user);
        }
      })
    );
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/send-password-reset-email`, { email });
  }
  // auth.ts (añadir estos métodos)
  verifyPasswordResetCode(oobCode: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/verify-password-reset-code`, { oobCode });
  }

  confirmPasswordReset(oobCode: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/confirm-password-reset`, { oobCode, newPassword });
  }
}

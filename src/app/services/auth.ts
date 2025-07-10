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
  private readonly SESSION_EXPIRATION_HOURS = 1;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeUser();
  }

  private initializeUser() {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    const lastLogin = localStorage.getItem('lastLogin');

    // Verificar si la sesión ha expirado
    if (token && storedUser && lastLogin) {
      const lastLoginDate = new Date(lastLogin);
      const expirationDate = new Date(lastLoginDate.getTime() + this.SESSION_EXPIRATION_HOURS * 60 * 60 * 1000);

      if (new Date() < expirationDate) {
        // Sesión aún válida
        const user = JSON.parse(storedUser);
        this.authState$.next(user);
        this.reloadCurrentUser().subscribe({
          error: () => this.clearSession() // Si hay error al recargar, limpiamos la sesión
        });
        return;
      } else {
        // Sesión expirada
        this.clearSession();
      }
    } else {
      this.authState$.next(null);
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(map(response => {
        console.log('Login response:', response);
        if (response.token && response.user) {
          // Almacenar token, usuario y marca de tiempo
          localStorage.setItem('token', response.token);
          localStorage.setItem('lastLogin', new Date().toISOString());

          const user: User = {
            uid: response.user.uid,
            email: response.user.email,
            username: response.user.username,
            role: response.user.role || 'user',
            isBanned: response.user.isBanned || false,
            aceptaelretoUsername: response.user.aceptaelretoUsername || null,
            createdAt: response.user.createdAt ? new Date(response.user.createdAt) : new Date(),
            updatedAt: response.user.updatedAt ? new Date(response.user.updatedAt) : new Date(),
            profilePictureUrl: response.user.profilePictureUrl || 'assets/default-avatar.png',
            profileViews: response.user.profileViews || 0,
            challengeWins: response.user.challengeWins || 0,
            totalParticipations: response.user.totalParticipations || 0,
            totalEarnings: response.user.totalEarnings || 0,
            emailVerified: response.user.emailVerified || false
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

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('lastLogin');
    this.authState$.next(null);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']); // Opcional: redirigir a login
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

  sendEmailVerification(): Observable<any> {
    const user = this.getCurrentUser();
    if (!user || !user.email) {
      return throwError(() => new Error('Usuario no autenticado o sin email'));
    }
    return this.http.post(`${this.apiUrl}/auth/send-email-verification`, { email: user.email });
  }

  getTotalUsers(): Observable<number> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/auth/total-users`).pipe(
      map(response => response.total),
      catchError(error => {
        console.error('Error getting total users:', error);
        return of(0); // Retorna 0 si hay error
      })
    );
  }

  // El método ya existe pero asegúrate que esté correcto
  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/send-password-reset-email`, { email });
  }

  verifyPasswordResetCode(oobCode: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/verify-password-reset-code`, { oobCode });
  }

  confirmPasswordReset(oobCode: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/confirm-password-reset`, { oobCode, newPassword });
  }
}

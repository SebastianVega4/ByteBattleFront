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
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly apiUrl = environment.apiUrl; // Añade esta línea

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(map(response => {
        console.log('Login response:', response);
        if (response.token && response.user) {
          // Almacenar token y usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          
          return response.user;
        } else {
          throw new Error('Respuesta de login inválida');
        }
      }))
  }

  register(email: string, password: string, username: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, { email, password, username });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUser$;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
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
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
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
          this.currentUserSubject.next(user);
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

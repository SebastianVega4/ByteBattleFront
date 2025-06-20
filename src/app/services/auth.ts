import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, map, tap, throwError } from 'rxjs';
import { User } from '../models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, public router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // auth.service.ts
  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(map(response => {
        console.log('Login response:', response);
        if (response.token && response.user) {
          // Almacenar token y usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);

          // Verificar token almacenado
          console.log('Token almacenado:', response.token);
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

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  setAdminRole(userId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/set-admin-role`, { uid: userId });
  }

  banUser(userId: string, isBanned: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/ban-user`, { uid: userId, isBanned });
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
}

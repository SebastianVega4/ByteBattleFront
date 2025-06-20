import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(map(response => {
        if (response.success && response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          return response.user;
        } else {
          throw new Error(response.message || 'Error en el inicio de sesión');
        }
      }));
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
}

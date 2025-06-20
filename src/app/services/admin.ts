import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/users`);
  }

  banUser(userId: string, isBanned: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/ban-user`, { userId, isBanned });
  }

  setAdminRole(userId: string, role: 'user' | 'admin'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/set-role`, { userId, role });
  }

  getPendingPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/pending-payments`);
  }

  getPendingResults(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/pending-results`);
  }
}
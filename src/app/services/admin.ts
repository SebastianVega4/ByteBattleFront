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

  getPendingPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/pending-payments`);
  }

  getPendingResults(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/pending-results`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User, Participation, Challenge } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  getUsers(pageIndex: number = 0, pageSize: number = 10): Observable<{users: User[], total: number}> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
      
    return this.http.get<{users: User[], total: number}>(`${environment.apiUrl}/admin/users`, { params });
  }

  banUser(userId: string, isBanned: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/ban-user`, { userId, isBanned });
  }

  setAdminRole(userId: string, role: 'user' | 'admin'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/set-role`, { userId, role });
  }

  getParticipations(status?: string): Observable<Participation[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<Participation[]>(`${environment.apiUrl}/participations`, { params });
  }

  getChallenges(status?: string): Observable<Challenge[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<Challenge[]>(`${environment.apiUrl}/challenges`, { params });
  }

  getPendingPayments(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${environment.apiUrl}/admin/pending-payments`);
  }

  getPendingResults(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${environment.apiUrl}/admin/pending-results`);
  }

  setChallengeWinner(challengeId: string, winnerId: string, score: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${challengeId}/winner`, { winnerId, score });
  }
}
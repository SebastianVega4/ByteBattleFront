import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User, Challenge } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/users`);
  }

  updateUserRole(userId: string, role: string): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/admin/users/${userId}/role`, { role });
  }

  banUser(userId: string, isBanned: boolean): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/admin/users/${userId}/ban`, { isBanned });
  }

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${environment.apiUrl}/admin/challenges`);
  }

  createChallenge(challenge: Omit<Challenge, 'id'>): Observable<Challenge> {
    return this.http.post<Challenge>(`${environment.apiUrl}/admin/challenges`, challenge);
  }

  updateChallenge(id: string, challenge: Partial<Challenge>): Observable<Challenge> {
    return this.http.put<Challenge>(`${environment.apiUrl}/admin/challenges/${id}`, challenge);
  }

  getPendingParticipations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/participations/pending`);
  }

  confirmParticipationPayment(participationId: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/admin/participations/${participationId}/confirm`, {});
  }

  setChallengeWinner(challengeId: string, winnerId: string): Observable<Challenge> {
    return this.http.put<Challenge>(`${environment.apiUrl}/admin/challenges/${challengeId}/winner`, { winnerId });
  }

  markChallengeAsPaid(challengeId: string): Observable<Challenge> {
    return this.http.put<Challenge>(`${environment.apiUrl}/admin/challenges/${challengeId}/paid`, {});
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Challenge, Participation } from '../shared/models/challenge';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  constructor(private http: HttpClient) {}

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${environment.apiUrl}/challenges`);
  }

  getChallengeById(id: string): Observable<Challenge> {
    return this.http.get<Challenge>(`${environment.apiUrl}/challenges/${id}`);
  }

  participate(challengeId: string): Observable<Participation> {
    return this.http.post<Participation>(`${environment.apiUrl}/participations`, {
      challengeId
    });
  }

  confirmPayment(participationId: string): Observable<Participation> {
    return this.http.put<Participation>(`${environment.apiUrl}/participations/${participationId}/confirm-payment`, {});
  }

  submitScore(participationId: string, score: number, code: string): Observable<Participation> {
    return this.http.put<Participation>(`${environment.apiUrl}/participations/${participationId}/submit`, {
      score,
      code
    });
  }

  getLeaderboard(challengeId: string): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${environment.apiUrl}/challenges/${challengeId}/leaderboard`);
  }

  getParticipantCode(participationId: string): Observable<{ code: string }> {
    return this.http.get<{ code: string }>(`${environment.apiUrl}/participations/${participationId}/code`);
  }
}
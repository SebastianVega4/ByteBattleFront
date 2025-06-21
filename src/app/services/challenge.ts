import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Challenge, Participation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  constructor(private http: HttpClient) { }

  getChallenges(status?: string): Observable<Challenge[]> {
    const params: any = {};
    if (status) params.status = status;

    return this.http.get<Challenge[]>(`${environment.apiUrl}/challenges`, {
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getChallenge(id: string): Observable<Challenge> {
    return this.http.get<Challenge>(`${environment.apiUrl}/challenges/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getParticipationsByChallenge(challengeId: string): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${environment.apiUrl}/challenges/${challengeId}/participations`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getChallengeLeaderboard(challengeId: string): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${environment.apiUrl}/challenges/${challengeId}/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  createChallenge(challenge: Omit<Challenge, 'id'>): Observable<Challenge> {
    return this.http.post<Challenge>(`${environment.apiUrl}/challenges`, challenge, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateChallenge(id: string, challenge: Partial<Challenge>): Observable<Challenge> {
    const data: any = { ...challenge };
    if (data.startDate) data.startDate = new Date(data.startDate).toISOString();
    if (data.endDate) data.endDate = new Date(data.endDate).toISOString();

    return this.http.put<Challenge>(`${environment.apiUrl}/challenges/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateChallengeStatus(id: string, status: 'próximo' | 'activo' | 'pasado'): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${id}/status`, { status }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  markChallengeAsPaid(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${id}/mark-as-paid`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  setWinner(challengeId: string, winnerId: string, score: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${challengeId}/winner`,
      { winnerId, score },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Challenge } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  constructor(private http: HttpClient) { }

  getChallenges(status?: string): Observable<Challenge[]> {
    const params: any = {};
    if (status) {
      params.status = status;
    }
    return this.http.get<Challenge[]>(`${environment.apiUrl}/challenges`, { params });
  }

  getChallenge(id: string): Observable<Challenge> {
    return this.http.get<Challenge>(`${environment.apiUrl}/challenges/${id}`);
  }

  createChallenge(challenge: Omit<Challenge, 'id'>): Observable<Challenge> {
    return this.http.post<Challenge>(`${environment.apiUrl}/challenges`, challenge);
  }

  updateChallenge(id: string, challenge: Partial<Challenge>): Observable<Challenge> {
    // Convertir fechas a ISO string si existen
    const data: any = { ...challenge };
    if (data.startDate) data.startDate = new Date(data.startDate).toISOString();
    if (data.endDate) data.endDate = new Date(data.endDate).toISOString();
    
    return this.http.put<Challenge>(`${environment.apiUrl}/challenges/${id}`, data);
  }

  updateChallengeStatus(id: string, status: 'próximo' | 'activo' | 'pasado'): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${id}/status`, { status });
  }

  markChallengeAsPaid(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${id}/mark-paid`, {});
  }

  setWinner(challengeId: string, winnerId: string, score: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${challengeId}/winner`, { winnerId, score });
  }
}
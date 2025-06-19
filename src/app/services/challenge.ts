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

  updateChallengeStatus(id: string, status: 'próximo' | 'activo' | 'pasado'): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${id}/status`, { status });
  }

  markChallengeAsPaid(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/challenges/${id}/mark-paid`, {});
  }
}
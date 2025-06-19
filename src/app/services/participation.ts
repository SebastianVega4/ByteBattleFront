import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Participation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  constructor(private http: HttpClient) { }

  initiateParticipation(challengeId: string): Observable<Participation> {
    return this.http.post<Participation>(`${environment.apiUrl}/participations`, { challengeId });
  }

  submitScoreAndCode(participationId: string, score: number, code: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/participations/${participationId}/submit`, { score, code });
  }

  getParticipantCode(participationId: string): Observable<{ code: string, username: string }> {
    return this.http.get<{ code: string, username: string }>(`${environment.apiUrl}/participations/${participationId}/code`);
  }

  confirmPayment(participationId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/participations/${participationId}/confirm-payment`, {});
  }

  getParticipationsByChallenge(challengeId: string): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${environment.apiUrl}/participations?challengeId=${challengeId}`);
  }
}
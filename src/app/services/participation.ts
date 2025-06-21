import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Participation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    return {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };
  }

  initiateParticipation(challengeId: string): Observable<Participation> {
    return this.http.post<Participation>(
      `${environment.apiUrl}/participations`,
      { challengeId },
      this.getAuthHeaders()
    );
  }

  submitScoreAndCode(participationId: string, score: number, code: string, aceptaelretoUsername: string): Observable<Participation> {
    return this.http.put<Participation>(
      `${environment.apiUrl}/participations/${participationId}/submit`,
      { 
        score, 
        code,
        aceptaelretoUsername,
        submissionDate: new Date().toISOString() 
      },
      this.getAuthHeaders()
    );
  }

  getParticipantCode(participationId: string): Observable<{ code: string, username: string }> {
    return this.http.get<{ code: string, username: string }>(
      `${environment.apiUrl}/participations/${participationId}/code`,
      this.getAuthHeaders()
    );
  }

  confirmPayment(participationId: string): Observable<Participation> {
    return this.http.put<Participation>(
      `${environment.apiUrl}/participations/${participationId}/confirm-payment`,
      { 
        paymentStatus: 'confirmed',
        paymentConfirmationDate: new Date().toISOString()
      },
      this.getAuthHeaders()
    );
  }

  rejectPayment(participationId: string): Observable<Participation> {
    return this.http.put<Participation>(
      `${environment.apiUrl}/participations/${participationId}/reject-payment`,
      { 
        paymentStatus: 'rejected',
        rejectionDate: new Date().toISOString()
      },
      this.getAuthHeaders()
    );
  }

  getParticipationsByChallenge(challengeId: string): Observable<Participation[]> {
    const params = new HttpParams().set('challengeId', challengeId);
    return this.http.get<Participation[]>(
      `${environment.apiUrl}/participations`,
      { 
        params,
        ...this.getAuthHeaders() 
      }
    );
  }

  getParticipationsByUser(userId: string): Observable<Participation[]> {
    return this.http.get<Participation[]>(
      `${environment.apiUrl}/participations`,
      {
        params: new HttpParams().set('userId', userId),
        ...this.getAuthHeaders()
      }
    );
  }

  getParticipationDetails(participationId: string): Observable<Participation> {
    return this.http.get<Participation>(
      `${environment.apiUrl}/participations/${participationId}`,
      this.getAuthHeaders()
    );
  }

  updateParticipationStatus(participationId: string, status: string): Observable<Participation> {
    return this.http.put<Participation>(
      `${environment.apiUrl}/participations/${participationId}/status`,
      { status },
      this.getAuthHeaders()
    );
  }
}
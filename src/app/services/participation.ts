import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Participation } from '../models';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  constructor(private http: HttpClient) { }
  initiateParticipation(challengeId: string): Observable<Participation> {
    if (!challengeId) {
      return throwError(() => new Error('Challenge ID is required'));
    }

    try {
      const options = this.getAuthHeaders(); // Manejamos el token aquí
      return this.http.post<Participation>(
        `${environment.apiUrl}/participations`,
        { challengeId },
        options
      ).pipe(
        tap(response => console.log('Respuesta de participación:', response)),
        catchError(error => {
          console.error('Error en initiateParticipation:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      // Capturamos errores de token aquí
      console.error('Error de autenticación:', error);
      return throwError(() => error);
    }
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token available');
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  submitScoreAndCode(participationId: string, score: number, code: string, aceptaelretoUsername: string): Observable<Participation> {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    console.log('Enviando con headers:', headers); // Para debug

    return this.http.put<Participation>(
      `${environment.apiUrl}/participations/${participationId}/submit`,
      JSON.stringify({
        score,
        code,
        aceptaelretoUsername,
        submissionDate: new Date().toISOString()
      }),
      { headers }
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

  notifyPaymentConfirmation(participationId: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/participations/${participationId}/notify-payment`,
      {},
      this.getAuthHeaders()
    );
  }

  getParticipationsByChallenge(challengeId: string): Observable<Participation[]> {
    if (!challengeId) {
      return throwError(() => new Error('Challenge ID is required'));
    }

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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Participation } from '../models';
import { AuthService } from './auth';
import { NotificationService } from './notification';
import { ConsoleService } from './console';
import { ChallengeService } from './challenge';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private consoleService: ConsoleService,
    public authService: AuthService,
    public challengeService: ChallengeService
  ) { }
  initiateParticipation(challengeId: string): Observable<Participation> {
    if (!challengeId) {
      return throwError(() => new Error('Challenge ID is required'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<Participation>(
      `${environment.apiUrl}/participations`,
      { challengeId },
      { headers }
    ).pipe(
      tap(response => console.log('Respuesta de participación:', response)),
      catchError(error => {
        console.error('Error en initiateParticipation:', error);
        let errorMsg = 'Error al participar en el reto';
        if (error.error?.error) {
          errorMsg = error.error.error;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
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
    this.consoleService.addMessage(`Enviando solución para participación ${participationId}`, 'info');

    return this.http.put<Participation>(
      `${environment.apiUrl}/participations/${participationId}/submit`,
      { score, code, aceptaelretoUsername },
      this.getAuthHeaders()
    ).pipe(
      tap(() => {
        this.consoleService.addMessage(`Solución enviada correctamente. Puntaje: ${score}`, 'success');
      }),
      catchError(error => {
        this.consoleService.addMessage(`Error al enviar solución: ${error.message}`, 'error');
        return throwError(() => error);
      })
    );
  }

  getParticipantCode(participationId: string): Observable<{ code: string, username: string }> {
    return this.http.get<{ code: string, username: string }>(
      `${environment.apiUrl}/participations/${participationId}/code`,
      this.getAuthHeaders()
    );
  }

  confirmPayment(participationId: string): Observable<{ message: string, newTotalPot: number }> {
    return this.http.put<{ message: string, newTotalPot: number }>(
      `${environment.apiUrl}/participations/${participationId}/confirm-payment`,
      {}
    ).pipe(
      switchMap(response => {
        return this.getParticipationDetails(participationId).pipe(
          tap(participation => {
            this.notificationService.sendNotification(
              participation.userId,
              'Pago confirmado',
              `Tu pago ha sido confirmado para el reto "${participation.challenge?.title}"`,
              'payment'
            ).subscribe();
          }),
          map(() => response)
        );
      })
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

  getPendingResults(): Observable<Participation[]> {
    return this.http.get<any>(`${environment.apiUrl}/participations/pending-results`).pipe(
      map(response => {
        // Definir tipo explícito para el parámetro p
        const parseItem = (p: any): Participation => {
          return {
            ...p,
            challenge: p.challenge ? {
              ...p.challenge,
              startDate: p.challenge.startDate ? new Date(p.challenge.startDate) : undefined,
              endDate: p.challenge.endDate ? new Date(p.challenge.endDate) : undefined
            } : undefined,
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            submissionDate: p.submissionDate ? new Date(p.submissionDate) : undefined,
            paymentConfirmationDate: p.paymentConfirmationDate ? new Date(p.paymentConfirmationDate) : undefined
          };
        };

        // Si la respuesta es un array, devolverlo directamente
        if (Array.isArray(response)) {
          return response.map(parseItem);
        }

        // Si es un objeto con propiedad results
        if (response.results && Array.isArray(response.results)) {
          return response.results.map(parseItem);
        }

        throw new Error('Formato de respuesta inválido');
      }),
      catchError(error => {
        console.error('Error getting pending results:', error);
        return of([]); // Devuelve array vacío en caso de error
      })
    );
  }

  private parseParticipation(p: any): Participation {
    return {
      ...p,
      challenge: p.challenge ? {
        ...p.challenge,
        startDate: p.challenge.startDate ? new Date(p.challenge.startDate) : undefined,
        endDate: p.challenge.endDate ? new Date(p.challenge.endDate) : undefined
      } : undefined,
      createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
      submissionDate: p.submissionDate ? new Date(p.submissionDate) : undefined,
      paymentConfirmationDate: p.paymentConfirmationDate ? new Date(p.paymentConfirmationDate) : undefined
    };
  }

  setWinner(challengeId: string, winnerId: string, score: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(
      `${environment.apiUrl}/challenges/${challengeId}/winner`,
      { winnerId, score },
      { headers }
    ).pipe(
      switchMap(() => {
        // Obtener el reto para saber el premio
        return this.challengeService.getChallenge(challengeId).pipe(
          switchMap(challenge => {
            // Actualizar las ganancias del usuario
            return this.http.put(
              `${environment.apiUrl}/users/${winnerId}/increment-earnings`,
              { amount: challenge.totalPot },
              { headers }
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error setting winner:', error);
        throw error;
      })
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
    ).pipe(
      catchError(error => {
        console.error('Error getting participations by challenge:', error);
        return of([]); // Devuelve array vacío en caso de error
      })
    );
  }

  getParticipationsByUser(userId: string): Observable<Participation[]> {
    return this.http.get<Participation[]>(
      `${environment.apiUrl}/participations`,
      {
        params: new HttpParams().set('userId', userId),
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    ).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.error('Acceso no autorizado:', error);
          return throwError(() => new Error('No tienes permisos para ver estas participaciones'));
        } else {
          console.error('Error al obtener participaciones:', error);
          return throwError(() => new Error('Error al cargar participaciones'));
        }
      })
    );
  }

  getParticipationDetails(participationId: string): Observable<Participation> {
    return this.http.get<Participation>(
      `${environment.apiUrl}/participations/${participationId}`,
      this.getAuthHeaders()
    ).pipe(
      catchError(error => {
        console.error('Error al obtener detalles de participación', error);
        return throwError(() => new Error('Error al cargar los datos de participación'));
      })
    );
  }

  getParticipationsByStatus(status: string): Observable<Participation[]> {
    return this.http.get<Participation[]>(
      `${environment.apiUrl}/participations/status/${status}`,
      this.getAuthHeaders()
    ).pipe(
      catchError(error => {
        console.error('Error getting participations by status:', error);
        return of([]); // Devuelve array vacío en caso de error
      })
    );
  }

  updateParticipationStatus(participationId: string, status: string): Observable<Participation> {
    return this.http.put<Participation>(
      `${environment.apiUrl}/participations/${participationId}/status`,
      { status },
      this.getAuthHeaders()
    );
  }

  incrementUserParticipations(userId: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/users/${userId}/increment-participations`,
      {},
      this.getAuthHeaders()
    );
  }

  // Modificar el método getParticipationsByChallengeIds para permitir consultas públicas
  getParticipationsByChallengeIds(challengeIds: string[], requireAuth = false): Observable<Participation[]> {
    if (!challengeIds || challengeIds.length === 0) {
      return of([]);
    }

    const params = new HttpParams().set('challengeIds', challengeIds.join(','));

    // Si no requiere autenticación, hacer la petición sin headers
    if (!requireAuth) {
      return this.http.get<Participation[]>(
        `${environment.apiUrl}/participations/by-challenges`,
        { params }
      ).pipe(
        catchError(error => {
          console.error('Error getting participations by challenge IDs:', error);
          return of([]);
        })
      );
    }

    // Si requiere autenticación, usar los headers
    return this.http.get<Participation[]>(
      `${environment.apiUrl}/participations/by-challenges`,
      {
        params,
        ...this.getAuthHeaders()
      }
    ).pipe(
      catchError(error => {
        console.error('Error getting participations by challenge IDs:', error);
        return of([]);
      })
    );
  }
}
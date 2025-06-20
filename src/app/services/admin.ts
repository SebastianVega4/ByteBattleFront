import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User, Participation, Challenge } from '../models';
import { map, catchError } from 'rxjs/operators'; // Importar operadores aquí
import { Timestamp } from '@angular/fire/firestore'; // Importar Timestamp si es necesario

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  // admin.ts
  getUsers(pageIndex: number = 0, pageSize: number = 10): Observable<{ users: User[], total: number }> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{ users: User[], total: number }>(`${environment.apiUrl}/admin/users`, { params }).pipe(
      map(response => {
        if (response && response.users) {
          // Convertir fechas de Firebase si es necesario
          const users = response.users.map(user => ({
            ...user,
            createdAt: this.convertFirebaseDate(user.createdAt),
            updatedAt: this.convertFirebaseDate(user.updatedAt)
          }));
          return { users, total: response.total };
        }
        throw new Error('Respuesta inválida del servidor');
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }

  private convertFirebaseDate(date: any): Date {
    if (date?.toDate) {
      return date.toDate();
    } else if (date?.seconds) {
      return new Date(date.seconds * 1000);
    }
    return new Date(date);
  }

  banUser(userId: string, isBanned: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/ban-user`, { userId, isBanned });
  }

  setAdminRole(userId: string, role: 'user' | 'admin'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/set-admin-role`, { userId, role });
  }

  getParticipations(status?: string): Observable<Participation[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<Participation[]>(`${environment.apiUrl}/admin/participations`, { params });
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
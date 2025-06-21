import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User, Participation, Challenge } from '../models';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  getUsers(pageIndex: number = 0, pageSize: number = 10): Observable<{ users: User[], total: number }> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{ users: User[], total: number }>(
      `${environment.apiUrl}/admin/users`, 
      { 
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    ).pipe(
      map(response => ({
        users: response.users.map(user => ({
          ...user,
          createdAt: this.convertFirebaseDate(user.createdAt),
          updatedAt: this.convertFirebaseDate(user.updatedAt)
        })),
        total: response.total
      })),
      catchError(error => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }

  banUser(userId: string, isBanned: boolean): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/admin/ban-user`,
      { uid: userId, isBanned },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  setAdminRole(userId: string, role: 'user' | 'admin'): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/admin/set-admin-role`,
      { uid: userId, role },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  getChallenges(status?: string): Observable<Challenge[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<Challenge[]>(
      `${environment.apiUrl}/admin/challenges`,
      { 
        params,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    ).pipe(
      map(challenges => challenges.map(challenge => ({
        ...challenge,
        startDate: this.convertFirebaseDate(challenge.startDate),
        endDate: this.convertFirebaseDate(challenge.endDate),
        createdAt: this.convertFirebaseDate(challenge.createdAt)
      })))
    );
  }

  getParticipations(status?: string, challengeId?: string): Observable<Participation[]> {
  let params = new HttpParams();
  if (status) params = params.set('status', status);
  if (challengeId) params = params.set('challengeId', challengeId);

  return this.http.get<Participation[]>(
    `${environment.apiUrl}/admin/participations`,
    { 
      params,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }
  ).pipe(
    map(participations => participations.map(p => ({
      ...p,
      id: p.id,
      createdAt: this.convertFirebaseDate(p.createdAt),
      submissionDate: p.submissionDate ? this.convertFirebaseDate(p.submissionDate) : undefined,
      paymentConfirmationDate: p.paymentConfirmationDate ? this.convertFirebaseDate(p.paymentConfirmationDate) : undefined
    })))
  );
}

  confirmPayment(participationId: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/admin/confirm-payment`,
      { participationId },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  setChallengeWinner(challengeId: string, winnerId: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/admin/set-winner`,
      { challengeId, winnerId },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  markChallengeAsPaid(challengeId: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/admin/mark-as-paid`,
      { challengeId },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
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
}
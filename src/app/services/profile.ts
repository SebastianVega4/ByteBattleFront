import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  getProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      map(user => this.setDefaultProfileValues(user))
    );
  }

  updateProfile(userId: string, profileData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, profileData);
  }

  changePassword(userId: string, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  sendEmailVerification(): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-email-verification`, {});
  }

  incrementProfileViews(userId: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${userId}/increment-views`,
      {},
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  incrementUserEarnings(userId: string, amount: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${userId}/increment-earnings`,
      { amount },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  getPublicProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}/public`).pipe(
      map(user => this.setDefaultProfileValues(user))
    );
  }
  private setDefaultProfileValues(user: User): User {
    return {
      ...user,
      totalEarnings: user.totalEarnings ?? 0,
      totalParticipations: user.totalParticipations ?? 0,
      challengeWins: user.challengeWins ?? 0,
      profileViews: user.profileViews ?? 0,
      emailVerified: user.emailVerified ?? false,
      age: user.age ?? undefined,
      description: user.description ?? '',
      institution: user.institution ?? '',
      professionalTitle: user.professionalTitle ?? '',
      universityCareer: user.universityCareer ?? '',
      profilePictureUrl: user.profilePictureUrl ?? 'assets/default-avatar.png'
    };
  }
}
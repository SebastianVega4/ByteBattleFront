import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  getProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
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
}
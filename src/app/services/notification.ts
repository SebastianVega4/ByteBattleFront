import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Notification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) { }

  getNotifications(limit: number = 10): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications?limit=${limit}`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/notifications/${notificationId}/read`, {});
  }
}
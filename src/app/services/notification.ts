import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Notification } from '../models/notification.model';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Recargar notificaciones cuando el usuario cambie
    this.authService.getCurrentUserObservable().subscribe(user => {
      if (user) {
        this.loadNotifications();
      } else {
        this.clearNotifications();
      }
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications`);
  }

  loadNotifications() {
  this.http.get<Notification[]>(`${environment.apiUrl}/notifications`).subscribe({
    next: (notifications) => {
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount(notifications);
    },
    error: (err) => {
      console.error('Error loading notifications', err);
      this.notificationsSubject.next([]);
      this.updateUnreadCount([]);
    }
  });
}

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/notifications/${notificationId}/read`, {}).pipe(
      tap(() => {
        const notifications = this.notificationsSubject.value.map(n =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        );
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }

  sendNotification(userId: string, title: string, message: string, type: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notifications`, {
      userId,
      title,
      message,
      type
    });
  }

  private updateUnreadCount(notifications: Notification[]) {
    const count = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(count);
  }

  private clearNotifications() {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
  }
}
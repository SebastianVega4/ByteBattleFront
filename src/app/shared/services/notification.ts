import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, take, map, catchError } from 'rxjs/operators';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'participation' | 'payment' | 'admin' | 'general';
  isRead: boolean;
  createdAt: Date;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.initializeNotifications();
  }

  private initializeNotifications(): void {
    this.authService.authStatus$.pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          const userId = this.authService.getCurrentUser()?.uid;
          if (userId) {
            return this.firestore.collection<Notification>('notifications', ref =>
              ref.where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(20)
            ).valueChanges({ idField: 'id' }).pipe(
              map(notifications => notifications.map(notif => ({
                ...notif,
                createdAt: (notif.createdAt as any).toDate()
              }))),
              catchError(error => {
                console.error('Error loading notifications:', error);
                return of([]);
              })
            );
          }
        }
        return of([]);
      })
    ).subscribe(notifications => {
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount(notifications);
    });
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  sendNotification(userId: string, title: string, message: string, type: Notification['type'], link?: string): Promise<string> {
    const notification: Omit<Notification, 'id'> = {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date(),
      link
    };

    return this.firestore.collection('notifications').add(notification)
      .then(docRef => docRef.id)
      .catch(error => {
        console.error('Error sending notification:', error);
        throw error;
      });
  }

  sendAdminNotification(title: string, message: string): Promise<void> {
    return this.firestore.collection('users', ref =>
      ref.where('role', '==', 'admin')
    ).get().pipe(
      take(1),
      map(snapshot => {
        const promises = snapshot.docs.map(doc => {
          const adminId = doc.id;
          return this.sendNotification(adminId, title, message, 'admin');
        });
        return Promise.all(promises);
      }),
      map(() => undefined)
    ).toPromise();
  }

  markAsRead(notificationId: string): Promise<void> {
    return this.firestore.collection('notifications').doc(notificationId).update({
      isRead: true
    }).catch(error => {
      console.error('Error marking notification as read:', error);
      throw error;
    });
  }

  // src/app/shared/services/notification.ts
  async markAllAsRead(): Promise<void> {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('No user logged in');

    const snapshot = await this.firestore.collection('notifications', ref =>
      ref.where('userId', '==', userId)
        .where('isRead', '==', false)
    ).get().pipe(take(1)).toPromise();

    if (snapshot) {
      const batch = this.firestore.firestore.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();
    }
  }

  getRecentNotifications(limit: number = 5): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.slice(0, limit))
    );
  }
}
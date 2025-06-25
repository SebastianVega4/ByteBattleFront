import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification';
import { Notification } from '../../../models/notification.model';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  isLoading = true;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    this.notificationService.notifications$.subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications', err);
        this.isLoading = false;
      }
    });
    this.notificationService.loadNotifications();
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead && notification.id) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
        },
        error: (err) => console.error('Error marking notification as read', err)
      });
    }
  }

  markAllAsRead() {
    const unreadNotifications = this.notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    const markAsReadObservables = unreadNotifications.map(n =>
      this.notificationService.markAsRead(n.id)
    );

    forkJoin(markAsReadObservables).subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
      },
      error: (err) => console.error('Error marking all notifications as read', err)
    });
  }

  deleteNotification(notificationId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      this.notificationService.deleteNotification(notificationId).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notificationId);
        },
        error: (err) => console.error('Error deleting notification', err)
      });
    }
  }

  deleteAllRead() {
    const readNotifications = this.notifications.filter(n => n.isRead);
    if (readNotifications.length === 0) return;

    if (confirm(`¿Estás seguro de que quieres eliminar ${readNotifications.length} notificaciones leídas?`)) {
      const deleteObservables = readNotifications.map(n =>
        this.notificationService.deleteNotification(n.id)
      );

      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => !n.isRead);
        },
        error: (err) => console.error('Error deleting read notifications', err)
      });
    }
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'payment': 'bi bi-credit-card',
      'admin_payment': 'bi bi-cash-stack',
      'participation': 'bi bi-trophy',
      'winner': 'bi bi-award',
      'default': 'bi bi-bell'
    };
    return icons[type] || icons['default'];
  }
}
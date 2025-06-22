import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification';
import { Notification } from '../../../models/notification.model';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

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
      this.notificationService.markAsRead(notification.id).subscribe();
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
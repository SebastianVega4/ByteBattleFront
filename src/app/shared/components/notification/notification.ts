import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification';
import { Notification } from '../../models/notification';
import { AuthService } from '../../../auth/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  showNotifications = false;
  private notificationsSub!: Subscription;
  private unreadSub!: Subscription;
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationsSub = this.notificationService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );

    this.unreadSub = this.notificationService.unreadCount$.subscribe(
      count => this.unreadCount = count
    );
  }

  ngOnDestroy(): void {
    this.notificationsSub.unsubscribe();
    this.unreadSub.unsubscribe();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.unreadCount > 0) {
      this.markAllAsRead();
    }
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).catch(
        error => console.error('Error marking notification as read:', error)
      );
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().catch(
      error => console.error('Error marking all notifications as read:', error)
    );
  }

  handleNotificationClick(notification: Notification): void {
    this.markAsRead(notification);
    this.showNotifications = false;
    
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }
}
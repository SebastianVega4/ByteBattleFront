import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification';
import { Notification } from '../../../models/notification.model';
import { ClickOutsideModule } from 'ng-click-outside';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  unreadCount = 0;
  avatarUrl = 'assets/default-avatar.png';
  showNotificationDropdown = false;
  showUserDropdown = false;
  latestNotifications: Notification[] = [];
  notifications: Notification[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.authService.getCurrentUser()) {
      this.loadNotifications();
      this.generateAvatar();
    }

    // Suscribirse a cambios en las notificaciones
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });

    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.latestNotifications = notifications.slice(0, 2);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadNotifications() {
    this.notificationService.loadNotifications();
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        // Actualizar estado local
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
      }
    });
  }

  generateAvatar() {
    const user = this.authService.getCurrentUser();
    if (user && user.username) {
      const initials = user.username.charAt(0).toUpperCase();
      this.avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=00f2fe&color=fff&size=128`;
    }
  }

  toggleNotificationDropdown() {
    this.showNotificationDropdown = !this.showNotificationDropdown;
  }

  toggleUserDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
    this.showNotificationDropdown = false;
  }

  getNotificationIcon(type: string): string {
    const iconMap: {[key: string]: string} = {
      'admin_payment': 'bi bi-cash-coin',
      'challenge_completed': 'bi bi-trophy',
      'message': 'bi bi-chat-left-text',
      'warning': 'bi bi-exclamation-triangle',
      'info': 'bi bi-info-circle',
      'payment': 'bi bi-credit-card',
      'winner': 'bi bi-award',
      'default': 'bi bi-bell'
    };
    return iconMap[type] || iconMap['default'];
  }

   @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isNavbarItem = target.closest('.navbar-nav') !== null;
    const isDropdown = target.closest('.dropdown-menu') !== null;

    if (!isNavbarItem && !isDropdown) {
      this.showUserDropdown = false;
      this.showNotificationDropdown = false;
    }
  }
}
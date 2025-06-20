import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  unreadCount = 0;
  avatarUrl = 'assets/default-avatar.png';
  notifications: any[] = [];

  constructor(
    public authService: AuthService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    if (this.authService.getCurrentUser()) {
      this.loadNotifications();
      this.generateAvatar();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadNotifications() {
    // Simular servicio de notificaciones
    //this.notificationService.getUnreadCount().subscribe(count => {
      //this.unreadCount = count;
    //});
  }

  generateAvatar() {
    const user = this.authService.getCurrentUser();
    if (user && user.username) {
      // Generar avatar con iniciales
      const initials = user.username.charAt(0).toUpperCase();
      this.avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=00f2fe&color=fff&size=128`;
    }
  }
}
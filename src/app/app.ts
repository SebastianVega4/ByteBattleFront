import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from './shared/services/notification';
import { NotificationComponent } from "./shared/components/notification/notification";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NotificationComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ByteBattle';
  isAuthenticated = false;
  private authSub!: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.authSub = this.authService.authStatus$.subscribe(
      authStatus => {
        this.isAuthenticated = authStatus;
      }
    );
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
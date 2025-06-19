import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from './shared/services/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ByteBattle';
  isAuthenticated = false;
  private authSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
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

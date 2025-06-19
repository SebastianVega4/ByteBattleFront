import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
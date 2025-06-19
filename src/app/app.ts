import { Component } from '@angular/core';
import { AuthService } from './services/auth';
import { Router } from '@angular/router';
import { FooterComponent } from "./components/shared/footer/footer";
import { HeaderComponent } from "./components/shared/header/header";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [FooterComponent, HeaderComponent]
})
export class AppComponent {
  title = 'ByteBattle';
  
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true, // Añadir esto
  imports: [CommonModule, RouterModule], // Importar módulos necesarios
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}
}
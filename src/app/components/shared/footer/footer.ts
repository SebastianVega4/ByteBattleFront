import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true, // Añadir esto
  imports: [CommonModule, RouterModule], // Importar módulos necesarios
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
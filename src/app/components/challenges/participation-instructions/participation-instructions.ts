import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipationService } from '../../../services/participation';
import { AuthService } from '../../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Challenge } from '../../../models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-participation-instructions',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './participation-instructions.html',
  styleUrls: ['./participation-instructions.scss']
})
export class ParticipationInstructions {
  @Input() challenge!: Challenge;
  nequiNumber: string = '3233890068';
  isSubmitting = false;
  paymentRequested = false;

  constructor(
    public authService: AuthService,
    private participationService: ParticipationService,
    private snackBar: MatSnackBar,
    private router: Router // Inyecta Router aquí
  ) { }

  // En participation-instructions.ts
  confirmPayment() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Debes iniciar sesión para participar', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    if (!this.challenge || !('id' in this.challenge)) {
      console.error('Challenge no válido:', this.challenge);
      this.snackBar.open('Error: No se pudo identificar el reto. Por favor recarga la página.', 'Cerrar', { duration: 5000 });
      return;
    }

    this.isSubmitting = true;

    this.participationService.initiateParticipation(this.challenge.id).subscribe({
      next: (participation) => {
        this.isSubmitting = false;
        this.paymentRequested = true;
        this.snackBar.open('Solicitud enviada. El administrador verificará tu pago.', 'Cerrar', {
          duration: 5000
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error completo:', err);
        let errorMessage = 'Error al enviar la solicitud';

        if (err.status === 403) {
          this.snackBar.open('Tu cuenta ha sido suspendida', 'Cerrar', { duration: 5000 });
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 401) {
          errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 404) {
          errorMessage = 'Servicio no disponible. Por favor intenta más tarde.';
        }

        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
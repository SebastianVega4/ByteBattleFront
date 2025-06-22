import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipationService } from '../../../services/participation';
import { AdminNotificationService } from '../../../services/admin-notification'
import { AuthService } from '../../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Challenge } from '../../../models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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
  @Input() participationId!: string;
  nequiNumber: string = '3133890068';
  isSubmitting = false;
  paymentRequested = false;

  constructor(
    public authService: AuthService,
    public adminNotificationService: AdminNotificationService,
    private participationService: ParticipationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  confirmPayment() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Debes iniciar sesión para participar', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    if (!this.participationId) {
      this.initiateParticipation();
    } else {
      this.notifyPayment();
    }
  }

  private initiateParticipation() {
    if (!this.challenge?.id) {
      console.error('Challenge data:', this.challenge);
      this.snackBar.open('Error: No se pudo identificar el reto', 'Cerrar', { duration: 5000 });
      return;
    }

    this.isSubmitting = true;

    this.participationService.initiateParticipation(this.challenge.id).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.paymentRequested = true;
        this.snackBar.open(response.message || 'Solicitud enviada correctamente', 'Cerrar', {
          duration: 5000
        });
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  // Agrega en el método notifyPayment
  private notifyPayment() {
    this.isSubmitting = true;

    this.participationService.notifyPaymentConfirmation(this.participationId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.paymentRequested = true;
        this.snackBar.open('Notificación de pago enviada correctamente', 'Cerrar', {
          duration: 5000
        });

        // Notificar a los administradores
        this.adminNotificationService.notifyNewPayment({
          id: this.participationId,
          user: { username: this.authService.getCurrentUser()?.username },
          challenge: { title: this.challenge.title }
        });
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private handleError(err: any) {
    this.isSubmitting = false;
    let errorMessage = 'Error al procesar la solicitud';

    if (err.status === 403) {
      errorMessage = 'Tu cuenta ha sido suspendida';
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (err.error?.message) {
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

}
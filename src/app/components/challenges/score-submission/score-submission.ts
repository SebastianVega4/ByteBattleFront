import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipationService } from '../../../services/participation';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-score-submission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-submission.html',
  styleUrls: ['./score-submission.scss']
})
export class ScoreSubmission implements OnInit {
  @Input() participationId!: string;
  score: number | null = null;
  code: string = '';
  aceptaelretoUsername: string = '';
  isSubmitting = false;
  submissionError: string | null = null;
  isLoadingPreviousData = true;
  isUsernameEditable = true; // Nueva propiedad para controlar la edición

  constructor(
    private participationService: ParticipationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.loadPreviousParticipationData();
  }

  private loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user?.aceptaelretoUsername) {
      this.aceptaelretoUsername = user.aceptaelretoUsername;
      this.isUsernameEditable = false; // Si ya tiene username, no es editable
    }
  }

  private loadPreviousParticipationData() {
    if (!this.participationId) {
      this.isLoadingPreviousData = false;
      return;
    }

    this.participationService.getParticipationDetails(this.participationId).subscribe({
      next: (participation) => {
        if (participation) {
          this.score = participation.score || null;
          this.code = participation.code || '';
          // Solo actualizar el username si no está ya definido
          if (!this.aceptaelretoUsername) {
            this.aceptaelretoUsername = participation.aceptaelretoUsername || '';
          }
        }
        this.isLoadingPreviousData = false;
      },
      error: (err) => {
        console.error('Error al cargar participación previa', err);
        this.isLoadingPreviousData = false;
        this.submissionError = 'Error al cargar los datos de participación previa';
      }
    });
  }

  submit() {
    if (!this.score || !this.code || !this.aceptaelretoUsername) {
      this.submissionError = 'Todos los campos son requeridos';
      return;
    }

    this.isSubmitting = true;
    this.submissionError = null;

    this.participationService.submitScoreAndCode(
      this.participationId,
      this.score,
      this.code,
      this.aceptaelretoUsername
    ).subscribe({
      next: (participation) => {
        this.isSubmitting = false;
        this.updateAceptaelretoUsername();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submissionError = 'Error al enviar los datos. Por favor intenta nuevamente.';
        console.error('Error al enviar solución', err);
      }
    });
  }

  private updateAceptaelretoUsername() {
    const user = this.authService.getCurrentUser();
    if (user && !user.aceptaelretoUsername) {
      this.authService.updateAceptaelretoUsername(this.aceptaelretoUsername).subscribe({
        next: () => {
          console.log('Username actualizado');
          this.isUsernameEditable = false; // Después de guardar, ya no es editable
        },
        error: (err) => console.error('Error actualizando username', err)
      });
    }
  }
}
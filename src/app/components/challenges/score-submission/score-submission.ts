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

  constructor(
    private participationService: ParticipationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Cargar el username de aceptaelreto si existe
    const user = this.authService.getCurrentUser();
    if (user?.aceptaelretoUsername) {
      this.aceptaelretoUsername = user.aceptaelretoUsername;
    }
  }

  submit() {
    console.log('Token actual:', localStorage.getItem('token'));
  console.log('Datos a enviar:', {
    score: this.score,
    code: this.code,
    aceptaelretoUsername: this.aceptaelretoUsername
  });
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
      const user = this.authService.getCurrentUser();
      if (user && !user.aceptaelretoUsername) {
        this.authService.updateAceptaelretoUsername(this.aceptaelretoUsername).subscribe({
          next: () => console.log('Username actualizado'),
          error: (err) => console.error('Error actualizando username', err)
        });
      }
    },
    error: (err) => {
      this.isSubmitting = false;
      this.submissionError = 'Error al enviar los datos. Por favor intenta nuevamente.';
      console.error('Error al enviar solución', err);
    }
  });
}

  private updateUserAceptaelretoUsername() {
    const user = this.authService.getCurrentUser();
    if (user && !user.aceptaelretoUsername) {
      this.authService.updateAceptaelretoUsername(this.aceptaelretoUsername);
    }
  }
}
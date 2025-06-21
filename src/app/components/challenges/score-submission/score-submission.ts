import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipationService } from '../../../services/participation';

@Component({
  selector: 'app-score-submission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-submission.html',
  styleUrls: ['./score-submission.scss']
})
export class ScoreSubmission {
  @Input() participationId!: string;
  score: number | null = null;
  code: string = '';
  aceptaelretoUsername: string = '';
  isSubmitting = false;
  submissionError: string | null = null;

  constructor(private participationService: ParticipationService) {}

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
      // Mostrar mensaje de éxito
      console.log('Solución enviada con éxito', participation);
    },
    error: (err) => {
      this.isSubmitting = false;
      this.submissionError = 'Error al enviar los datos. Por favor intenta nuevamente.';
      console.error('Error al enviar solución', err);
    }
  });
}
}
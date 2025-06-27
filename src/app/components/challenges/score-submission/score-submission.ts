import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipationService } from '../../../services/participation';
import { AuthService } from '../../../services/auth';
import { take, switchMap, of, catchError, filter, map } from 'rxjs';

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
  isUsernameEditable = true;

  constructor(
    private participationService: ParticipationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.authService.currentUser$
      .pipe(
        filter(user => user !== null),
        take(1),
        switchMap(user => {
          console.log('Usuario cargado:', user);

          // Si no hay participationId, cargar solo datos de usuario
          if (!this.participationId) {
            if (user?.aceptaelretoUsername) {
              this.aceptaelretoUsername = user.aceptaelretoUsername;
              this.isUsernameEditable = false;
            }
            this.isLoadingPreviousData = false;
            return of(null);
          }

          // Primero cargar participación
          return this.participationService.getParticipationDetails(this.participationId)
            .pipe(
              catchError(err => {
                console.error('Error al cargar participación:', err);
                return of(null);
              }),
              map(participation => {
                // Datos de participación tienen prioridad
                if (participation) {
                  this.score = participation.score || null;
                  this.code = participation.code || '';

                  if (participation.aceptaelretoUsername) {
                    this.aceptaelretoUsername = participation.aceptaelretoUsername;
                    this.isUsernameEditable = false; // Si viene de participación, no es editable
                  }
                }

                // Complementar con datos de usuario solo si no hay datos de participación
                if (user?.aceptaelretoUsername && !this.aceptaelretoUsername) {
                  this.aceptaelretoUsername = user.aceptaelretoUsername;
                  this.isUsernameEditable = false;
                }

                return participation;
              })
            );
        })
      )
      .subscribe({
        next: () => {
          this.isLoadingPreviousData = false;
        },
        error: (err) => {
          console.error('Error en el flujo de carga:', err);
          this.isLoadingPreviousData = false;
          this.submissionError = 'Error al cargar datos iniciales';
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
          this.isUsernameEditable = false; // Después de guardar, ya no es editable
        },
        error: (err) => console.error('Error actualizando username', err)
      });
    }
  }
}
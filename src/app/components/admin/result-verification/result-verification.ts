import { Component, Inject, OnInit } from '@angular/core';
import { ParticipationService } from '../../../services/participation';
import { Participation } from '../../../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { ChallengeService } from '../../../services/challenge';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-result-verification',
  templateUrl: './result-verification.html',
  styleUrls: ['./result-verification.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class ResultVerification implements OnInit {
  pendingResults: Participation[] = [];
  isLoading = true;
  displayedColumns: string[] = ['user', 'challenge', 'score', 'code', 'actions'];

  constructor(
    private participationService: ParticipationService,
    private challengeService: ChallengeService,
    private userService: AuthService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadPendingResults();
  }

  loadPendingResults() {
    this.isLoading = true;
    this.participationService.getPendingResults().subscribe({
      next: (participations) => {
        this.pendingResults = participations;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending results', err);
        this.isLoading = false;
        this.snackBar.open('Error al cargar resultados pendientes. Por favor intente más tarde.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.pendingResults = [];
      }
    });
  }

  viewCode(code: string) {
    this.dialog.open(CodeViewerDialogComponent, {
      width: '800px',
      data: { code }
    });
  }

  setWinner(participation: Participation) {
    // Verificación explícita del score
    if (!participation.challengeId || !participation.userId || participation.score === undefined) {
      this.snackBar.open('Datos incompletos para asignar ganador', 'Cerrar', { duration: 3000 });
      return;
    }

    // Ahora TypeScript sabe que participation.score es number (no undefined)
    const score: number = participation.score;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Ganador',
        message: `¿Estás seguro que ${participation.user?.username} es el ganador del reto "${participation.challenge?.title}" con ${score} puntos?`
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.isLoading = true;

        this.challengeService.setWinner(
          participation.challengeId,
          participation.userId,
          score // Usamos la variable score que sabemos es number
        ).subscribe({
          next: () => {
            this.snackBar.open('Ganador asignado correctamente', 'Cerrar', { duration: 3000 });
            this.loadPendingResults();
          },
          error: (err) => {
            console.error('Error setting winner:', err);
            this.isLoading = false;
            const errorMsg = err.error?.error || 'Error al asignar ganador';
            this.snackBar.open(errorMsg, 'Cerrar', { duration: 5000 });
          }
        });
      }
    });
  }

  markAsPaid(challengeId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Pago',
        message: '¿Estás seguro que el premio ha sido pagado al ganador?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.challengeService.markAsPaid(challengeId).subscribe({
          next: () => {
            // Actualizar lista local
            const challengeIndex = this.pendingResults.findIndex(p => p.challengeId === challengeId);
            if (challengeIndex !== -1) {
              this.pendingResults[challengeIndex].challenge!.isPaidToWinner = true;
              this.pendingResults = [...this.pendingResults]; // Trigger change detection
            }

            this.snackBar.open('Reto marcado como pagado', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error marking as paid', err);
            this.snackBar.open('Error al marcar como pagado', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-code-viewer-dialog',
  template: `
    <h2 mat-dialog-title>Código del Participante</h2>
    <mat-dialog-content>
      <pre>{{ data.code }}</pre>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    pre {
      white-space: pre-wrap;
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      max-height: 60vh;
      overflow: auto;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ]
})
export class CodeViewerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CodeViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { code: string }
  ) { }
}

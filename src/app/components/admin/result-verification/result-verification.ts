import { Component, Inject, OnInit, inject } from '@angular/core';
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
import { CommonModule, DatePipe } from '@angular/common';

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
    MatProgressSpinnerModule,
    DatePipe
  ]
})
export class ResultVerification implements OnInit {
  pendingResults: Participation[] = [];
  isLoading = true;
  displayedColumns: string[] = ['user', 'challenge', 'score', 'code', 'actions'];

  constructor(
    private participationService: ParticipationService,
    private challengeService: ChallengeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadPendingResults();
  }

  loadPendingResults() {
    this.isLoading = true;
    this.participationService.getParticipationsByChallenge('').subscribe({
      next: (participations) => {
        this.pendingResults = participations.filter(p =>
          p.paymentStatus === 'confirmed' && p.score && !p.challenge?.winnerUserId
        );
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error('Error loading pending results', err);
        this.isLoading = false;
        this.snackBar.open('Error al cargar resultados pendientes', 'Cerrar', { duration: 3000 });
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
    if (!participation.challengeId || !participation.userId || !participation.score) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Ganador',
        message: `¿Estás seguro que ${participation.user?.username} es el ganador del reto "${participation.challenge?.title}" con ${participation.score} puntos?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && participation.challengeId && participation.userId && participation.score) {
        this.challengeService.setWinner(
          participation.challengeId,
          participation.userId,
          participation.score
        ).subscribe({
          next: () => {
            this.pendingResults = this.pendingResults.filter(p => p.challengeId !== participation.challengeId);
            this.snackBar.open('Ganador asignado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err: Error) => {
            console.error('Error setting winner', err);
            this.snackBar.open('Error al asignar ganador', 'Cerrar', { duration: 3000 });
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
    DatePipe,
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
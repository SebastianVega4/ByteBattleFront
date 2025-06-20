import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../../services/challenge';
import { Challenge } from '../../../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ChallengeFormDialogComponent } from '../challenge-form-dialog/challenge-form-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-challenge-management',
  templateUrl: './challenge-management.html',
  styleUrls: ['./challenge-management.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    DatePipe,
    CurrencyPipe
  ]
})
export class ChallengeManagement implements OnInit {
  challenges: Challenge[] = [];
  displayedColumns: string[] = ['title', 'status', 'dates', 'cost', 'participants', 'actions'];
  isLoading = true;

  constructor(
    private challengeService: ChallengeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadChallenges();
  }

  loadChallenges() {
    this.isLoading = true;
    this.challengeService.getChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading challenges', err);
        this.isLoading = false;
        this.snackBar.open('Error al cargar retos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openChallengeForm(challenge?: Challenge) {
    const dialogRef = this.dialog.open(ChallengeFormDialogComponent, {
      width: '600px',
      data: { challenge }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChallenges();
      }
    });
  }

  updateChallengeStatus(challenge: Challenge, newStatus: 'próximo' | 'activo' | 'pasado') {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar cambio de estado',
        message: `¿Estás seguro que deseas cambiar el estado del reto "${challenge.title}" a "${newStatus}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.challengeService.updateChallengeStatus(challenge.id, newStatus).subscribe({
          next: () => {
            challenge.status = newStatus;
            this.snackBar.open('Estado actualizado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error updating challenge status', err);
            this.snackBar.open('Error al actualizar estado', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  markAsPaid(challenge: Challenge) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar pago',
        message: `¿Estás seguro que has realizado el pago al ganador del reto "${challenge.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.challengeService.markChallengeAsPaid(challenge.id).subscribe({
          next: () => {
            challenge.isPaidToWinner = true;
            this.snackBar.open('Reto marcado como pagado', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error marking challenge as paid', err);
            this.snackBar.open('Error al marcar como pagado', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}